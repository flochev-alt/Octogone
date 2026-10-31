// « Les fans contre l'IA ».
// GET  : tous les combats votés (compteurs + favori de l'IA), pour les pourcentages et le score Fans – IA.
// POST : { event, a, b, pick, voter } = un vote pour `pick` sur le combat a vs b d'une carte à venir.
// Seuls les combats inscrits sur une carte (src/mediaData.js) sont acceptés, avant le début
// de l'événement, sur la carte principale du prochain événement seulement. Un vote par appareil (identifiant aléatoire du navigateur) et au plus 4 par adresse IP.
import { UPCOMING } from "../src/mediaData.js";
import { eventSlug, cardOf, sameName } from "../src/events.js";
import { nextVoteEvent, votableFight } from "../src/fans.js";
import { FIGHTERS } from "../src/fightersData.js";
import { allRows, castVote } from "./_fans.js";

const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
    return res.status(200).json({ rows: await allRows() });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { event, a, b, pick, voter } = req.body || {};
  if (typeof voter !== "string" || !/^[a-z0-9-]{16,64}$/i.test(voter)) return res.status(400).json({ error: "Votant invalide" });
  const e = UPCOMING.find((x) => eventSlug(x) === event);
  const fight = e && cardOf(e).find((f) => (sameName(f.a, a) && sameName(f.b, b)) || (sameName(f.a, b) && sameName(f.b, a)));
  if (!fight) return res.status(404).json({ error: "Combat introuvable" });
  if (!sameName(pick, fight.a) && !sameName(pick, fight.b)) return res.status(400).json({ error: "Choix invalide" });
  if (!votableFight(fight, FIGHTERS)) return res.status(403).json({ error: "Vote réservé à la carte principale" });
  if (nextVoteEvent(UPCOMING, Date.now()) !== e) return res.status(409).json({ error: "Votes fermés" });

  const name = sameName(pick, fight.a) ? fight.a : fight.b;
  const out = await castVote({ event, iso: e.iso, a: fight.a, b: fight.b, pick: name, voter, ip: clientIp(req) });
  res.status(200).json(out);
}
