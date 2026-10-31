// Une analyse IA gardée par duel : la première analyse d'un duel est enregistrée dans Supabase
// (table « analyses », supabase/analyses.sql) et resservie à tout le monde ensuite.
// La clé change dès que les stats d'un des deux combattants changent (nouveau combat, nouveau classement...),
// ce qui déclenche une nouvelle analyse. Sans la variable SUPABASE_SECRET_KEY, on garde seulement
// en mémoire du serveur (moins fiable : Vercel redémarre ses instances).
import { createHash } from "node:crypto";

// À augmenter quand on change la consigne de l'IA, pour refaire toutes les analyses.
// v2 (31/10/2026) : chiffres officiels UFCStats, circonstances des combats, face-à-face, actualité du web.
const PROMPT_VERSION = 2;
// L'actualité change : une analyse est refaite au plus tard toutes les 2 semaines (à la première demande).
const PERIOD_DAYS = 14;
const FIELDS = ["nom", "categorie", "nc", "ufcNc", "victoires", "defaites", "nuls", "ufcV", "ufcD", "ufcN", "rang", "naissance", "taille", "allonge", "style", "ko", "sub", "dec", "striking", "tdAcc", "tdDef"];

const URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = Boolean(URL && KEY);
const memory = new Map();

const fingerprint = (f) =>
  JSON.stringify([...FIELDS.map((k) => f[k] ?? null), (f.recent || []).slice(0, 5).map((r) => [r.result, r.opponent, r.method, r.event, r.note ?? null])]);

// Le même duel donne la même clé, dans un sens comme dans l'autre (A contre B = B contre A).
export function duelKey(fighterA, fighterB, lang) {
  const sides = [fingerprint(fighterA), fingerprint(fighterB)].sort();
  const hash = createHash("sha256").update(JSON.stringify([PROMPT_VERSION, Math.floor(Date.now() / (PERIOD_DAYS * 86400000)), lang, ...sides])).digest("hex");
  return { cle: hash, combat: [fighterA.nom, fighterB.nom].sort().join(" vs "), langue: lang };
}

const headers = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" });

export async function getAnalysis(key) {
  if (memory.has(key.cle)) return memory.get(key.cle);
  if (!enabled) return null;
  try {
    const r = await fetch(`${URL}/rest/v1/analyses?cle=eq.${key.cle}&select=contenu`, { headers: headers() });
    if (!r.ok) throw new Error(`Supabase analyses : ${r.status}`);
    const found = (await r.json())[0]?.contenu || null;
    if (found) memory.set(key.cle, found);
    return found;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Enregistre l'analyse, sauf si quelqu'un l'a enregistrée juste avant : on renvoie alors celle déjà gardée,
// pour que tout le monde ait la même.
export async function saveAnalysis(key, analyse) {
  if (memory.size > 2000) memory.clear();
  if (!enabled) {
    memory.set(key.cle, analyse);
    return analyse;
  }
  try {
    const r = await fetch(`${URL}/rest/v1/analyses?on_conflict=cle`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({ ...key, contenu: analyse }),
    });
    if (!r.ok) throw new Error(`Supabase analyses : ${r.status} ${await r.text()}`);
    const inserted = (await r.json())[0];
    const kept = inserted ? analyse : (await getAnalysis(key)) || analyse;
    memory.set(key.cle, kept);
    return kept;
  } catch (e) {
    console.error(e);
    memory.set(key.cle, analyse);
    return analyse;
  }
}
