// Génère public/photos.json : une photo libre de droits pour chaque combattant du site
// (src/fightersData.js + affiches de src/mediaData.js). Usage : node scripts/fetch-photos.mjs
// Lancé par le workflow « Photos combattants » (chaque semaine, ou à la main) : Wikipédia limite les
// requêtes venant de Vercel, donc les photos sont cherchées une fois ici puis servies en fichier statique.
// Sources : la photo de l'infobox Wikipédia (en, puis fr), les fichiers Commons portant son nom complet,
// ceux de sa catégorie Commons, et, si Commons n'a rien de récent, les photos libres trouvées par
// Openverse (Flickr notamment). On garde la plus récente (puis prise en événement UFC, puis la plus grande).
// Les photos trop petites (< 500 px de large) sont écartées. Version HD (1200 px), auteur et licence
// pour le crédit affiché sur le site. Un combattant introuvable cette fois garde sa photo précédente.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";
import { UPCOMING, RECENT_CARDS } from "../src/mediaData.js";

const UA = "Octogone/1.0 (https://octogone.space)";
// Chaque appel externe est coupé au bout de 4 s : un service lent ne doit pas bloquer toute la réponse.
const TIMEOUT = 15000;
const errors = [];
const note = (where) => (e) => { errors.push(`${where}: ${e?.message || e}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Appel HTTP poli : en cas de 429 (trop de requêtes), on attend puis on réessaie (4 fois max).
async function get(url) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT) });
    if (r.status !== 429 || attempt >= 4) return r;
    await sleep((Number(r.headers.get("retry-after")) || 5 * 2 ** attempt) * 1000);
  }
}

// La page doit bien parler d'un combattant (évite les homonymes : chanteur, footballeur…).
const FIGHTER = /mixed martial|martial art|\bMMA\b|fighter|wrestler|kickbox|boxer|judoka|sambo|arts martiaux|combattant|lutteur|boxeur/i;

const api = async (host, params) => {
  const r = await get(`https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...params }));
  if (!r.ok) throw new Error(`${host} ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

// Nom du site -> fichier image de l'infobox, sur une Wikipédia donnée.
async function infoboxFiles(lang, names) {
  const data = await api(`${lang}.wikipedia.org`, {
    action: "query", redirects: "1", titles: names.join("|"),
    prop: "pageimages|description|pageprops", piprop: "name", ppprop: "disambiguation",
  });
  const q = data.query || {};
  const hop = {};
  for (const { from, to } of [...(q.normalized || []), ...(q.redirects || [])]) hop[from] = to;
  const pages = Object.fromEntries((q.pages || []).map((p) => [p.title, p]));
  const out = {};
  for (const name of names) {
    let title = name;
    for (let i = 0; i < 3 && hop[title]; i++) title = hop[title];
    const p = pages[title];
    if (p && !p.missing && p.pageimage && !p.pageprops?.disambiguation && FIGHTER.test(p.description || "")) {
      out[name] = p.pageimage;
    }
  }
  return out;
}

const stripHtml = (s = "") => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const MIN_WIDTH = 500;

// Fichiers -> URL de la vignette + auteur + licence, uniquement pour ceux présents sur Commons.
async function commonsInfo(files) {
  const unique = [...new Set(files)];
  const out = {};
  // L'API Commons accepte 50 fichiers par requête.
  const pages = [];
  for (let i = 0; i < unique.length; i += 50) {
    const data = await api("commons.wikimedia.org", {
      action: "query", titles: unique.slice(i, i + 50).map((f) => `File:${f}`).join("|"),
      prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "1200",
    }).catch((e) => (note("commonsInfo")(e), {}));
    pages.push(...(data.query?.pages || []));
  }
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (p.missing || !ii) continue;
    const meta = ii.extmetadata || {};
    if (meta.NonFree?.value === "true" || ii.width < MIN_WIDTH) continue;
    out[p.title.replace(/^File:/, "").replace(/ /g, "_")] = {
      url: ii.thumburl || ii.url,
      author: stripHtml(meta.Artist?.value),
      license: stripHtml(meta.LicenseShortName?.value) || "",
      page: ii.descriptionurl,
      source: "Wikimedia Commons",
      date: stripHtml(meta.DateTimeOriginal?.value || meta.DateTime?.value).slice(0, 10),
      width: ii.width,
    };
  }
  return out;
}

// Recherches directes sur Commons pour un combattant :
// - fichiers dont le titre contient son nom complet ;
// - fichiers de sa catégorie Commons (« Category:Nom »), si le titre contient au moins son nom de famille.
async function commonsSearch(name) {
  const n = norm(name);
  const last = norm(name.split(" ").slice(-1)[0]);
  const search = (srsearch) =>
    api("commons.wikimedia.org", { action: "query", list: "search", srnamespace: "6", srlimit: "20", srsearch })
      .then((d) => (d.query?.search || []).map((r) => r.title.replace(/^File:/, "")))
      .catch((e) => (note("commonsSearch")(e), []));
  const [byTitle, byCategory] = await Promise.all([
    search(`intitle:"${name}" filetype:bitmap`),
    search(`incategory:"${name}" filetype:bitmap`),
  ]);
  return [...new Set([
    ...byTitle.filter((f) => norm(f).includes(n)),
    ...byCategory.filter((f) => norm(f).includes(last)),
  ])].slice(0, 15);
}

// Openverse (moteur de recherche d'images libres, sans clé) : photos Flickr et autres sous licence
// libre autorisant l'usage commercial (CC BY, CC BY-SA, CC0, domaine public), en HD, dont le titre
// ou les tags contiennent le nom complet du combattant. Openverse ne donne pas la date de prise de vue.
const AGENCY = /getty|zuffa|usa ?today|imagn|reuters|\bafp\b|associated ?press|\bap photo|shutterstock|alamy/i;
const LICENSE_NAMES = { by: "CC BY", "by-sa": "CC BY-SA", cc0: "CC0", pdm: "Public Domain Mark" };
async function openverseSearch(name) {
  const r = await get("https://api.openverse.org/v1/images/?" + new URLSearchParams({
    q: `"${name}"`, license: "by,by-sa,cc0,pdm", category: "photograph", page_size: "20", mature: "false",
  }));
  if (!r.ok) throw new Error(`openverse ${r.status} ${(await r.text()).slice(0, 200)}`);
  const n = norm(name);
  return ((await r.json()).results || [])
    .filter((p) => p.source !== "wikimedia") // Commons est déjà interrogé directement
    // Les tags Flickr sont souvent collés (« iliatopuria ») : on teste les deux formes.
    .filter((p) => {
      const text = `${p.title || ""} ${(p.tags || []).map((t) => t.name).join(" ")}`;
      return norm(text).includes(n) || norm(text).replace(/ /g, "").includes(n.replace(/ /g, ""));
    })
    // Écarte les photos d'agence republiées sous une licence libre par erreur.
    .filter((p) => !AGENCY.test(`${p.title} ${p.creator}`))
    .map((p) => ({
      url: p.url,
      width: p.width || 0,
      author: p.creator || "",
      license: [LICENSE_NAMES[p.license] || p.license?.toUpperCase(), p.license_version].filter(Boolean).join(" "),
      page: p.foreign_landing_url,
      source: p.source === "flickr" ? "Flickr" : p.provider || p.source || "Openverse",
      date: "",
      ufc: /ufc/i.test(`${p.title} ${(p.tags || []).map((t) => t.name).join(" ")}`),
    }))
    .filter((p) => p.url && p.width >= 1000);
}

// Meilleure photo : la plus récente d'abord, puis celle prise en événement UFC, puis la plus grande.
const ufc = (c) => (c.ufc || /ufc/i.test(c.page) ? 1 : 0);
const best = (list) =>
  list.filter(Boolean).sort((a, b) => (b.date || "0").localeCompare(a.date || "0") || ufc(b) - ufc(a) || b.width - a.width)[0];

async function findPhotos(names) {
  // Une étape qui échoue n'annule pas les autres : on renvoie ce qu'on a trouvé.
  const [infobox, found] = await Promise.all([
    infoboxFiles("en", names).catch((e) => (note("infobox en")(e), {})),
    Promise.all(names.map((n) => commonsSearch(n).catch(() => []))),
  ]);
  const missing = names.filter((n) => !infobox[n]);
  if (missing.length) Object.assign(infobox, await infoboxFiles("fr", missing).catch((e) => (note("infobox fr")(e), {})));
  const files = names.map((n, k) => [...new Set([infobox[n], ...found[k]].filter(Boolean))]);
  const info = await commonsInfo(files.flat());
  // Openverse seulement pour ceux sans photo Commons récente (moins de 3 ans), pour ménager son quota.
  const recent = new Date(Date.now() - 3 * 365 * 864e5).toISOString().slice(0, 10);
  const others = await Promise.all(names.map((n, k) => {
    const fromCommons = best(files[k].map((f) => info[f.replace(/ /g, "_")]));
    return fromCommons?.date >= recent ? [] : openverseSearch(n).catch((e) => (note("openverse")(e), []));
  }));
  const photos = {};
  names.forEach((name, k) => {
    // Openverse n'a pas de date : on préfère sa photo d'événement UFC à une photo Commons ancienne.
    const fromCommons = best(files[k].map((f) => info[f.replace(/ /g, "_")]));
    const fromOpenverse = best(others[k]);
    const pick = fromCommons && (fromCommons.date >= recent || !fromOpenverse?.ufc) ? fromCommons : fromOpenverse || fromCommons;
    if (pick) photos[name] = pick;
  });
  return photos;
}

const names = [...new Set([
  ...FIGHTERS.map((f) => f.nom),
  ...[...UPCOMING, ...RECENT_CARDS].flatMap((c) => c.fighters || []),
])];
const out = "public/photos.json";
const previous = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
const photos = {};
// 5 combattants à la fois, avec une pause, pour respecter les limites de Wikimedia.
for (let i = 0; i < names.length; i += 5) {
  Object.assign(photos, await findPhotos(names.slice(i, i + 5)));
  await sleep(1000);
}
for (const n of names) if (!photos[n] && previous[n]) photos[n] = previous[n];
const sorted = Object.fromEntries(Object.keys(photos).sort().map((n) => [n, photos[n]]));
writeFileSync(out, JSON.stringify(sorted, null, 1) + "\n");
console.log(`${Object.keys(photos).length}/${names.length} combattants avec photo.`);
const missing = names.filter((n) => !photos[n]);
if (missing.length) console.log("Sans photo :", missing.join(", "));
if (errors.length) console.log("Erreurs :", [...new Set(errors)].slice(0, 20).join("\n"));
