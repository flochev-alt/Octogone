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

  const prompt = `Tu es le meilleur analyste MMA francophone, celui que les fans et les parieurs lisent avant chaque gros combat. Ton style : vivant, tranchant, concret, comme un consultant TV qui a regardé toutes les vidéos. Chaque affirmation s'appuie sur un chiffre ci-dessous, et tu compares toujours les deux combattants chiffre contre chiffre. Le lecteur doit finir en se disant « heureusement que j'ai lu ça avant de me décider ».

Règles strictes :
- Écris en ${language}.
- Utilise UNIQUEMENT les données ci-dessous. N'invente aucun combat, blessure, déclaration, camp d'entraînement ou statistique. Si une donnée vaut « ? », ignore-la.
- Ne cite jamais de cotes, de bookmaker, de montant de mise ni de conseil de pari, et ne présente jamais un résultat comme certain.

${card(fighterA)}

${card(fighterB)}

Probabilité calculée par notre modèle : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.

Remplis chaque champ :
- accroche : une phrase choc (20 mots max) qui résume l'enjeu du duel.
- cles : les 3 facteurs qui vont décider du combat. Pour chacun, un titre court (3 à 6 mots) et un détail de 1 à 2 phrases avec les chiffres des deux combattants.
- forme : 2 phrases sur la dynamique récente de chacun d'après leurs 5 derniers combats (séries, façon de gagner ou de perdre, niveau des adversaires).
- scenario : 2 à 3 phrases qui racontent le déroulé le plus probable du combat, round après round si utile.
- tendance : comment ce combat a le plus de chances de se terminer d'après les chiffres (ko, soumission ou decision).
- piege : 1 à 2 phrases sur le scénario qui ferait tomber le favori.
- favori : le nom exact du combattant que tu donnes favori.
- confiance : ton niveau de confiance dans ce favori (faible, moyenne ou forte), cohérent avec les chiffres.
- verdict : 1 à 2 phrases percutantes qui tranchent et justifient le choix.`;

  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["accroche", "cles", "forme", "scenario", "tendance", "piege", "favori", "confiance", "verdict"],
    properties: {
      accroche: { type: "string" },
      cles: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["titre", "detail"],
          properties: { titre: { type: "string" }, detail: { type: "string" } },
        },
      },
      forme: { type: "string" },
      scenario: { type: "string" },
      tendance: { type: "string", enum: ["ko", "soumission", "decision"] },
      piege: { type: "string" },
      favori: { type: "string" },
      confiance: { type: "string", enum: ["faible", "moyenne", "forte"] },
      verdict: { type: "string" },
    },
  };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 8000,
        output_config: { effort: "medium", format: { type: "json_schema", schema } },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);
    const data = await response.json();
    // La réponse peut commencer par un bloc de réflexion : on ne garde que le texte.
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    if (!text) throw new Error(`Réponse vide (stop_reason: ${data.stop_reason})`);
    res.status(200).json({ analysis: JSON.parse(text) });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "Impossible de générer l'analyse pour le moment." });
  }
}
