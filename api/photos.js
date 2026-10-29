// GET /api/photos?names=Ilia Topuria|Justin Gaethje (50 noms max)
// Cherche une photo libre de droits de chaque combattant :
// 1. la photo de l'infobox Wikipédia (en, puis fr), gardée seulement si elle est sur Wikimedia Commons ;
// 2. sinon, une recherche directe sur Commons parmi les fichiers dont le nom contient le nom complet
//    du combattant (la plus récente).
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
      date: stripHtml(meta.DateTimeOriginal?.value).slice(0, 10),
      width: ii.width,
    };
  }
  return out;
}

// Recherche directe sur Commons : fichiers image dont le titre contient le nom complet du combattant.
async function commonsSearch(name) {
  const data = await api("commons.wikimedia.org", {
    action: "query", list: "search", srnamespace: "6", srlimit: "10",
    srsearch: `intitle:"${name}" filetype:bitmap`,
  });
  const n = norm(name);
  return (data.query?.search || [])
    .map((r) => r.title.replace(/^File:/, ""))
    .filter((f) => norm(f).includes(n))
    .slice(0, 6);
}

export default async function handler(req, res) {
  const names = String(req.query.names || "").split("|").map((n) => n.trim()).filter(Boolean).slice(0, 50);
  if (!names.length) return res.status(400).json({ error: "names manquant" });
  try {
    const files = await infoboxFiles("en", names);
    const missing = names.filter((n) => !files[n]);
    if (missing.length) Object.assign(files, await infoboxFiles("fr", missing));
    const info = await commonsInfo(Object.values(files));
    const photos = {};
    for (const [name, file] of Object.entries(files)) {
      const i = info[file.replace(/ /g, "_")];
      if (i) photos[name] = i;
    }

    // Pas de photo d'infobox exploitable : recherche directe sur Commons, on garde la plus récente.
    const rest = names.filter((n) => !photos[n]);
    const found = [];
    for (let i = 0; i < rest.length; i += 10) {
      // 10 recherches à la fois, pour rester poli avec l'API Wikimedia.
      found.push(...(await Promise.all(rest.slice(i, i + 10).map((n) => commonsSearch(n).catch(() => [])))));
    }
    const candidates = await commonsInfo(found.flat());
    rest.forEach((name, k) => {
      const best = found[k]
        .map((f) => candidates[f.replace(/ /g, "_")])
        .filter(Boolean)
        .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.width - a.width)[0];
      if (best) photos[name] = best;
    });
    res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate=86400");
    res.status(200).json(photos);
  } catch (e) {
    res.status(502).json({ error: "Photos indisponibles." });
  }
}
