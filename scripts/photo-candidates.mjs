// Outil de contrôle (temporaire) : pour chaque combattant sans photo, liste TOUTES les photos libres
// candidates (Wikipédia multi-langues, Wikidata, Commons, Openverse) avec leurs métadonnées et une
// miniature, pour vérification humaine de l'identité. Sortie : candidats/ (index.json + miniatures).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";
const UA = "OctogonePhotos/1.0 (https://octogone.space)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  for (let a = 0; ; a++) {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) }).catch(() => null);
    if (r && r.status !== 429) return r;
    if (a >= 2) return r;
    await sleep(3000 * 2 ** a);
  }
}
const j = async (url) => { const r = await get(url); return r && r.ok ? r.json() : {}; };
const api = (host, p) => j(`https://${host}/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...p }));
const strip = (s = "") => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const photos = JSON.parse(readFileSync("public/photos.json", "utf8"));
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const list = FIGHTERS.filter((f) => !photos[f.nom] && f.categorie !== "Legendes" || (only && only.includes(f.nom)))
  .filter((f) => !only || only.includes(f.nom))
  .filter((f, i) => !process.env.SHARD || i % Number(process.env.SHARDS) === Number(process.env.SHARD));
mkdirSync("candidats", { recursive: true });
const index = {};
const LANGS = ["en", "fr", "pt", "es", "ru", "pl"];
for (const f of list) {
  const name = f.nom;
  const files = new Map(); // file -> origins
  const add = (file, why) => { if (!file) return; file = file.replace(/^File:/i, "").replace(/_/g, " "); files.set(file, [...(files.get(file) || []), why]); };
  const wiki = {};
  // Wikipédia (plusieurs langues) : description + image infobox + qid
  for (const lang of LANGS) {
    const d = await api(`${lang}.wikipedia.org`, { action: "query", redirects: "1", titles: name, prop: "pageimages|description|pageprops", piprop: "name" });
    const p = d.query?.pages?.[0];
    if (p && !p.missing) {
      wiki[lang] = { title: p.title, desc: p.description || "", qid: p.pageprops?.wikibase_item, disambig: !!p.pageprops?.disambiguation, image: p.pageimage };
      if (p.pageimage && !p.pageprops?.disambiguation) add(p.pageimage, `infobox ${lang} (${p.description || ""})`);
    }
  }
  // Wikidata : recherche, garde les entités dont la description parle de MMA
  const wd = await j("https://www.wikidata.org/w/api.php?" + new URLSearchParams({ action: "wbsearchentities", search: name, language: "en", format: "json", limit: "10" }));
  const qids = [];
  for (const e of wd.search || []) if (/mixed martial|mma|fighter|martial/i.test(e.description || "")) qids.push([e.id, e.description]);
  for (const l of Object.values(wiki)) if (l.qid && !qids.find((q) => q[0] === l.qid)) qids.push([l.qid, "via wiki"]);
  const wdInfo = [];
  for (const [qid, desc] of qids) {
    const e = (await j(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`)).entities?.[qid];
    if (!e) continue;
    const dob = e.claims?.P569?.[0]?.mainsnak?.datavalue?.value?.time;
    const p18 = (e.claims?.P18 || []).map((c) => c.mainsnak?.datavalue?.value);
    const sherdog = e.claims?.P2818?.[0]?.mainsnak?.datavalue?.value, tapology = e.claims?.P10283?.[0]?.mainsnak?.datavalue?.value;
    const commonsCat = e.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
    wdInfo.push({ qid, desc, dob, p18, sherdog, tapology, commonsCat });
    p18.forEach((x) => add(x, `wikidata P18 ${qid} (${desc}, né ${dob})`));
    if (commonsCat) {
      const c = await api("commons.wikimedia.org", { action: "query", list: "categorymembers", cmtitle: `Category:${commonsCat}`, cmtype: "file", cmlimit: "50" });
      (c.query?.categorymembers || []).forEach((m) => add(m.title, `catégorie Commons ${commonsCat} (${qid})`));
    }
  }
  // Commons : titre, catégorie, plein texte
  for (const q of [`intitle:"${name}"`, `incategory:"${name}"`, `"${name}" UFC`, `"${name}" MMA`, `"${name}"`]) {
    const d = await api("commons.wikimedia.org", { action: "query", list: "search", srnamespace: "6", srlimit: "30", srsearch: q + " filetype:bitmap" });
    (d.query?.search || []).forEach((r) => add(r.title, `recherche Commons ${q}`));
  }
  // Infos fichiers
  const arr = [...files.keys()].slice(0, 45);
  const cands = [];
  for (let i = 0; i < arr.length; i += 40) {
    const d = await api("commons.wikimedia.org", { action: "query", titles: arr.slice(i, i + 40).map((x) => "File:" + x).join("|"), prop: "imageinfo|categories", cllimit: "max", iiprop: "url|size|extmetadata", iiurlwidth: "500" });
    for (const p of d.query?.pages || []) {
      const ii = p.imageinfo?.[0]; if (!ii) continue;
      const m = ii.extmetadata || {};
      const file = p.title.replace(/^File:/, "");
      cands.push({ file, why: files.get(file) || [], width: ii.width, height: ii.height, thumb: ii.thumburl, page: ii.descriptionurl,
        date: strip(m.DateTimeOriginal?.value || m.DateTime?.value), author: strip(m.Artist?.value), license: strip(m.LicenseShortName?.value),
        nonfree: m.NonFree?.value, desc: strip(m.ImageDescription?.value).slice(0, 400), credit: strip(m.Credit?.value).slice(0, 200),
        cats: (p.categories || []).map((c) => c.title.replace("Category:", "")).join(" | ").slice(0, 600) });
    }
  }
  // Openverse
  const ov = await j("https://api.openverse.org/v1/images/?" + new URLSearchParams({ q: `"${name}"`, license: "by,by-sa,cc0,pdm", page_size: "20", mature: "false" }));
  for (const p of ov.results || []) {
    if (p.source === "wikimedia") continue;
    cands.push({ file: `openverse:${p.id}`, why: ["openverse"], width: p.width, height: p.height, thumb: p.thumbnail, full: p.url, page: p.foreign_landing_url,
      author: p.creator, license: `${p.license} ${p.license_version || ""}`, desc: (p.title || "").slice(0, 300), cats: (p.tags || []).map((t) => t.name).join(" | ").slice(0, 400), source: p.source });
  }
  const slug = name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_");
  let k = 0;
  for (const c of cands) {
    if (!c.thumb || (c.width && c.width < 400)) continue;
    const r = await get(c.thumb);
    if (r?.ok) { c.local = `${slug}__${String(k++).padStart(2, "0")}.jpg`; writeFileSync(`candidats/${c.local}`, Buffer.from(await r.arrayBuffer())); }
  }
  index[name] = { rang: f.rang, categorie: f.categorie, naissance: f.naissance, wiki, wikidata: wdInfo, cands };
  console.log(name, cands.length);
  writeFileSync("candidats/index-" + (process.env.SHARD || "all") + ".json", JSON.stringify(index, null, 1));
}
