import { isVipCode } from "./_vip.js";

const DAILY_LIMIT = 5;
// Compteur par adresse IP et par jour, en mémoire du serveur. Vercel peut redémarrer ou multiplier
// ses instances : c'est un garde-fou en plus du compteur du navigateur, pas une garantie absolue
// (il faudra une base de données, Supabase, pour un compteur exact).
const usage = new Map();

function overDailyLimit(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const key = `${new Date().toISOString().slice(0, 10)}|${ip}`;
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(501).json({
      error: "ANTHROPIC_API_KEY non configurée. Ajoute-la dans Vercel > Settings > Environment Variables.",
    });
  }

  const { fighterA, fighterB, probA, probB, lang = "fr" } = req.body;
  const LANGUAGE_NAMES = { fr: "français", en: "anglais", es: "espagnol" };
  const language = LANGUAGE_NAMES[lang] || "français";
  const STYLE_NAMES = { jjb: "jiu-jitsu brésilien", boxe: "boxe anglaise", muaythai: "muay-thaï", corpsacorps: "combat corps à corps", kungfu: "kung-fu", mma: "formé directement au MMA" };
  const base = (f) => (f.style?.length ? f.style.map((k) => STYLE_NAMES[k] || k).join(" + ") : "?");

  const prompt = `Tu es un analyste MMA expert. Rédige une analyse détaillée et approfondie de ce duel hypothétique, en ${language}, en 7-9 phrases, sans inventer de détails que je ne te donne pas.

${fighterA.nom} (${fighterA.victoires}-${fighterA.defaites}, base ${base(fighterA)}, striking ${fighterA.striking ?? "?"}%, TD accuracy ${fighterA.tdAcc ?? "?"}%, TD defense ${fighterA.tdDef ?? "?"}%) vs ${fighterB.nom} (${fighterB.victoires}-${fighterB.defaites}, base ${base(fighterB)}, striking ${fighterB.striking ?? "?"}%, TD accuracy ${fighterB.tdAcc ?? "?"}%, TD defense ${fighterB.tdDef ?? "?"}%).

Probabilité calculée : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.

Structure ton analyse ainsi :
1. Le style de chaque combattant et ce qu'il cherche à imposer dans ce duel précis (2-3 phrases)
2. Où se situe l'avantage stylistique clé (striking vs grappling, gestion de la distance, allonge, prise de risque) et pourquoi (2-3 phrases)
3. Le scénario qui donnerait le plus de fil à retordre à chacun des deux combattants (1-2 phrases)
4. Une conclusion nuancée sur ce qui pourrait faire basculer ce duel dans un sens ou dans l'autre (1-2 phrases)

Ne donne aucun pronostic de méthode de victoire ou de round précis, et ne mentionne jamais de cotes, de paris, ou de conseil de mise — reste uniquement sur l'analyse stylistique et technique.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("Anthropic API error");
    const data = await response.json();
    const analysis = data.content?.[0]?.text || "—";
    res.status(200).json({ analysis });
  } catch (e) {
    res.status(502).json({ error: "Impossible de générer l'analyse pour le moment." });
  }
}
