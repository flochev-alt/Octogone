// Outil de contrôle (temporaire) : 1) licence des vidéos YouTube sources ; 2) pages Commons des fichiers
// retenus (bandeaux de suppression / revue de licence) ; 3) photos Commons dont la DESCRIPTION cite un
// combattant UFC sans photo (ex. photos de l'armée américaine en visite de l'UFC).
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";
const UA = "OctogonePhotos/1.0 (https://octogone.space)";
const get = (u) => fetch(u, { headers: { "User-Agent": UA, "Accept-Language": "en" }, signal: AbortSignal.timeout(20000) }).then((r) => r.text()).catch((e) => "ERR " + e);
mkdirSync("verif", { recursive: true });
const out = {};
for (const v of ["fvmm5DNfj-U", "SK-YB5BDDqU", "jBgEnXJzL80", "O0rP3x-9Pig"]) {
  const h = await get(`https://www.youtube.com/watch?v=${v}`);
  out["yt " + v] = { cc: /creativeCommons|Creative Commons|"license":"[^"]*"/i.exec(h)?.[0] || "none", title: /<title>([^<]*)/.exec(h)?.[1], len: h.length };
}
for (const f of ["Khamzat_Chimaev_2022.png", "Mackenzie_Dern.png", "BrendanAllen.png", "SeanBrady.jpg", "Vitor_Petrino.png", "Johnny_Walker_(lutador)_2025.jpg", "AFSOC_celebrates_Outstanding_Airmen_of_the_Year_(5).jpg", "Alexander_Volkov_in_M-1_(cropped).jpg", "WelingtonTurman.jpg"]) {
  const h = await get(`https://commons.wikimedia.org/w/index.php?title=File:${encodeURIComponent(f)}&action=raw`);
  out["raw " + f] = h.slice(0, 1500);
}
const photos = JSON.parse(readFileSync("public/photos.json", "utf8"));
const missing = FIGHTERS.filter((f) => !photos[f.nom]).map((f) => f.nom);
const hits = {};
for (const q of ['"UFC fighter"', '"Ultimate Fighting Championship"', '"UFC" fighter troops', '"UFC Freedom 250"', '"UFC" weigh-in', '"UFC" open workouts', '"mixed martial arts" UFC']) {
  for (let off = 0; off < 500; off += 50) {
    const d = await fetch("https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ action: "query", list: "search", srnamespace: "6", srlimit: "50", sroffset: String(off), srsearch: q + " filetype:bitmap", srprop: "snippet", format: "json" }), { headers: { "User-Agent": UA } }).then((r) => r.json()).catch(() => ({}));
    const res = d.query?.search || [];
    for (const r of res) {
      const text = (r.title + " " + r.snippet).replace(/<[^>]*>/g, "");
      for (const n of missing) {
        const last = n.split(" ").slice(-1)[0];
        if (text.toLowerCase().includes(n.toLowerCase()) || (last.length > 5 && new RegExp(`\\b${last}\\b`, "i").test(text))) (hits[n] ||= []).push(r.title + " :: " + text.slice(0, 200));
      }
    }
    if (res.length < 50) break;
  }
}
out.hits = hits;
writeFileSync("verif/verif.json", JSON.stringify(out, null, 1));
