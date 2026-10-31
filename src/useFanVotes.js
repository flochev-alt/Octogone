// Votes « Les fans contre l'IA » côté navigateur : compteurs partagés entre les pages,
// identifiant aléatoire de l'appareil (pas de compte) et votes déjà faits sur cet appareil.
import { useState, useEffect } from "react";
import { fanKey } from "./fans.js";

const VOTER_KEY = "octogone-voter";
const MINE_KEY = "octogone-votes";

const read = (k, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? fallback;
  } catch {
    return fallback;
  }
};

function voterId() {
  let id = null;
  try {
    id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VOTER_KEY, id);
    }
  } catch {
    id ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-x`;
  }
  return id;
}

// Une seule requête par visite ; les votes faits ensuite mettent la liste à jour pour toutes les pages.
let rows = [];
let request = null;
const listeners = new Set();
const emit = () => listeners.forEach((f) => f(rows));
const load = () =>
  (request ??= fetch("/api/vote")
    .then((r) => (r.ok ? r.json() : { rows: [] }))
    .then((d) => {
      rows = Array.isArray(d.rows) ? d.rows : [];
      emit();
    })
    .catch(() => {}));

export function useFanVotes() {
  const [list, setList] = useState(rows);
  useEffect(() => {
    listeners.add(setList);
    load();
    return () => listeners.delete(setList);
  }, []);
  return list;
}

// Vote déjà fait sur cet appareil pour ce combat (nom choisi), sinon null.
export const myVote = (iso, a, b) => read(MINE_KEY, {})[fanKey(iso, a, b).cle] || null;

export async function sendVote({ event, iso, a, b, pick }) {
  const r = await fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, a, b, pick, voter: voterId() }),
  });
  if (!r.ok) throw new Error(String(r.status));
  const { row, mine } = await r.json();
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify({ ...read(MINE_KEY, {}), [row.cle]: mine }));
  } catch {}
  const old = rows.find((x) => x.cle === row.cle);
  rows = old ? rows.map((x) => (x.cle === row.cle ? { ...x, ...row } : x)) : [{ ...row, ia_favori: null }, ...rows];
  emit();
  return mine;
}
