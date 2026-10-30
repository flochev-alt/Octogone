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

  const age = (iso) => {
    if (!iso) return null;
    const d = new Date(iso), n = new Date();
    return n.getFullYear() - d.getFullYear() - (n < new Date(n.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  };
  const v = (x, unit = "") => (x == null ? "?" : `${x}${unit}`);
  const RESULTS = { V: "victoire", D: "défaite", N: "nul", NC: "sans décision" };
  const card = (f) => {
    const recent = (f.recent || []).slice(0, 5).map((r) => `${RESULTS[r.result] || r.result} contre ${r.opponent} (${r.method}${r.event ? `, ${r.event}` : ""})`);
    return `${f.nom}
- Bilan pro ${f.victoires}-${f.defaites}-${f.nuls}${f.ufcV != null ? `, bilan UFC ${f.ufcV}-${f.ufcD}-${f.ufcN}` : ""}${f.rang === 0 ? ", champion" : f.rang ? `, classé n°${f.rang}` : ""}
- Âge ${v(age(f.naissance), " ans")}, taille ${v(f.taille, " cm")}, allonge ${v(f.allonge, " cm")}, base ${base(f)}
- Victoires : ${v(f.ko, "%")} par KO/TKO, ${v(f.sub, "%")} par soumission, ${v(f.dec, "%")} à la décision
- Précision des frappes ${v(f.striking, "%")}, précision des amenées au sol ${v(f.tdAcc, "%")}, défense de lutte ${v(f.tdDef, "%")}
- 5 derniers combats (du plus récent au plus ancien) : ${recent.length ? recent.join(" ; ") : "non renseignés"}`;
  };

  const prompt = `Tu es un analyste MMA reconnu, qui écrit pour des fans exigeants et des parieurs qui veulent comprendre un combat avant de se faire leur propre avis. Rédige en ${language} l'analyse de ce duel hypothétique, en t'appuyant UNIQUEMENT sur les données ci-dessous : n'invente aucun fait, combat, blessure ou statistique. Si une donnée manque (« ? »), n'en parle pas.

${card(fighterA)}

${card(fighterB)}

Probabilité calculée par notre modèle : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.

Format attendu, en texte simple (pas de Markdown, pas de titres avec #), chaque partie commence par son intitulé suivi de deux-points, une ligne vide entre les parties :
Les clés du combat : les 2 ou 3 facteurs qui vont décider de l'issue (distance et allonge, lutte contre striking, cardio et âge, forme récente), chiffres à l'appui.
Forme du moment : ce que disent les 5 derniers combats de chacun (série, qualité de l'opposition, façon de gagner ou de perdre).
Scénario le plus probable : comment le combat devrait se dérouler, et la tendance de fin qui ressort des chiffres (plutôt KO, soumission ou décision), en expliquant pourquoi.
Le piège : le scénario qui ferait mentir le favori.
Notre avis : une phrase claire qui dit qui part favori, avec quel niveau de confiance (faible, moyen ou fort), et pourquoi.

Reste concis (180 à 250 mots au total). Ne cite jamais de cotes, de bookmaker, de montant de mise ni de conseil de pari, et n'affirme jamais qu'un résultat est sûr.`;

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
