// Pages d'événement : une adresse par carte (/evenement/<slug>, ex. « UFC 334 » → /evenement/ufc-334),
// et les liens entre événements et fiches combattants.
import { useState, useEffect } from "react";
import { slugify } from "./slug.js";

export const eventSlug = (e) => slugify(e.name);
export const eventPath = (e) => `/evenement/${eventSlug(e)}`;
export const eventSlugFromPath = (path) => path.match(/^\/evenement\/([a-z0-9-]+)\/?$/)?.[1] || null;

// Même nom malgré les accents ou les tirets (« Uros Medic » = « Uroš Medić »).
const norm = (n) => n?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ").toLowerCase().trim();
export const sameName = (a, b) => norm(a) === norm(b);
export const findFighter = (fighters, name) => fighters.find((f) => sameName(f.nom, name)) || null;

// Carte d'un événement à venir ; sans carte détaillée, le main event seul (champ fighters).
export const cardOf = (e) =>
  e.card?.length ? e.card : e.fighters?.length === 2 ? [{ a: e.fighters[0], b: e.fighters[1] }] : [];

// Résultat « A def. B » d'une carte passée : vainqueur et perdant (sinon les deux noms d'un « A vs. B »).
export function resultSides(fight) {
  const [w, l] = fight.split(/\s+def\.\s+/);
  if (l) return { winner: w.trim(), loser: l.trim() };
  const [a, b] = fight.split(/\s+vs\.?\s+/);
  return b ? { a: a.trim(), b: b.trim() } : null;
}

// Prochain combat d'un combattant d'après les cartes à venir (événements triés du plus proche au plus lointain).
export function nextFightOf(name, upcoming) {
  for (const e of upcoming) {
    for (const f of cardOf(e)) {
      if (sameName(f.a, name)) return { event: e, opponent: f.b };
      if (sameName(f.b, name)) return { event: e, opponent: f.a };
    }
  }
  return null;
}

// Événements à venir, lus dans le fil Média (Supabase, sinon mediaData.js), du plus proche au plus lointain.
// `start` (facultatif) = début de la carte principale en UTC : il active le compte à rebours à la seconde.
// Un événement reste « en cours » 6 h après son début, sinon jusqu'à la fin de sa journée (heure de Paris).
export const parisDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(d);
export const LIVE_HOURS = 6;
export const isUpcoming = (e, now) => (e.start ? now - Date.parse(e.start) < LIVE_HOURS * 3600e3 : e.iso >= parisDay(now));
export function upcomingEvents(items, now) {
  return items
    .filter((p) => p.type === "upcoming")
    .map((p) => p.data)
    .filter((e) => isUpcoming(e, now))
    .sort((a, b) => (a.start || a.iso).localeCompare(b.start || b.iso));
}

// Heure courante, rafraîchie chaque seconde (pour le compte à rebours).
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
