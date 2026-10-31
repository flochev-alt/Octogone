// Stockage des votes « Les fans contre l'IA » (tables fan_combats et fan_votes, supabase/votes.sql).
// Écrit avec la clé secrète (variable Vercel SUPABASE_SECRET_KEY). Sans elle, ou si Supabase ne répond pas,
// on garde en mémoire du serveur (suffisant pour un aperçu, pas pour la production).
import { createHash } from "node:crypto";
import { fanKey } from "../src/fans.js";
import { sameName } from "../src/events.js";

const URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = Boolean(URL && KEY);
const headers = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" });

// Au plus 4 votes par combat depuis une même adresse IP (famille, wifi partagé, réseau mobile).
const MAX_PER_IP = 4;

// Repli en mémoire : cle -> ligne ; cle|votant -> choix ; cle|ip -> nombre.
const mem = { rows: new Map(), votes: new Map(), ips: new Map() };

// Empreintes : on ne garde jamais l'identifiant de l'appareil ni l'IP en clair.
export const hash = (s) => createHash("sha256").update(`octogone|${s}`).digest("hex").slice(0, 32);

export async function allRows() {
  if (enabled) {
    try {
      const r = await fetch(`${URL}/rest/v1/fan_combats?select=cle,evenement,iso,nom1,nom2,votes1,votes2,ia_favori&order=iso.desc&limit=2000`, { headers: headers() });
      if (!r.ok) throw new Error(`Supabase fan_combats : ${r.status}`);
      return await r.json();
    } catch (e) {
      console.error(e);
    }
  }
  return [...mem.rows.values()];
}

function memVote({ cle, evenement, iso, nom1, nom2 }, votant, ip, choix) {
  if (!mem.rows.has(cle)) mem.rows.set(cle, { cle, evenement, iso, nom1, nom2, votes1: 0, votes2: 0, ia_favori: null });
  const row = mem.rows.get(cle);
  const mine = mem.votes.get(`${cle}|${votant}`);
  if (mine) return { v1: row.votes1, v2: row.votes2, deja: true, mon_choix: mine };
  const n = mem.ips.get(`${cle}|${ip}`) || 0;
  if (n >= MAX_PER_IP) return { v1: row.votes1, v2: row.votes2, deja: true, mon_choix: choix };
  mem.ips.set(`${cle}|${ip}`, n + 1);
  mem.votes.set(`${cle}|${votant}`, choix);
  row[choix === 1 ? "votes1" : "votes2"]++;
  return { v1: row.votes1, v2: row.votes2, deja: false, mon_choix: choix };
}

// Enregistre le vote pour `pick` (un des deux noms) et renvoie la ligne du combat à jour.
export async function castVote({ event, iso, a, b, pick, voter, ip }) {
  const k = fanKey(iso, a, b);
  const choix = sameName(pick, k.nom1) ? 1 : 2;
  const votant = hash(`v|${voter}`);
  const ipHash = hash(`ip|${ip}`);
  let res = null;
  if (enabled) {
    try {
      const r = await fetch(`${URL}/rest/v1/rpc/fan_voter`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ p_cle: k.cle, p_evenement: event, p_iso: iso, p_nom1: k.nom1, p_nom2: k.nom2, p_votant: votant, p_ip: ipHash, p_choix: choix, p_max_ip: MAX_PER_IP }),
      });
      if (!r.ok) throw new Error(`Supabase fan_voter : ${r.status} ${await r.text()}`);
      res = (await r.json())[0];
    } catch (e) {
      console.error(e);
    }
  }
  if (!res) res = memVote({ ...k, evenement: event, iso }, votant, ipHash, choix);
  return {
    row: { cle: k.cle, iso, nom1: k.nom1, nom2: k.nom2, votes1: res.v1, votes2: res.v2 },
    already: res.deja,
    mine: res.mon_choix === 1 ? k.nom1 : k.nom2,
  };
}

const frozen = new Set(); // combats dont le favori a déjà été envoyé par cette instance du serveur

// Fige le favori de l'IA d'un combat (seulement s'il n'est pas déjà connu : pas de changement après coup).
export async function setAiPick({ event, iso, a, b, favori }) {
  const k = fanKey(iso, a, b);
  const name = [k.nom1, k.nom2].find((n) => sameName(n, favori) || norm2(favori).includes(norm2(n).split(" ").pop()));
  if (!name || frozen.has(k.cle)) return;
  frozen.add(k.cle);
  if (enabled) {
    try {
      await fetch(`${URL}/rest/v1/fan_combats?on_conflict=cle`, {
        method: "POST",
        headers: { ...headers(), Prefer: "resolution=ignore-duplicates" },
        body: JSON.stringify({ cle: k.cle, evenement: event, iso, nom1: k.nom1, nom2: k.nom2 }),
      });
      const r = await fetch(`${URL}/rest/v1/fan_combats?cle=eq.${encodeURIComponent(k.cle)}&ia_favori=is.null`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ ia_favori: name }),
      });
      if (!r.ok) throw new Error(`Supabase fan_combats : ${r.status} ${await r.text()}`);
      return;
    } catch (e) {
      console.error(e);
    }
  }
  if (!mem.rows.has(k.cle)) mem.rows.set(k.cle, { cle: k.cle, evenement: event, iso, nom1: k.nom1, nom2: k.nom2, votes1: 0, votes2: 0, ia_favori: null });
  const row = mem.rows.get(k.cle);
  if (!row.ia_favori) row.ia_favori = name;
}

const norm2 = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
