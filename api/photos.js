// GET /api/photos?names=Ilia Topuria|Justin Gaethje (50 noms max)
// Cherche la photo de l'infobox Wikipédia de chaque combattant et ne la garde que si elle est
// hébergée sur Wikimedia Commons (donc sous licence libre). Renvoie l'auteur et la licence pour
// le crédit affiché sur le site. Réponse mise en cache 7 jours par Vercel.
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

// Fichiers -> URL de la vignette + auteur + licence, uniquement pour ceux présents sur Commons.
async function commonsInfo(files) {
  const unique = [...new Set(files)];
  if (!unique.length) return {};
  const data = await api("commons.wikimedia.org", {
    action: "query", titles: unique.map((f) => `File:${f}`).join("|"),
    prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "600",
  });
  const out = {};
  for (const p of data.query?.pages || []) {
    const ii = p.imageinfo?.[0];
    if (p.missing || !ii) continue;
    const meta = ii.extmetadata || {};
    if (meta.NonFree?.value === "true") continue;
    out[p.title.replace(/^File:/, "").replace(/ /g, "_")] = {
      url: ii.thumburl || ii.url,
      author: stripHtml(meta.Artist?.value),
      license: stripHtml(meta.LicenseShortName?.value) || "",
      page: ii.descriptionurl,
    };
  }
  return out;
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
    res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate=86400");
    res.status(200).json(photos);
  } catch (e) {
    res.status(502).json({ error: "Photos indisponibles." });
  }
}
