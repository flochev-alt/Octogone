// Système de traduction du site (FR / EN / ES). Tout texte visible doit passer par ce fichier
// ou par un objet { fr, en, es } lu avec L(). FR et ES restent en cm (métrique),
// EN bascule automatiquement en pieds/pouces (imperial), comme demandé.

export const LANGUAGES = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

export const STORAGE_KEY = "octogone-lang";

export function getInitialLang() {
  if (typeof window === "undefined") return "fr";
  return localStorage.getItem(STORAGE_KEY) || "fr";
}

export function setStoredLang(lang) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, lang);
}

// --- Conversion d'unités ---
export function formatHeight(cm, lang) {
  if (cm == null) return null;
  if (lang !== "en") return `${cm} cm`;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export const formatReach = formatHeight;

// --- Divisions live (API Octagon) ---
export const DIVISION_LABELS = {
  fr: {
    flyweight: "Poids mouche", bantamweight: "Poids coq", featherweight: "Poids plume",
    lightweight: "Poids léger", welterweight: "Poids welter", middleweight: "Poids moyen",
    "light-heavyweight": "Poids mi-lourd", heavyweight: "Poids lourd",
    "women-strawweight": "F. Poids paille", "women-flyweight": "F. Poids mouche",
    "women-bantamweight": "F. Poids coq", "women-featherweight": "F. Poids plume",
  },
  en: {
    flyweight: "Flyweight", bantamweight: "Bantamweight", featherweight: "Featherweight",
    lightweight: "Lightweight", welterweight: "Welterweight", middleweight: "Middleweight",
    "light-heavyweight": "Light Heavyweight", heavyweight: "Heavyweight",
    "women-strawweight": "W. Strawweight", "women-flyweight": "W. Flyweight",
    "women-bantamweight": "W. Bantamweight", "women-featherweight": "W. Featherweight",
  },
  es: {
    flyweight: "Peso mosca", bantamweight: "Peso gallo", featherweight: "Peso pluma",
    lightweight: "Peso ligero", welterweight: "Peso wélter", middleweight: "Peso medio",
    "light-heavyweight": "Semipesado", heavyweight: "Peso pesado",
    "women-strawweight": "F. Peso paja", "women-flyweight": "F. Peso mosca",
    "women-bantamweight": "F. Peso gallo", "women-featherweight": "F. Peso pluma",
  },
};

export const translateDivision = (slug, lang) => DIVISION_LABELS[lang]?.[slug] || slug;

// --- Catégories de poids (issues de fightersData.js, stockées en français) ---
// Ordre d'affichage : hommes du plus léger au plus lourd, puis femmes, puis légendes.
export const CATEGORY_ORDER = [
  "Poids mouche", "Poids coq", "Poids plume", "Poids leger", "Poids welter", "Poids moyen",
  "Poids mi-lourd", "Poids lourd", "Poids paille feminin", "Poids mouche feminin", "Poids coq feminin", "Legendes",
];

export const CATEGORY_TRANSLATIONS = {
  "Poids welter": { fr: "Poids welter", en: "Welterweight", es: "Peso wélter" },
  "Poids lourd": { fr: "Poids lourd", en: "Heavyweight", es: "Peso pesado" },
  "Poids leger": { fr: "Poids léger", en: "Lightweight", es: "Peso ligero" },
  "Poids plume": { fr: "Poids plume", en: "Featherweight", es: "Peso pluma" },
  "Poids coq": { fr: "Poids coq", en: "Bantamweight", es: "Peso gallo" },
  "Poids mouche": { fr: "Poids mouche", en: "Flyweight", es: "Peso mosca" },
  "Poids moyen": { fr: "Poids moyen", en: "Middleweight", es: "Peso medio" },
  "Poids mi-lourd": { fr: "Poids mi-lourd", en: "Light Heavyweight", es: "Semipesado" },
  "Poids coq feminin": { fr: "Poids coq féminin", en: "Women's Bantamweight", es: "Peso gallo femenino" },
  "Poids mouche feminin": { fr: "Poids mouche féminin", en: "Women's Flyweight", es: "Peso mosca femenino" },
  "Poids paille feminin": { fr: "Poids paille féminin", en: "Women's Strawweight", es: "Peso paja femenino" },
  "Legendes": { fr: "Légendes", en: "Legends", es: "Leyendas" },
};

export const translateCategory = (cat, lang) => CATEGORY_TRANSLATIONS[cat]?.[lang] || cat;

// --- Styles de combat (clés utilisées dans fightersData.js) ---
export const STYLE_LABELS = {
  lutte: { fr: "Lutte", en: "Wrestling", es: "Lucha" },
  sambo: { fr: "Sambo", en: "Sambo", es: "Sambo" },
  jjb: { fr: "Jiu-jitsu brésilien", en: "Brazilian Jiu-Jitsu", es: "Jiu-jitsu brasileño" },
  judo: { fr: "Judo", en: "Judo", es: "Judo" },
  boxe: { fr: "Boxe anglaise", en: "Boxing", es: "Boxeo" },
  kickboxing: { fr: "Kickboxing", en: "Kickboxing", es: "Kickboxing" },
  muaythai: { fr: "Muay-thaï", en: "Muay Thai", es: "Muay thai" },
  karate: { fr: "Karaté", en: "Karate", es: "Kárate" },
  taekwondo: { fr: "Taekwondo", en: "Taekwondo", es: "Taekwondo" },
  sanda: { fr: "Sanda (boxe chinoise)", en: "Sanda (Chinese kickboxing)", es: "Sanda (boxeo chino)" },
  kungfu: { fr: "Kung-fu", en: "Kung fu", es: "Kung-fu" },
  corpsacorps: { fr: "Combat corps à corps", en: "Hand-to-hand combat", es: "Combate cuerpo a cuerpo" },
  mma: { fr: "MMA (formé directement au MMA)", en: "MMA (trained in MMA from the start)", es: "MMA (formado directamente en MMA)" },
};

export const formatStyle = (keys, lang) => (keys || []).map((k) => STYLE_LABELS[k]?.[lang] || k).join(" · ");

// --- Méthodes de victoire ---
export const METHOD_LABELS = {
  "KO": { fr: "KO", en: "KO", es: "KO" },
  "TKO": { fr: "TKO", en: "TKO", es: "TKO" },
  "Soumission": { fr: "Soumission", en: "Submission", es: "Sumisión" },
  "Décision": { fr: "Décision", en: "Decision", es: "Decisión" },
  "Décision unanime": { fr: "Décision unanime", en: "Unanimous decision", es: "Decisión unánime" },
  "Décision partagée": { fr: "Décision partagée", en: "Split decision", es: "Decisión dividida" },
  "Décision majoritaire": { fr: "Décision majoritaire", en: "Majority decision", es: "Decisión mayoritaria" },
  "Décision technique": { fr: "Décision technique", en: "Technical decision", es: "Decisión técnica" },
  "Match nul partagé": { fr: "Match nul partagé", en: "Split draw", es: "Empate dividido" },
  "Match nul majoritaire": { fr: "Match nul majoritaire", en: "Majority draw", es: "Empate mayoritario" },
  "Disqualification": { fr: "Disqualification", en: "Disqualification", es: "Descalificación" },
  "Sans décision": { fr: "Sans décision", en: "No contest", es: "Sin resultado" },
};

export const translateMethod = (m, lang) => METHOD_LABELS[m]?.[lang] || m;

// Texte multilingue : une chaîne simple (identique dans toutes les langues) ou un objet { fr, en, es }.
export const L = (v, lang) => (v && typeof v === "object" ? v[lang] ?? v.fr : v);

// --- Dates et âge ---
const LOCALES = { fr: "fr-FR", en: "en-GB", es: "es-ES" };

export function formatDate(iso, lang, opts = { day: "numeric", month: "long", year: "numeric" }) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALES[lang] || "fr-FR", { timeZone: "UTC", ...opts });
}

export function ageFrom(iso) {
  if (!iso) return null;
  const birth = new Date(`${iso}T00:00:00Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const m = now.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

// --- Textes de l'interface ---
export const T = {
  fr: {
    language: "Langue",
    navCombattants: "Combattants",
    navSimulateur: "Simulateur",
    navMedia: "Médias",
    landingKicker: "Stats MMA",
    landingTitle1: "ENTREZ DANS",
    landingTitle2: "L'OCTOGONE.",
    landingSubtitle: "Les stats, les duels, les probabilités — tout l'univers UFC passé au crible, sans détour.",
    landingCta: "Explorer le site",
    navCardCombattantsDesc: "Classements et fiches détaillées",
    navCardSimulateurDesc: "Probabilités de duels par catégorie",
    navCardMediaDesc: "Cartes à venir, résultats et vidéos",
    comingSoon: "Bientôt disponible",
    searchPlaceholder: "Rechercher un combattant",
    champion: "Champion",
    categoryUnavailable: "Cette catégorie est indisponible pour le moment.",
    searchingOtherCategories: "Recherche dans les autres catégories…",
    noResults: (q) => `Aucun résultat pour « ${q} ».`,
    record: "Bilan complet V-D-N",
    ufcRecord: "Bilan à l'UFC",
    winsBy: "Répartition des victoires",
    division: "Division",
    heightReach: "Taille / Allonge",
    birthplace: "Lieu de naissance",
    trainsAt: "S'entraîne à",
    style: "Style",
    age: "Âge",
    recentFights: "5 derniers combats",
    footer: "Octogone — classements, bilans et fiches vérifiés manuellement (ufc-fr.com, UFC.com, Wikipédia). Lieu de naissance et salle d'entraînement via Octagon API.",
    simTitle: "Simulateur de duel",
    weightCategory: "Catégorie de poids",
    fighter1: "Combattant 1",
    fighter2: "Combattant 2",
    analyze: "Analyser le duel",
    notEnoughFighters: "Pas assez de combattants dans cette catégorie pour l'instant — reviens plus tard une fois la base enrichie.",
    probLabel: (cat) => `Probabilité de victoire estimée à partir des stats connues — ${cat}`,
    comparatif: "Comparatif",
    record2: "Bilan",
    strikingAcc: "Précision striking",
    tdAcc: "Précision takedown",
    tdDef: "Défense takedown",
    reach: "Allonge",
    expertAnalysis: "Analyse experte",
    generateAI: "Générer une analyse IA",
    generating: "Génération...",
    freeLeft: (n) => `${n} analyse${n > 1 ? "s" : ""} gratuite${n > 1 ? "s" : ""} restante${n > 1 ? "s" : ""} aujourd'hui`,
    limitReached: (n) => `Limite quotidienne atteinte (${n} analyses/jour). Reviens demain pour de nouvelles analyses !`,
    aiUnavailable: "L'analyse IA n'est pas encore activée sur ce site (il manque une clé API Anthropic dans les réglages Vercel).",
    champions: "Champions",
    championSince: (d, f) => `${f ? "Championne" : "Champion"} depuis le ${d}`,
    ranking: "Classement UFC",
    unranked: "Non classés",
    allCategories: "Résultats dans toutes les catégories",
    legal: "Mentions légales",
    loading: "Chargement…",
    instagramOf: (n) => `Instagram de ${n}`,
    years: (n) => `${n} ans`,
    win: "V",
    loss: "D",
    draw: "N",
    noContest: "NC",
    advantages: "Avantages",
    vipActive: "Accès illimité activé",
    today: "AUJOURD'HUI",
    tomorrow: "DEMAIN",
    mediaTitle: "Média — fil d'actualité",
    mediaSearch: "Rechercher par mot-clé (combattant, événement, ville...)",
    titleFight: "Combat pour le titre",
    official: "Officiel",
    finishLabel: "Le finish du main event",
    viewPost: "Voir le post",
    cookies: "Cookies",
    cookiesTitle: "Mesure d'audience",
    cookiesText: "Avec ton accord, Octogone utilise Google Analytics pour compter les visites et améliorer le site. Aucune publicité, et tu peux changer d'avis à tout moment via le lien « Cookies » en bas de page.",
    cookiesAccept: "Accepter",
    cookiesRefuse: "Refuser",
    mediaDisclaimer: "Résumés rédigés à partir de sources publiques (UFC.com, réseaux sociaux des combattants). Les vidéos et posts X sont intégrés via le lecteur officiel de X, avec un lien vers le compte d'origine.",
  },
  en: {
    language: "Language",
    navCombattants: "Fighters",
    navSimulateur: "Simulator",
    navMedia: "Media",
    landingKicker: "MMA Stats",
    landingTitle1: "ENTER THE",
    landingTitle2: "OCTAGON.",
    landingSubtitle: "Stats, matchups, probabilities — the entire UFC universe, laid bare.",
    landingCta: "Explore the site",
    navCardCombattantsDesc: "Rankings and detailed profiles",
    navCardSimulateurDesc: "Matchup probabilities by weight class",
    navCardMediaDesc: "Upcoming cards, results and videos",
    comingSoon: "Coming soon",
    searchPlaceholder: "Search a fighter",
    champion: "Champion",
    categoryUnavailable: "This category is unavailable right now.",
    searchingOtherCategories: "Searching other categories…",
    noResults: (q) => `No results for "${q}".`,
    record: "Full record W-L-D",
    ufcRecord: "UFC record",
    winsBy: "How they win",
    division: "Division",
    heightReach: "Height / Reach",
    birthplace: "Place of birth",
    trainsAt: "Trains at",
    style: "Style",
    age: "Age",
    recentFights: "Last 5 fights",
    footer: "Octogone — rankings, records and profiles manually verified (ufc-fr.com, UFC.com, Wikipedia). Birthplace and gym via Octagon API.",
    simTitle: "Matchup Simulator",
    weightCategory: "Weight class",
    fighter1: "Fighter 1",
    fighter2: "Fighter 2",
    analyze: "Analyze matchup",
    notEnoughFighters: "Not enough fighters in this category yet — check back once the database grows.",
    probLabel: (cat) => `Win probability estimated from known stats — ${cat}`,
    comparatif: "Comparison",
    record2: "Record",
    strikingAcc: "Striking accuracy",
    tdAcc: "Takedown accuracy",
    tdDef: "Takedown defense",
    reach: "Reach",
    expertAnalysis: "Expert analysis",
    generateAI: "Generate AI analysis",
    generating: "Generating...",
    freeLeft: (n) => `${n} free analys${n > 1 ? "es" : "is"} left today`,
    limitReached: (n) => `Daily limit reached (${n} analyses/day). Come back tomorrow for more!`,
    aiUnavailable: "AI analysis isn't activated on this site yet (missing Anthropic API key in Vercel settings).",
    champions: "Champions",
    championSince: (d) => `Champion since ${d}`,
    ranking: "UFC ranking",
    unranked: "Unranked",
    allCategories: "Results across all weight classes",
    legal: "Legal notice",
    loading: "Loading…",
    instagramOf: (n) => `${n} on Instagram`,
    years: (n) => `${n} years`,
    win: "W",
    loss: "L",
    draw: "D",
    noContest: "NC",
    advantages: "Advantages",
    vipActive: "Unlimited access enabled",
    today: "TODAY",
    tomorrow: "TOMORROW",
    mediaTitle: "Media — news feed",
    mediaSearch: "Search by keyword (fighter, event, city...)",
    titleFight: "Title fight",
    official: "Official",
    finishLabel: "The main event finish",
    viewPost: "View the post",
    cookies: "Cookies",
    cookiesTitle: "Audience measurement",
    cookiesText: "With your consent, Octogone uses Google Analytics to count visits and improve the site. No advertising, and you can change your mind at any time via the \"Cookies\" link at the bottom of the page.",
    cookiesAccept: "Accept",
    cookiesRefuse: "Decline",
    mediaDisclaimer: "Summaries written from public sources (UFC.com, fighters' social media). Videos and X posts are embedded through X's official player, with a link to the original account.",
  },
  es: {
    language: "Idioma",
    navCombattants: "Combatientes",
    navSimulateur: "Simulador",
    navMedia: "Media",
    landingKicker: "Stats MMA",
    landingTitle1: "ENTRA EN",
    landingTitle2: "EL OCTÁGONO.",
    landingSubtitle: "Las estadísticas, los combates, las probabilidades — todo el universo UFC al detalle.",
    landingCta: "Explorar el sitio",
    navCardCombattantsDesc: "Clasificaciones y fichas detalladas",
    navCardSimulateurDesc: "Probabilidades de combate por categoría",
    navCardMediaDesc: "Próximas galas, resultados y vídeos",
    comingSoon: "Próximamente",
    searchPlaceholder: "Buscar un combatiente",
    champion: "Campeón",
    categoryUnavailable: "Esta categoría no está disponible por el momento.",
    searchingOtherCategories: "Buscando en otras categorías…",
    noResults: (q) => `Sin resultados para «${q}».`,
    record: "Récord completo V-D-N",
    ufcRecord: "Récord en la UFC",
    winsBy: "Cómo gana",
    division: "División",
    heightReach: "Altura / Alcance",
    birthplace: "Lugar de nacimiento",
    trainsAt: "Entrena en",
    style: "Estilo",
    age: "Edad",
    recentFights: "Últimos 5 combates",
    footer: "Octogone — clasificaciones, récords y fichas verificados manualmente (ufc-fr.com, UFC.com, Wikipedia). Lugar de nacimiento y gimnasio vía Octagon API.",
    simTitle: "Simulador de combate",
    weightCategory: "Categoría de peso",
    fighter1: "Combatiente 1",
    fighter2: "Combatiente 2",
    analyze: "Analizar el combate",
    notEnoughFighters: "Aún no hay suficientes combatientes en esta categoría — vuelve más tarde.",
    probLabel: (cat) => `Probabilidad de victoria estimada a partir de las stats conocidas — ${cat}`,
    comparatif: "Comparativa",
    record2: "Récord",
    strikingAcc: "Precisión de golpeo",
    tdAcc: "Precisión de derribo",
    tdDef: "Defensa de derribo",
    reach: "Alcance",
    expertAnalysis: "Análisis experto",
    generateAI: "Generar análisis IA",
    generating: "Generando...",
    freeLeft: (n) => `${n} análisis gratis restante${n > 1 ? "s" : ""} hoy`,
    limitReached: (n) => `Límite diario alcanzado (${n} análisis/día). ¡Vuelve mañana!`,
    aiUnavailable: "El análisis IA aún no está activado en este sitio (falta la clave API de Anthropic en Vercel).",
    champions: "Campeones",
    championSince: (d, f) => `${f ? "Campeona" : "Campeón"} desde el ${d}`,
    ranking: "Clasificación UFC",
    unranked: "Sin clasificar",
    allCategories: "Resultados en todas las categorías",
    legal: "Aviso legal",
    loading: "Cargando…",
    instagramOf: (n) => `Instagram de ${n}`,
    years: (n) => `${n} años`,
    win: "V",
    loss: "D",
    draw: "E",
    noContest: "NC",
    advantages: "Ventajas",
    vipActive: "Acceso ilimitado activado",
    today: "HOY",
    tomorrow: "MAÑANA",
    mediaTitle: "Media — noticias",
    mediaSearch: "Buscar por palabra clave (combatiente, evento, ciudad...)",
    titleFight: "Combate por el título",
    official: "Oficial",
    finishLabel: "El final del main event",
    viewPost: "Ver la publicación",
    cookies: "Cookies",
    cookiesTitle: "Medición de audiencia",
    cookiesText: "Con tu consentimiento, Octogone usa Google Analytics para contar las visitas y mejorar el sitio. Sin publicidad, y puedes cambiar de opinión en cualquier momento con el enlace «Cookies» al pie de página.",
    cookiesAccept: "Aceptar",
    cookiesRefuse: "Rechazar",
    mediaDisclaimer: "Resúmenes redactados a partir de fuentes públicas (UFC.com, redes sociales de los combatientes). Los vídeos y posts de X se integran mediante el reproductor oficial de X, con un enlace a la cuenta original.",
  },
};
