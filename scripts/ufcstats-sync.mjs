// Statistiques de carrière UFC recalculées à partir des feuilles de match officielles (UFCStats),
// via le jeu de données public github.com/Greco1899/scrape_ufc_stats (mis à jour après chaque événement).
// C'est la source d'origine des chiffres repris par UFC.com, Agent MMA, BJJ Metrics, ESPN...
// Usage :
//   node scripts/ufcstats-sync.mjs            -> rapport des écarts avec src/fightersData.js (rien n'est modifié)
//   node scripts/ufcstats-sync.mjs --write    -> écrit src/ufcCareer.js et corrige striking / tdAcc / tdDef
//   UFCSTATS_DIR=/chemin node scripts/...     -> lit les CSV déjà téléchargés dans ce dossier
// Règles : un pourcentage n'est écrit que si l'échantillon est suffisant (MIN_ATT tentatives) ;
// sinon la valeur devient null (inconnue) et l'IA comme le Simulateur l'ignorent.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";
import { RECENT_FIGHTS } from "../src/recentFights.js";

const BASE = "https://raw.githubusercontent.com/Greco1899/scrape_ufc_stats/main/";
const FILES = ["ufc_fight_stats.csv", "ufc_fight_results.csv", "ufc_event_details.csv", "ufc_fighter_tott.csv"];
const MIN_ATT = { striking: 60, tdAcc: 5, tdDef: 5 };
const WRITE = process.argv.includes("--write");

async function load(name) {
  const dir = process.env.UFCSTATS_DIR;
  if (dir && existsSync(`${dir}/${name}`)) return readFileSync(`${dir}/${name}`, "utf8");
  const r = await fetch(BASE + name);
  if (!r.ok) throw new Error(`${name} : ${r.status}`);
  return r.text();
}

// CSV avec guillemets (les détails d'arbitrage contiennent des virgules).
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i].trim()])));
}

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ł/g, "l").replace(/-/g, " ").replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
const tokens = (s) => norm(REVERSE[s] || s).replace(/\b(jr|junior)\b/g, "").split(" ").filter(Boolean).sort().join(" ");
// Noms écrits autrement sur UFCStats.
const ALIAS = {
  "Abusupiyan Magomedov": "Abus Magomedov",
  "Sharabutdin Magomedov": "Shara Magomedov",
  "Beatriz Mesquita": "Bia Mesquita",
  "Mizuki Inoue": "Mizuki",
};
// Nom UFCStats -> nom du site (adversaires des derniers combats).
const REVERSE = Object.fromEntries(Object.entries(ALIAS).map(([a, b]) => [b, a]));
// Mêmes adversaires écrits autrement sur le site (contrôle du dernier combat seulement).
const SAME_OPPONENT = [["Jose Delgado", "José Miguel Delgado"], ["Eduardo Chapolin", "Eduardo Henrique"], ["Daria Zhelezniakova", "Darya Zheleznyakova"]];
const sameOpp = (x, y) => tokens(x) === tokens(y) || SAME_OPPONENT.some((p) => p.some((n) => tokens(n) === tokens(x)) && p.some((n) => tokens(n) === tokens(y)));
// Résultats annulés après coup (dopage...) que UFCStats n'a pas encore corrigés : le site fait foi.
const OVERTURNED = ["f222"];
// Combattants inscrits sous deux noms dans le jeu de données : on les regroupe.
const CANON = { "Patricio Freire": "Patricio Pitbull" };
const canon = (n) => CANON[n.trim()] || n.trim();
// Homonymes vérifiés à la main : l'autre combattant du même nom n'a aucune feuille de match détaillée.
const HOMONYMS_OK = ["Jean Silva"];
const ofPair = (s) => s.split(" of ").map((x) => parseInt(x, 10) || 0);
const secs = (t) => { const [m, s] = t.split(":").map(Number); return (m || 0) * 60 + (s || 0); };
const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
const isoDate = (d) => { const m = d.match(/(\w+) (\d+), (\d{4})/); return m ? `${m[3]}-${String(MONTHS[m[1]]).padStart(2, "0")}-${m[2].padStart(2, "0")}` : null; };
const pct = (l, a, min) => (a >= min ? Math.round((100 * l) / a) : null);

const [statsCsv, resultsCsv, eventsCsv, tottCsv] = await Promise.all(FILES.map(load));
const stats = parseCsv(statsCsv), results = parseCsv(resultsCsv), events = parseCsv(eventsCsv), tott = parseCsv(tottCsv);

const eventDate = new Map(events.map((e) => [e.EVENT.trim(), isoDate(e.DATE)]));
const fightKey = (ev, bout) => `${ev.trim()}|${bout.trim().replace(/\s+/g, " ")}`;
const fightInfo = new Map();
// Le jeu de données liste parfois un même événement sous deux noms (« Noche UFC » / « UFC Fight Night ») :
// on ne garde que les événements datés, et un seul combat par date et par paire de combattants.
const seen = new Set();
for (const r of results) {
  const [a, b] = r.BOUT.split(" vs. ").map(canon);
  const date = eventDate.get(r.EVENT.trim());
  const pair = `${date}|${[a, b].sort().join("|")}`;
  if (!date || seen.has(pair)) continue;
  seen.add(pair);
  const [oa, ob] = r.OUTCOME.split("/");
  fightInfo.set(fightKey(r.EVENT, r.BOUT), {
    event: r.EVENT.trim(), date, a, b, oa, ob, a0: r.BOUT.split(" vs. ")[0].trim(), b0: r.BOUT.split(" vs. ")[1]?.trim(),
    method: r.METHOD.trim(), round: Number(r.ROUND) || null, time: r.TIME, details: r.DETAILS.replace(/\s+/g, " ").trim(),
    title: /title/i.test(r.WEIGHTCLASS), weightclass: r.WEIGHTCLASS.trim(),
    seconds: (Math.max(1, Number(r.ROUND) || 1) - 1) * 300 + secs(r.TIME || "0:00"),
  });
}

// Totaux par combattant (par nom UFCStats) et par combat : chaque ligne = un round d'un combattant.
const careers = new Map();
const add = (name) => careers.get(name) || careers.set(name, { sigL: 0, sigA: 0, tdL: 0, tdA: 0, oppSigL: 0, oppSigA: 0, oppTdL: 0, oppTdA: 0, kd: 0, subAtt: 0, ctrl: 0, seconds: 0, fights: new Map(), per: new Map() }).get(name);
const byRound = new Map();
for (const s of stats) {
  if (!s.FIGHTER) continue;
  const k = fightKey(s.EVENT, s.BOUT);
  (byRound.get(`${k}|${s.ROUND}`) || byRound.set(`${k}|${s.ROUND}`, []).get(`${k}|${s.ROUND}`)).push(s);
}
for (const [key, rows] of byRound) {
  if (rows.length !== 2) continue;
  const fk = key.slice(0, key.lastIndexOf("|"));
  const info = fightInfo.get(fk);
  if (!info) continue;
  for (const [me, opp] of [[rows[0], rows[1]], [rows[1], rows[0]]]) {
    const c = add(canon(me.FIGHTER));
    const [sl, sa] = ofPair(me["SIG.STR."]), [tl, ta] = ofPair(me.TD), [osl, osa] = ofPair(opp["SIG.STR."]), [otl, ota] = ofPair(opp.TD);
    c.sigL += sl; c.sigA += sa; c.tdL += tl; c.tdA += ta; c.oppSigL += osl; c.oppSigA += osa; c.oppTdL += otl; c.oppTdA += ota;
    c.kd += Number(me.KD) || 0; c.subAtt += Number(me["SUB.ATT"]) || 0; c.ctrl += secs(me.CTRL || "0:00");
    const p = c.per.get(fk) || c.per.set(fk, { frappes: [0, 0], amenees: [0, 0], kd: 0, controle: 0, frappesSubies: [0, 0], ameneesSubies: [0, 0], kdSubis: 0 }).get(fk);
    p.frappes[0] += sl; p.frappes[1] += sa; p.amenees[0] += tl; p.amenees[1] += ta; p.kd += Number(me.KD) || 0; p.controle += secs(me.CTRL || "0:00");
    p.frappesSubies[0] += osl; p.frappesSubies[1] += osa; p.ameneesSubies[0] += otl; p.ameneesSubies[1] += ota; p.kdSubis += Number(opp.KD) || 0;
    if (info && !c.fights.has(fk)) { c.fights.set(fk, info); c.seconds += info.seconds; }
  }
}
// Combats sans détail par round (anciens ou annulés) : on garde au moins le résultat.
for (const [fk, info] of fightInfo) for (const n of [info.a, info.b]) { const c = add(n); if (!c.fights.has(fk)) c.fights.set(fk, info); }

const byTokens = new Map();
for (const name of careers.keys()) (byTokens.get(tokens(name)) || byTokens.set(tokens(name), []).get(tokens(name))).push(name);
const tottByName = new Map();
for (const t of tott) (tottByName.get(t.FIGHTER) || tottByName.set(t.FIGHTER, []).get(t.FIGHTER)).push(t);

// UFCStats peut avoir deux combattants du même nom : on garde celui qui a affronté un de nos 5 derniers adversaires.
function findCareer(f) {
  const alias = Object.entries(ALIAS).find(([k]) => norm(k) === norm(f.nom))?.[1];
  const cands = byTokens.get(tokens(alias || f.nom)) || [];
  if (!cands.length) return null;
  if (cands.length === 1 && ((tottByName.get(cands[0]) || []).length <= 1 || HOMONYMS_OK.includes(cands[0]))) return cands[0];
  return null; // homonymes : à vérifier à la main
}

const lastFights = (c, name) =>
  [...c.fights.values()].sort((x, y) => (y.date || "").localeCompare(x.date || "")).slice(0, 5).map((i) => {
    const mine = i.a === name ? i.oa : i.ob;
    return {
      date: i.date, event: i.event, opponent: i.a === name ? i.b : i.a,
      result: { W: "V", L: "D", D: "N", NC: "NC" }[mine] || mine,
      method: i.method, round: i.round, time: i.time, details: i.details, title: i.title,
      stats: c.per.get(fightKey(i.event, `${i.a0} vs. ${i.b0}`)) || null,
    };
  });

const report = [];
const career = {};
const updates = {};
for (const f of FIGHTERS) {
  if (f.categorie === "Legendes") continue;
  const name = findCareer(f);
  if (!name) { report.push(`? ${f.id} ${f.nom} : introuvable ou homonyme sur UFCStats`); continue; }
  const c = careers.get(name);
  const min = c.seconds / 60 || 0;
  const per15 = (x) => (min ? Math.round((x / min) * 15 * 100) / 100 : null);
  const perMin = (x) => (min ? Math.round((x / min) * 100) / 100 : null);
  const s = {
    ufcstats: name,
    combatsUfc: c.fights.size,
    minutes: Math.round(min),
    striking: pct(c.sigL, c.sigA, MIN_ATT.striking),
    strDef: c.oppSigA >= MIN_ATT.striking ? 100 - Math.round((100 * c.oppSigL) / c.oppSigA) : null,
    slpm: perMin(c.sigL), sapm: perMin(c.oppSigL),
    tdAcc: pct(c.tdL, c.tdA, MIN_ATT.tdAcc), td: [c.tdL, c.tdA], tdAvg: per15(c.tdL),
    tdDef: c.oppTdA >= MIN_ATT.tdDef ? 100 - Math.round((100 * c.oppTdL) / c.oppTdA) : null, tdSubis: [c.oppTdL, c.oppTdA],
    kd: c.kd, subAvg: per15(c.subAtt), ctrlPct: c.seconds ? Math.round((100 * c.ctrl) / c.seconds) : null,
    derniers: lastFights(c, name),
  };
  career[f.id] = s;
  const diff = [];
  for (const k of ["striking", "tdAcc", "tdDef"]) {
    if ((f[k] ?? null) !== s[k] && !(f[k] != null && s[k] != null && Math.abs(f[k] - s[k]) <= 1)) diff.push(`${k} ${f[k] ?? "?"} -> ${s[k] ?? "?"}`);
  }
  if (diff.length) { updates[f.id] = { striking: s.striking, tdAcc: s.tdAcc, tdDef: s.tdDef }; report.push(`~ ${f.id} ${f.nom} : ${diff.join(", ")}`); }
  // Bilan UFC (UFCStats ne compte que les événements UFC).
  const tally = { V: 0, D: 0, N: 0, NC: 0 };
  for (const i of c.fights.values()) tally[{ W: "V", L: "D", D: "N", NC: "NC" }[i.a === name ? i.oa : i.ob]]++;
  if (f.ufcV != null && !OVERTURNED.includes(f.id) && (tally.V !== f.ufcV || tally.D !== f.ufcD || tally.N !== (f.ufcN ?? 0) || tally.NC !== (f.ufcNc ?? 0)))
    report.push(`# ${f.id} ${f.nom} : bilan UFC du site ${f.ufcV}-${f.ufcD}-${f.ufcN ?? 0} (${f.ufcNc ?? 0} NC), UFCStats ${tally.V}-${tally.D}-${tally.N} (${tally.NC} NC)`);
  // Le dernier combat UFC doit être le même que dans recentFights.js (sinon la routine a un retard).
  const ours = (RECENT_FIGHTS[f.id] || [])[0];
  const theirs = s.derniers[0];
  if (ours && theirs && !(RECENT_FIGHTS[f.id] || []).some((r) => sameOpp(r.opponent, theirs.opponent)))
    report.push(`! ${f.id} ${f.nom} : dernier combat UFC ${theirs.date} contre ${theirs.opponent} absent des 5 derniers combats du site`);
}

console.log(report.join("\n"));
console.log(`\n${Object.keys(career).length} combattants retrouvés, ${Object.keys(updates).length} à corriger.`);

// Garde-fou : jeu de données incomplet ou cassé -> on n'écrit rien.
const expected = FIGHTERS.filter((f) => f.categorie !== "Legendes").length;
if (WRITE && Object.keys(career).length < expected * 0.9) {
  console.error(`Seulement ${Object.keys(career).length}/${expected} combattants retrouvés : rien n'est écrit.`);
  process.exit(1);
}

if (WRITE) {
  writeFileSync(new URL("../src/ufcCareer.js", import.meta.url),
    `// Généré par scripts/ufcstats-sync.mjs (UFCStats, feuilles de match officielles). Ne pas modifier à la main.\n` +
    `// Utilisé par l'analyse IA : volumes, échantillons et circonstances des derniers combats UFC.\n` +
    `export const UFC_CAREER_DATE = ${JSON.stringify([...eventDate.values()].filter(Boolean).sort().pop())};\n` +
    `export const UFC_CAREER = ${JSON.stringify(career, null, 0).replace(/\},"f/g, '},\n"f')};\n`);
  const path = new URL("../src/fightersData.js", import.meta.url);
  let src = readFileSync(path, "utf8");
  for (const [id, u] of Object.entries(updates)) {
    src = src.replace(new RegExp(`(\\{ id: "${id}",[^\\n]*)`), (line) =>
      line.replace(/striking: [^,]+,/, `striking: ${u.striking},`).replace(/tdAcc: [^,]+,/, `tdAcc: ${u.tdAcc},`).replace(/tdDef: [^,]+,/, `tdDef: ${u.tdDef},`));
  }
  writeFileSync(path, src);
  console.log("src/ufcCareer.js et src/fightersData.js mis à jour.");
}
