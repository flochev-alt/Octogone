import { isVipCode } from "./_vip.js";
import { duelKey, getAnalysis, saveAnalysis } from "./_analyses.js";
import { analyzeDuel, hasApiKey } from "./_ai.js";
import { FIGHTERS } from "../src/fightersData.js";
import { RECENT_FIGHTS } from "../src/recentFights.js";
import { findFighter } from "../src/events.js";
import { duelOdds } from "../src/score.js";

// Les stats viennent toujours de la base du site (jamais du navigateur) : mêmes chiffres vérifiés
// pour tout le monde, et même analyse en cache que les pages d'événement.
const serverFighter = (f) => {
  const found = (f?.id && FIGHTERS.find((x) => x.id === f.id)) || (f?.nom && findFighter(FIGHTERS, f.nom));
  return found ? { ...found, recent: RECENT_FIGHTS[found.id] || [] } : null;
};

const DAILY_LIMIT = 5;
// Compteur par adresse IP et par jour, en mémoire du serveur. Vercel peut redémarrer ou multiplier
// ses instances : c'est un garde-fou en plus du compteur du navigateur, pas une garantie absolue
// (il faudra une base de données, Supabase, pour un compteur exact).
const usage = new Map();

function overDailyLimit(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const today = new Date().toISOString().slice(0, 10);
  const key = `${today}|${ip}`;
  // Données personnelles : on ne garde jamais les adresses IP au-delà du jour en cours (mentions légales).
  for (const k of usage.keys()) if (!k.startsWith(today)) usage.delete(k);
  const count = (usage.get(key) || 0) + 1;
  if (usage.size > 5000) usage.clear();
  usage.set(key, count);
  return count > DAILY_LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isVipCode(req.headers["x-vip-code"]) && overDailyLimit(req)) {
    return res.status(429).json({ error: "daily_limit" });
  }

  const { lang = "fr" } = req.body || {};
  const fighterA = serverFighter(req.body?.fighterA);
  const fighterB = serverFighter(req.body?.fighterB);
  if (!fighterA || !fighterB || fighterA.id === fighterB.id) return res.status(400).json({ error: "Combattants manquants" });

  // Duel déjà analysé avec les mêmes stats : tout le monde reçoit la même analyse.
  const key = duelKey(fighterA, fighterB, lang);
  const known = await getAnalysis(key);
  if (known) return res.status(200).json({ analysis: known, cached: true });

  if (!hasApiKey()) {
    return res.status(501).json({
      error: "ANTHROPIC_API_KEY non configurée. Ajoute-la dans Vercel > Settings > Environment Variables.",
    });
  }

  try {
    const analysis = await analyzeDuel({ fighterA, fighterB, ...duelOdds(fighterA, fighterB), lang });
    res.status(200).json({ analysis: await saveAnalysis(key, analysis) });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "Impossible de générer l'analyse pour le moment." });
  }
}
