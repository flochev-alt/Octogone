// Outil de contrôle (temporaire) : liste les photos libres possibles pour quelques combattants,
// avec une miniature de chacune, pour choisir à l'œil la bonne personne.
// Usage : node scripts/photo-candidates.mjs "Anderson Silva" "Sean Strickland"
import { writeFileSync, mkdirSync } from "node:fs";
const UA = "OctogonePhotos/1.0 (https://octogone.space)";
const get = (u) => fetch(u, { headers: { "User-Agent": UA } });
const api = async (p) => (await get("https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ format: "json", formatversion: "2", ...p }))).json();
mkdirSync("cand", { recursive: true });
const lines = [];
for (const name of process.argv.slice(2)) {
  const files = new Set();
  for (const q of [`"${name}"`, `"${name}" UFC`, `"${name}" MMA`]) {
    const d = await api({ action: "query", list: "search", srnamespace: "6", srlimit: "50", srsearch: q });
    for (const r of d.query?.search || []) files.add(r.title);
  }
  for (const cat of [`Category:${name}`, `Category:${name} (fighter)`]) {
    const d = await api({ action: "query", list: "categorymembers", cmtitle: cat, cmtype: "file", cmlimit: "100" });
    for (const r of d.query?.categorymembers || []) files.add(r.title);
  }
  const list = [...files].filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  for (let i = 0; i < list.length; i += 40) {
    const d = await api({ action: "query", titles: list.slice(i, i + 40).join("|"), prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "240" });
    for (const p of d.query?.pages || []) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const m = ii.extmetadata || {};
      const strip = (s = "") => String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
      const k = `${name.replace(/\W+/g, "_")}__${lines.length}`;
      lines.push([k, p.title, ii.width, strip(m.DateTimeOriginal?.value), strip(m.LicenseShortName?.value), strip(m.Artist?.value), strip(m.ImageDescription?.value)].join("\t"));
      try {
        const r = await get(ii.thumburl);
        if (r.ok) writeFileSync(`cand/${k}.jpg`, Buffer.from(await r.arrayBuffer()));
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}
writeFileSync("cand/list.tsv", lines.join("\n") + "\n");
console.log(lines.length, "candidats");
