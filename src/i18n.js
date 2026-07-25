// Système de traduction du site. FR et ES restent en cm/m (métrique),
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

// --- Catégories du Simulateur (issues de fightersData.js, stockées en français) ---
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

// --- Textes de l'interface ---
export const T = {
  fr: {
    navCombattants: "Combattants",
    navSimulateur: "Simulateur",
    landingKicker: "Stats MMA",
    landingTitle1: "ENTREZ DANS",
    landingTitle2: "L'OCTOGONE.",
    landingSubtitle: "Les stats, les duels, les probabilités — tout l'univers UFC passé au crible, sans détour.",
    landingCta: "Explorer le site",
    navCardCombattantsDesc: "Classements et fiches détaillées",
    navCardSimulateurDesc: "Probabilités de duels par catégorie",
    navCardMediaDesc: "Cartes à venir et actualités",
    comingSoon: "Bientôt disponible",
    searchPlaceholder: "Rechercher un combattant",
    champion: "Champion",
    categoryUnavailable: "Cette catégorie est indisponible pour le moment.",
    searchingOtherCategories: "Recherche dans les autres catégories…",
    noResults: (q) => `Aucun résultat pour « ${q} ».`,
    record: "Bilan V-D-N",
    division: "Division",
    heightReach: "Taille / Allonge",
    birthplace: "Lieu de naissance",
    trainsAt: "S'entraîne à",
    style: "Style",
    age: "Âge",
    recentFights: "5 derniers combats",
    footer: "Octogone — données UFC via Octagon API. Simulateur basé sur une base de combattants vérifiée manuellement.",
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
  },
  en: {
    navCombattants: "Fighters",
    navSimulateur: "Simulator",
    landingKicker: "MMA Stats",
    landingTitle1: "ENTER THE",
    landingTitle2: "OCTAGON.",
    landingSubtitle: "Stats, matchups, probabilities — the entire UFC universe, laid bare.",
    landingCta: "Explore the site",
    navCardCombattantsDesc: "Rankings and detailed profiles",
    navCardSimulateurDesc: "Matchup probabilities by weight class",
    navCardMediaDesc: "Upcoming cards and news",
    comingSoon: "Coming soon",
    searchPlaceholder: "Search a fighter",
    champion: "Champion",
    categoryUnavailable: "This category is unavailable right now.",
    searchingOtherCategories: "Searching other categories…",
    noResults: (q) => `No results for "${q}".`,
    record: "Record W-L-D",
    division: "Division",
    heightReach: "Height / Reach",
    birthplace: "Place of birth",
    trainsAt: "Trains at",
    style: "Style",
    age: "Age",
    recentFights: "Last 5 fights",
    footer: "Octogone — UFC data via Octagon API. Simulator based on a manually verified fighter database.",
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
  },
  es: {
    navCombattants: "Combatientes",
    navSimulateur: "Simulador",
    landingKicker: "Stats MMA",
    landingTitle1: "ENTRA EN",
    landingTitle2: "EL OCTÁGONO.",
    landingSubtitle: "Las estadísticas, los combates, las probabilidades — todo el universo UFC al detalle.",
    landingCta: "Explorar el sitio",
    navCardCombattantsDesc: "Clasificaciones y fichas detalladas",
    navCardSimulateurDesc: "Probabilidades de combate por categoría",
    navCardMediaDesc: "Próximas galas y noticias",
    comingSoon: "Próximamente",
    searchPlaceholder: "Buscar un combatiente",
    champion: "Campeón",
    categoryUnavailable: "Esta categoría no está disponible por el momento.",
    searchingOtherCategories: "Buscando en otras categorías…",
    noResults: (q) => `Sin resultados para «${q}».`,
    record: "Récord V-D-N",
    division: "División",
    heightReach: "Altura / Alcance",
    birthplace: "Lugar de nacimiento",
    trainsAt: "Entrena en",
    style: "Estilo",
    age: "Edad",
    recentFights: "Últimos 5 combates",
    footer: "Octogone — datos UFC vía Octagon API. Simulador basado en una base de combatientes verificada manualmente.",
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
  },
};
