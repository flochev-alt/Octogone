// GET /api/photos?names=Ilia Topuria|Justin Gaethje (25 noms max)
// Cherche une photo libre de droits (Wikimedia Commons) de chaque combattant, parmi :
// la photo de son infobox Wikipédia (en, puis fr), les fichiers Commons portant son nom complet
// et ceux de sa catégorie Commons. On garde la plus récente (puis prise en événement UFC, puis la plus grande).
// Les photos trop petites (< 500 px de large) sont écartées. Renvoie une version HD (1200 px),
// l'auteur et la licence pour le crédit affiché sur le site. Réponse mise en cache 7 jours par Vercel.
const UA = "Octogone/1.0 (https://octogone.space)";

// La page doit bien parler d'un combattant (évite les homonymes : chanteur, footballeur…).
const FIGHTER = /mixed martial|martial art|\bMMA\b|fighter|wrestler|kickbox|boxer|judoka|sambo|arts martiaux|combattant|lutteur|boxeur/i;

const api = async (host, params) => {
  const r = await fetch(`https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...params }), {
    headers: { "User-Agent": UA },
  });
  if (!r.ok) throw new Error(`${host} ${r.status}`);
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
    });
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
      .catch(() => []);
  const [byTitle, byCategory] = await Promise.all([
    search(`intitle:"${name}" filetype:bitmap`),
    search(`incategory:"${name}" filetype:bitmap`),
  ]);
  return [...new Set([
    ...byTitle.filter((f) => norm(f).includes(n)),
    ...byCategory.filter((f) => norm(f).includes(last)),
  ])].slice(0, 15);
}

// Meilleure photo : la plus récente d'abord, puis celle prise en événement UFC, puis la plus grande.
const ufc = (c) => (/ufc/i.test(c.page) ? 1 : 0);
const best = (list) =>
  list.filter(Boolean).sort((a, b) => (b.date || "0").localeCompare(a.date || "0") || ufc(b) - ufc(a) || b.width - a.width)[0];

export default async function handler(req, res) {
  const names = String(req.query.names || "").split("|").map((n) => n.trim()).filter(Boolean).slice(0, 25);
  if (!names.length) return res.status(400).json({ error: "names manquant" });
  try {
    // Photo de l'infobox (en, puis fr) + recherches Commons, pour chaque combattant.
    const infobox = await infoboxFiles("en", names);
    const missing = names.filter((n) => !infobox[n]);
    if (missing.length) Object.assign(infobox, await infoboxFiles("fr", missing));
    const found = [];
    for (let i = 0; i < names.length; i += 5) {
      // 5 combattants à la fois, pour rester poli avec l'API Wikimedia.
      found.push(...(await Promise.all(names.slice(i, i + 5).map((n) => commonsSearch(n).catch(() => [])))));
    }
    const files = names.map((n, k) => [...new Set([infobox[n], ...found[k]].filter(Boolean))]);
    const info = await commonsInfo(files.flat());
    const photos = {};
    names.forEach((name, k) => {
      const pick = best(files[k].map((f) => info[f.replace(/ /g, "_")]));
      if (pick) photos[name] = pick;
    });
    res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate=86400");
    res.status(200).json(photos);
  } catch (e) {
    res.status(502).json({ error: "Photos indisponibles." });
  }
}
