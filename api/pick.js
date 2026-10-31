// Pronostic de l'IA pour un combat d'une carte à venir (pages d'événement).
// Seuls les combats inscrits sur une carte (src/mediaData.js) sont acceptés, avec les stats de la base
// du site (jamais celles envoyées par le navigateur) : chaque combat n'est donc analysé qu'une fois par
// langue, puis resservi à tout le monde (même cache que le Simulateur), sans compter dans les 5 analyses du jour.
// On ne renvoie que le pronostic court (favori, fin probable, confiance, verdict) : l'analyse complète
// (clés du combat, forme, scénario, piège) reste réservée au Simulateur et à sa limite de 5 par jour.
import { UPCOMING } from "../src/mediaData.js";
import { FIGHTERS } from "../src/fightersData.js";
import { RECENT_FIGHTS } from "../src/recentFights.js";
import { eventSlug, cardOf, findFighter, sameName } from "../src/events.js";
import { duelOdds } from "../src/score.js";
import { duelKey, getAnalysis, saveAnalysis } from "./_analyses.js";
import { generateAnalysis, hasApiKey } from "./_ai.js";

const LANGS = ["fr", "en", "es"];
const short = ({ favori, tendance, confiance, verdict }) => ({ favori, tendance, confiance, verdict });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { event, a, b, lang = "fr" } = req.body || {};
  const e = UPCOMING.find((x) => eventSlug(x) === event);
  const fight = e && cardOf(e).find((f) => (sameName(f.a, a) && sameName(f.b, b)) || (sameName(f.a, b) && sameName(f.b, a)));
  if (!fight || !LANGS.includes(lang)) return res.status(404).json({ error: "Combat introuvable" });

  const withRecent = (f) => f && { ...f, recent: f.recent || RECENT_FIGHTS[f.id] || [] };
  const fighterA = withRecent(findFighter(FIGHTERS, fight.a));
  const fighterB = withRecent(findFighter(FIGHTERS, fight.b));
  if (!fighterA || !fighterB) return res.status(404).json({ error: "Combattant absent de la base" });

  const key = duelKey(fighterA, fighterB, lang);
  const known = await getAnalysis(key);
  if (known) return res.status(200).json({ analysis: short(known), cached: true });
  if (!hasApiKey()) return res.status(501).json({ error: "ANTHROPIC_API_KEY non configurée" });

  try {
    const analysis = await generateAnalysis({ fighterA, fighterB, ...duelOdds(fighterA, fighterB), lang });
    res.status(200).json({ analysis: short(await saveAnalysis(key, analysis)) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Impossible de générer le pronostic pour le moment." });
  }
}
