// Analyse IA d'un duel (Claude), partagée par le Simulateur (/api/analyze) et les pages d'événement (/api/pick).
// Deux étapes :
//  1. recherche web restreinte à des médias MMA fiables : l'actualité récente des deux combattants
//     (blessures, forfaits, circonstances de leur dernier combat, revanche, changement de catégorie...) ;
//  2. analyse structurée à partir de la base du site (bilans vérifiés, 5 derniers combats),
//     des chiffres officiels UFCStats (src/ufcCareer.js) et de cette actualité.
// Renvoie l'analyse (objet JSON) ou lève une erreur. Nécessite ANTHROPIC_API_KEY sur Vercel.
import { UFC_CAREER, UFC_CAREER_DATE } from "../src/ufcCareer.js";

export const hasApiKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

const MODEL = "claude-opus-5-5";
const API = "https://api.anthropic.com/v1/messages";

// Sources autorisées pour la recherche d'actualité (officiel, presse MMA reconnue, encyclopédies).
const NEWS_DOMAINS = [
  "ufc.com", "ufc-fr.com", "espn.com", "mmafighting.com", "mmajunkie.usatoday.com", "sherdog.com",
  "tapology.com", "en.wikipedia.org", "fr.wikipedia.org", "lequipe.fr", "rmcsport.bfmtv.com",
  "cbssports.com", "bloodyelbow.com", "mmamania.com", "mmaweekly.com", "boxemag.ouest-france.fr",
];

const call = async (body) => {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, ...body }),
  });
  if (!response.ok) throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);
  return response.json();
};
const textOf = (data) => (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();

// Même nom malgré accents, tirets, ordre des mots ou « Jr. » (« Patrício Pitbull », « Eduardo Henrique »...).
const tokens = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ł/g, "l").replace(/-/g, " ")
  .replace(/[^a-z ]/g, "").replace(/\b(jr|junior)\b/g, "").split(" ").filter(Boolean).sort().join(" ");
const sameFighter = (a, b) => tokens(a) === tokens(b) || (tokens(a).split(" ").length > 1 && tokens(a).split(" ").every((t) => tokens(b).includes(t)));

const age = (iso, now = new Date()) => {
  if (!iso) return null;
  const d = new Date(iso);
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
};
const months = (iso, now = new Date()) => (iso ? Math.floor((now - new Date(iso)) / (30.44 * 86400000)) : null);
const v = (x, unit = "") => (x == null ? "?" : `${x}${unit}`);
const ratio = ([l, a]) => `${l}/${a}`;
const STYLE_NAMES = { jjb: "jiu-jitsu brésilien", boxe: "boxe anglaise", muaythai: "muay-thaï", corpsacorps: "lutte / combat corps à corps", kungfu: "kung-fu", mma: "formé directement au MMA" };
const RESULTS = { V: "victoire", D: "défaite", N: "nul", NC: "sans décision (no contest)" };

// 5 derniers combats du site (toutes organisations, résultat qui fait foi), complétés par la feuille de match
// officielle UFC quand il y en a une : date, round, arrêt, circonstances et chiffres du combat.
function recentFights(f) {
  const ufc = UFC_CAREER[f.id]?.derniers || [];
  const used = new Set();
  return (f.recent || []).slice(0, 5).map((r) => {
    // Revanches : chaque feuille ne sert qu'une fois, dans l'ordre chronologique (du plus récent au plus ancien).
    const sheet = ufc.find((u) => !used.has(u) && (sameFighter(u.opponent, r.opponent) || sameFighter(r.opponent, u.opponent)));
    if (sheet) used.add(sheet);
    return { ...r, sheet };
  });
}

function fightLine(r) {
  const s = r.sheet;
  const parts = [`${RESULTS[r.result] || r.result} contre ${r.opponent}`];
  const how = [r.method];
  if (s?.round) how.push(`round ${s.round} à ${s.time}`);
  // Détail de l'arbitre (en anglais, ex. « Eye poke by Gane ») ; les scores des juges sont ignorés.
  const details = s?.details?.replace(/^to(?=[A-Z])/, "");
  if (details && !/\d+ - \d+/.test(details)) how.push(`détail officiel : « ${details} »`);
  parts.push(`(${how.join(", ")})`);
  const where = [r.event, s?.date && `le ${s.date}`, s?.title && "combat pour le titre"].filter(Boolean).join(", ");
  if (where) parts.push(`— ${where}`);
  if (s?.stats) {
    const x = s.stats;
    parts.push(`— chiffres du combat : frappes significatives ${ratio(x.frappes)} touchées contre ${ratio(x.frappesSubies)} pour l'adversaire, amenées au sol ${ratio(x.amenees)} contre ${ratio(x.ameneesSubies)}, knockdowns ${x.kd}-${x.kdSubis}, contrôle au sol ${Math.round(x.controle / 60)} min`);
  }
  if (r.note) parts.push(`— à savoir : ${r.note}`);
  return parts.join(" ");
}

const DIVISIONS = {
  "Poids lourd": "poids lourds", "Poids mi-lourd": "poids mi-lourds", "Poids moyen": "poids moyens", "Poids welter": "poids welters",
  "Poids leger": "poids légers", "Poids plume": "poids plumes", "Poids coq": "poids coqs", "Poids mouche": "poids mouches",
  "Poids coq feminin": "poids coqs féminins", "Poids mouche feminin": "poids mouches féminins", "Poids paille feminin": "poids pailles féminins",
};
function rankText(f) {
  if (f.categorie === "Legendes") return "légende retraitée (comparaison historique)";
  const div = DIVISIONS[f.categorie] || f.categorie?.toLowerCase();
  if (f.rang === 0) return `champion des ${div}`;
  if (f.rang) return `n°${f.rang} du classement officiel des ${div}`;
  return `${div}, hors top 15`;
}

function card(f, now) {
  const c = UFC_CAREER[f.id];
  const recent = recentFights(f);
  const last = recent.find((r) => r.sheet?.date)?.sheet.date;
  const lines = [
    `${f.nom} — ${rankText(f)}`,
    `- Bilan pro ${f.victoires}-${f.defaites}-${f.nuls}${f.nc ? ` (+${f.nc} sans décision)` : ""}${f.ufcV != null ? `, dont à l'UFC ${f.ufcV}-${f.ufcD}-${f.ufcN ?? 0}${f.ufcNc ? ` (+${f.ufcNc} sans décision)` : ""}` : ""}`,
    `- Âge ${v(age(f.naissance, now), " ans")}, taille ${v(f.taille, " cm")}, allonge ${v(f.allonge, " cm")}, base ${f.style?.length ? f.style.map((k) => STYLE_NAMES[k] || k).join(" + ") : "?"}`,
    `- Façon de gagner (part de ses ${f.victoires} victoires pro) : ${v(f.ko, "%")} par KO/TKO, ${v(f.sub, "%")} par soumission, ${v(f.dec, "%")} à la décision`,
  ];
  if (c && c.combatsUfc) {
    const small = (a) => (a < 10 ? " (petit échantillon, à prendre avec prudence)" : "");
    lines.push(
      `- Chiffres officiels UFC (UFCStats, ${c.combatsUfc} combats, ${c.minutes} minutes de combat) : ` +
      `${v(c.slpm)} frappes significatives touchées par minute et ${v(c.sapm)} encaissées, précision ${v(c.striking, "%")}, défense de frappe ${v(c.strDef, "%")} ; ` +
      `${c.kd} knockdowns infligés ; amenées au sol réussies ${ratio(c.td)} (${v(c.tdAcc, "%")})${small(c.td[1])}, ${v(c.tdAvg)} par 15 minutes ; ` +
      `amenées subies ${ratio(c.tdSubis)} (défense de lutte ${v(c.tdDef, "%")})${small(c.tdSubis[1])} ; ` +
      `${v(c.subAvg)} tentatives de soumission par 15 minutes ; temps passé à contrôler l'adversaire ${v(c.ctrlPct, "%")} du temps de combat`
    );
  } else {
    lines.push(`- Chiffres UFC : pas encore assez de combats à l'UFC. Précision des frappes ${v(f.striking, "%")}, des amenées au sol ${v(f.tdAcc, "%")}, défense de lutte ${v(f.tdDef, "%")}`);
  }
  if (last) lines.push(`- Dernier combat UFC le ${last} (il y a ${months(last, now)} mois)`);
  lines.push(`- 5 derniers combats, du plus récent au plus ancien :${recent.length ? recent.map((r) => `\n  • ${fightLine(r)}`).join("") : " non renseignés"}`);
  return lines.join("\n");
}

// Leurs face-à-face précédents (vus d'un côté), avec les chiffres officiels du combat.
function previousMeetings(a, b) {
  const meetings = recentFights(a).filter((r) => sameFighter(r.opponent, b.nom) || sameFighter(b.nom, r.opponent));
  return meetings.length ? meetings.map((r) => `• ${a.nom} : ${fightLine(r)}`).join("\n") : "";
}

// Étape 1 : actualité vérifiée des deux combattants (texte court, daté, sourcé). Ne bloque jamais l'analyse.
export async function researchContext(fighterA, fighterB, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const prompt = `Nous sommes le ${today}. Tu prépares le dossier d'un analyste MMA avant un duel ${fighterA.nom} contre ${fighterB.nom} (MMA, UFC).
Cherche sur le web l'actualité RÉCENTE (12 derniers mois) qui compte pour juger ce duel :
- les circonstances exactes de leurs derniers combats (arrêt, blessure, doigt dans l'œil, décision contestée, résultat annulé, remplacement de dernière minute, poids manqué) ;
- s'ils se sont déjà affrontés : comment ça s'est passé, qui dominait au moment de l'arrêt ;
- blessures, opérations, longue inactivité, suspension, changement de catégorie ou de camp d'entraînement, combat prévu entre eux.

Règles :
- Ne garde que des faits confirmés par une source fiable (site officiel ou grand média MMA), jamais une rumeur. Indique la date et le média pour chaque fait.
- Si tu ne trouves rien de fiable sur un point, n'en parle pas. N'invente rien.
- Réponds en français, en 8 puces maximum, sans introduction ni conclusion. Si rien d'utile : réponds exactement « Rien de notable. »`;

  let messages = [{ role: "user", content: prompt }];
  const tools = [{ type: "web_search_20260209", name: "web_search", max_uses: 5, allowed_domains: NEWS_DOMAINS }];
  for (let i = 0; i < 3; i++) {
    const data = await call({ max_tokens: 6000, output_config: { effort: "low" }, tools, messages });
    if (data.stop_reason !== "pause_turn") {
      const text = textOf(data);
      return !text || /^rien de notable/i.test(text) ? "" : text.slice(0, 3000);
    }
    // Recherche longue : on relance pour que le serveur reprenne où il s'est arrêté.
    messages = [{ role: "user", content: prompt }, { role: "assistant", content: data.content }];
  }
  return "";
}

export async function generateAnalysis({ fighterA, fighterB, probA, probB, lang = "fr", context = "" }) {
  const LANGUAGE_NAMES = { fr: "français", en: "anglais", es: "espagnol" };
  const language = LANGUAGE_NAMES[lang] || "français";
  const now = new Date();
  const meetings = previousMeetings(fighterA, fighterB);

  const prompt = `Tu es le meilleur analyste MMA francophone, celui que les fans et les parieurs lisent avant chaque gros combat. Ton style : vivant, tranchant, concret, comme un consultant TV qui a regardé toutes les vidéos. Chaque affirmation s'appuie sur un chiffre ou un fait ci-dessous, et tu compares toujours les deux combattants chiffre contre chiffre. Le lecteur doit finir en se disant « heureusement que j'ai lu ça avant de me décider ».

Nous sommes le ${now.toISOString().slice(0, 10)}.

Règles strictes :
- Écris en ${language}.
- Utilise UNIQUEMENT les données et l'actualité ci-dessous. N'invente aucun combat, blessure, déclaration, camp d'entraînement ou statistique. Si une donnée vaut « ? », ignore-la.
- Juge la qualité des chiffres : un pourcentage tiré de quelques tentatives (petit échantillon) pèse peu ; un volume (frappes par minute, encaissées par minute, temps de contrôle) dit souvent plus qu'une précision.
- Ne compte pas un « sans décision » comme une défaite ni comme une victoire : regarde ce qui s'est passé dans le combat (chiffres, circonstances) pour savoir qui avait l'avantage.
- Tiens compte du niveau des adversaires, de l'âge, de l'inactivité et d'un changement de catégorie.
- Si les deux se sont déjà affrontés, c'est un élément central de l'analyse : explique ce que ce combat a montré.
- Ne cite jamais de cotes, de bookmaker, de montant de mise ni de conseil de pari, et ne présente jamais un résultat comme certain.

${card(fighterA, now)}

${card(fighterB, now)}
${meetings ? `\nDéjà affrontés :\n${meetings}\n` : ""}
Actualité récente vérifiée (recherche web du jour, médias MMA reconnus) :
${context || "Rien de notable trouvé."}

Probabilité calculée par notre modèle statistique (bilan, frappe, lutte, finitions ; il ignore l'actualité et les face-à-face) : ${fighterA.nom} ${probA}% / ${fighterB.nom} ${probB}%.
Chiffres officiels arrêtés au ${UFC_CAREER_DATE}.

Remplis chaque champ :
- accroche : une phrase choc (20 mots max) qui résume l'enjeu du duel.
- cles : les 3 facteurs qui vont décider du combat. Pour chacun, un titre court (3 à 6 mots) et un détail de 1 à 2 phrases avec les chiffres des deux combattants.
- forme : 2 phrases sur la dynamique récente de chacun d'après leurs derniers combats (séries, façon de gagner ou de perdre, niveau des adversaires, circonstances).
- scenario : 2 à 3 phrases qui racontent le déroulé le plus probable du combat, round après round si utile.
- tendance : comment ce combat a le plus de chances de se terminer (ko, soumission ou decision).
- piege : 1 à 2 phrases sur le scénario qui ferait tomber le favori.
- favori : le nom exact du combattant que tu donnes favori. Si ce n'est pas celui que notre modèle place devant, explique pourquoi dans le verdict.
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
      favori: { type: "string", enum: [fighterA.nom, fighterB.nom] },
      confiance: { type: "string", enum: ["faible", "moyenne", "forte"] },
      verdict: { type: "string" },
    },
  };

  const data = await call({
    max_tokens: 16000,
    output_config: { effort: "high", format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }],
  });
  // La réponse peut commencer par un bloc de réflexion : on ne garde que le texte.
  const text = textOf(data);
  if (!text) throw new Error(`Réponse vide (stop_reason: ${data.stop_reason})`);
  return JSON.parse(text);
}

// Les deux étapes à la suite ; l'actualité est jointe à l'analyse gardée (champ « contexte », non affiché).
export async function analyzeDuel(args) {
  const context = await researchContext(args.fighterA, args.fighterB).catch((e) => {
    console.error("Recherche d'actualité impossible :", e);
    return "";
  });
  return { ...(await generateAnalysis({ ...args, context })), contexte: context };
}
