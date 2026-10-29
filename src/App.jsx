import { useState, useEffect, useMemo } from "react";
import { Search, X, ChevronRight, Trophy, MapPin, Users, Swords, Instagram, Cake, Dumbbell, Medal } from "lucide-react";
import Simulator from "./Simulator.jsx";
import Landing from "./Landing.jsx";
import Media from "./Media.jsx";
import MentionsLegales from "./MentionsLegales.jsx";
import ConsentBanner from "./ConsentBanner.jsx";
import { useFighters } from "./useFighters.js";
import FighterAvatar, { initialsOf } from "./FighterAvatar.jsx";
import { usePhotos, creditOf } from "./usePhotos.js";
import { RECENT_FIGHTS } from "./recentFights.js";
import {
  LANGUAGES, T, L, CATEGORY_ORDER, translateCategory, translateMethod, formatStyle,
  formatHeight, formatDate, ageFrom, getInitialLang, setStoredLang,
} from "./i18n.js";

// Comptes Instagram officiels vérifiés manuellement — recherche par nom (pas exhaustif,
// à compléter au fur et à mesure). Un fighter absent de cette liste n'affiche pas la bulle.
const INSTAGRAM = {
  "islam makhachev": "islam_makhachev",
  "alex pereira": "alexpoatanpereira",
  "justin gaethje": "justin_gaethje",
  "ilia topuria": "iliatopuria",
  "alexander volkanovski": "alexvolkanovski",
  "petr yan": "petr_yan",
  "merab dvalishvili": "merab.dvalishvili",
  "alexandre pantoja": "pantoja_oficial",
  "khamzat chimaev": "khamzat_chimaev",
  "sean strickland": "stricklandmma",
  "tom aspinall": "tomaspinallofficial",
  "ciryl gane": "ciryl_gane",
  "jack della maddalena": "jackdellamaddalena",
  "magomed ankalaev": "ankalaev_magomed",
  "kayla harrison": "kaylaharrisonofficial",
  "valentina shevchenko": "bulletvalentina",
  "mackenzie dern": "mackenziedern",
  "julianna pena": "venezuelanvixen",
  "virna jandiroba": "virnajandiroba",
  "khabib nurmagomedov": "khabib_nurmagomedov",
  "conor mcgregor": "thenotoriousmma",
  "georges st-pierre": "georgesstpierre",
};

const getInstagram = (name) => INSTAGRAM[name?.toLowerCase()];

const normName = (n) => n?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ").toLowerCase().trim();
const formatRecord = (v, d, n, nc) => `${v}-${d}-${n}${nc ? ` (${nc} NC)` : ""}`;
// Identifiant de l'API Octagon (slug UFC.com) déduit du nom : "Uroš Medić" -> "uros-medic".
const toSlug = (name) => normName(name).replace(/['.]/g, "").replace(/\s+/g, "-");

// Classement : champion (rang 0), puis 1 à 15, puis les non-classés dans l'ordre de la base.
const byRank = (a, b) => (a.rang ?? 99) - (b.rang ?? 99);

// Champions actuels — vérifiés manuellement (recherches croisées), à mettre à jour à chaque changement de titre.
const CHAMPIONS = [
  {
    categorie: "Poids lourd", name: "Ciryl Gane", since: "2026-09-20",
    note: {
      fr: "Champion intérimaire (KO face à Alex Pereira, UFC Freedom 250), promu champion incontesté après l'abandon du titre par Tom Aspinall, blessé à l'œil. Première défense face à Josh Hokit le 14 nov. 2026 (UFC 334).",
      en: "Interim champion (KO over Alex Pereira, UFC Freedom 250), promoted to undisputed champion after Tom Aspinall vacated the title with an eye injury. First defense against Josh Hokit on Nov. 14, 2026 (UFC 334).",
      es: "Campeón interino (KO a Alex Pereira, UFC Freedom 250), ascendido a campeón indiscutible tras la renuncia al título de Tom Aspinall, lesionado en un ojo. Primera defensa ante Josh Hokit el 14 de nov. de 2026 (UFC 334).",
    },
  },
  {
    categorie: "Poids mi-lourd", name: "Carlos Ulberg", since: "2026-04-11",
    note: {
      fr: "KO au 1er round face à Jiří Procházka (UFC 327).",
      en: "First-round KO over Jiří Procházka (UFC 327).",
      es: "KO en el primer asalto ante Jiří Procházka (UFC 327).",
    },
  },
  {
    categorie: "Poids moyen", name: "Sean Strickland", since: "2026-05-09",
    note: {
      fr: "Décision partagée face à Khamzat Chimaev (UFC 328).",
      en: "Split decision over Khamzat Chimaev (UFC 328).",
      es: "Decisión dividida ante Khamzat Chimaev (UFC 328).",
    },
  },
  {
    categorie: "Poids welter", name: "Islam Makhachev", since: "2025-11-15",
    note: {
      fr: "Décision unanime face à Jack Della Maddalena (UFC 322). A défendu son titre face à Ian Machado Garry (UFC 330).",
      en: "Unanimous decision over Jack Della Maddalena (UFC 322). Defended his title against Ian Machado Garry (UFC 330).",
      es: "Decisión unánime ante Jack Della Maddalena (UFC 322). Defendió su título ante Ian Machado Garry (UFC 330).",
    },
  },
  {
    categorie: "Poids leger", name: "Justin Gaethje", since: "2026-06-14",
    note: {
      fr: "TKO au 4e round face à Ilia Topuria (UFC Freedom 250).",
      en: "Fourth-round TKO over Ilia Topuria (UFC Freedom 250).",
      es: "TKO en el cuarto asalto ante Ilia Topuria (UFC Freedom 250).",
    },
  },
  {
    categorie: "Poids plume", name: "Alexander Volkanovski", since: "2025-04-12",
    note: {
      fr: "Décision unanime face à Diego Lopes (UFC 314). A défendu son titre face à Movsar Evloev par TKO au 2e round (UFC 333).",
      en: "Unanimous decision over Diego Lopes (UFC 314). Defended his title against Movsar Evloev by second-round TKO (UFC 333).",
      es: "Decisión unánime ante Diego Lopes (UFC 314). Defendió su título ante Movsar Evloev por TKO en el segundo asalto (UFC 333).",
    },
  },
  {
    categorie: "Poids coq", name: "Petr Yan", since: "2025-12-06",
    note: {
      fr: "Décision unanime face à Merab Dvalishvili (UFC 323). L'a de nouveau battu par décision unanime (UFC 333).",
      en: "Unanimous decision over Merab Dvalishvili (UFC 323). Beat him again by unanimous decision (UFC 333).",
      es: "Decisión unánime ante Merab Dvalishvili (UFC 323). Volvió a vencerle por decisión unánime (UFC 333).",
    },
  },
  {
    categorie: "Poids mouche", name: "Joshua Van", since: "2025-12-06",
    note: {
      fr: "TKO au 1er round face à Alexandre Pantoja (UFC 323). L'a de nouveau battu par décision unanime (UFC 331).",
      en: "First-round TKO over Alexandre Pantoja (UFC 323). Beat him again by unanimous decision (UFC 331).",
      es: "TKO en el primer asalto ante Alexandre Pantoja (UFC 323). Volvió a vencerle por decisión unánime (UFC 331).",
    },
  },
  {
    categorie: "Poids coq feminin", name: "Kayla Harrison", since: "2025-06-07", female: true,
    note: {
      fr: "Soumission face à Julianna Peña (UFC 316). Son combat face à Amanda Nunes, prévu à l'UFC 324, a été reporté (blessure au cou) : il aura lieu le 14 nov. 2026 (UFC 334).",
      en: "Submission win over Julianna Peña (UFC 316). Her fight with Amanda Nunes, planned for UFC 324, was postponed (neck injury): it will take place on Nov. 14, 2026 (UFC 334).",
      es: "Victoria por sumisión ante Julianna Peña (UFC 316). Su combate ante Amanda Nunes, previsto en UFC 324, se aplazó (lesión en el cuello): será el 14 de nov. de 2026 (UFC 334).",
    },
  },
  {
    categorie: "Poids mouche feminin", name: "Natália Silva", since: "2026-10-03", female: true,
    note: {
      fr: "Titre vacant (Valentina Shevchenko blessée) remporté par décision unanime face à Wang Cong (UFC 332).",
      en: "Won the vacant title (Valentina Shevchenko injured) by unanimous decision over Wang Cong (UFC 332).",
      es: "Ganó el título vacante (Valentina Shevchenko lesionada) por decisión unánime ante Wang Cong (UFC 332).",
    },
  },
  {
    categorie: "Poids paille feminin", name: "Mackenzie Dern", since: "2025-10-25", female: true,
    note: {
      fr: "Titre vacant remporté face à Virna Jandiroba (UFC 321). A défendu son titre face à Gillian Robertson (UFC 330).",
      en: "Won the vacant title against Virna Jandiroba (UFC 321). Defended her title against Gillian Robertson (UFC 330).",
      es: "Ganó el título vacante ante Virna Jandiroba (UFC 321). Defendió su título ante Gillian Robertson (UFC 330).",
    },
  },
];


const METHOD_COLOR = {
  "KO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "TKO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Soumission": "text-sky-400 border-sky-400/30 bg-sky-400/10",
  "Décision": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision unanime": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision partagée": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision majoritaire": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision technique": "text-neutral-300 border-neutral-700 bg-neutral-800",
};

const RESULT_STYLE = {
  V: "bg-emerald-400/15 text-emerald-400",
  D: "bg-rose-400/15 text-rose-400",
  N: "bg-neutral-700/60 text-neutral-300",
  NC: "bg-neutral-700/60 text-neutral-300",
};

export default function App() {
  const [view, setView] = useState("landing");
  const changeView = (v) => setView(v);
  const [lang, setLangState] = useState("fr");
  const t = T[lang];

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    setStoredLang(l);
  };

  const [categorie, setCategorie] = useState("Poids leger");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);

  // Une recherche porte sur toute la base (toutes catégories), sinon on affiche la catégorie choisie.
  const allFighters = useFighters();
  // Photos libres (Wikimedia Commons), chargées seulement sur l'onglet Combattants.
  const photos = usePhotos(view === "combattants" ? allFighters.map((f) => f.nom) : []);
  const photoOf = (f) => (f.photo ? { url: f.photo } : photos[f.nom] || null);
  const categories = useMemo(() => CATEGORY_ORDER.filter((c) => allFighters.some((f) => f.categorie === c)), [allFighters]);
  const searching = query.trim().length >= 2;
  const fighters = useMemo(() => {
    if (searching) {
      const q = normName(query);
      return allFighters.filter((f) => normName(f.nom).includes(q)).sort(byRank);
    }
    return allFighters.filter((f) => f.categorie === categorie).sort(byRank);
  }, [allFighters, categorie, query, searching]);

  const champion = !searching && fighters.find((f) => f.rang === 0);
  const listed = champion ? fighters.filter((f) => f !== champion) : fighters;
  const firstUnranked = searching ? -1 : listed.findIndex((f) => f.rang == null);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => { setSelected(null); setClosing(false); }, 260);
  };

  const banner = (
    <ConsentBanner
      lang={lang}
      forceOpen={cookiesOpen}
      onClose={() => setCookiesOpen(false)}
      onLegal={() => setView("mentions")}
    />
  );

  if (view === "landing") {
    return (
      <>
        <Landing
          onEnter={() => setView("combattants")}
          onEnterSimulator={() => setView("simulateur")}
          onEnterMedia={() => setView("media")}
          lang={lang}
          setLang={setLang}
        />
        {banner}
      </>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-neutral-950 text-neutral-50 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .disp { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
        .mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
        ::selection { background: #fbbf24; color: #0a0a0a; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes walkoutIn {
          0% { opacity: 0; transform: scale(1.25) rotate(-2deg); filter: blur(14px); }
          60% { filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes glowPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.15); } }
        @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes panelFlash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
        @keyframes panelShake {
          0%, 40% { transform: translateX(0); }
          48% { transform: translateX(-4px); }
          56% { transform: translateX(4px); }
          64% { transform: translateX(-2px); }
          72%, 100% { transform: translateX(0); }
        }
        .row-rise { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .sheet-enter { animation: sheetIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sheet-exit { animation: sheetOut 0.26s cubic-bezier(0.4, 0, 1, 1) forwards; }
        .backdrop-enter { animation: backdropIn 0.3s ease forwards; }
        .backdrop-exit { animation: backdropOut 0.26s ease forwards; }
        .walkout { animation: walkoutIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both, panelShake 0.7s ease-out both; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .ring-spin { animation: ringSpin 12s linear infinite; }
        .panel-flash { animation: panelFlash 0.45s ease-out forwards; }
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
      `}</style>

      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          <button onClick={() => changeView("landing")} className="tap flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="disp text-lg tracking-tight">
              <span className="sm:hidden">O</span>
              <span className="hidden sm:inline">OCTOGONE</span>
              <span className="text-amber-400">.</span>
            </span>
          </button>

          <nav className="flex-1 flex items-center justify-center min-w-0">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-neutral-900 rounded-full p-1 border border-neutral-800 max-w-full">
              <button
                onClick={() => changeView("combattants")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "combattants" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navCombattants}
              </button>
              <button
                onClick={() => changeView("simulateur")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "simulateur" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navSimulateur}
              </button>
              <button
                onClick={() => changeView("media")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "media" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navMedia}
              </button>
            </div>
          </nav>

          {/* Drapeaux : menu déroulant sur mobile, rangée de boutons à partir de sm */}
          <div className="shrink-0">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t.language}
              className="sm:hidden bg-neutral-900 border border-neutral-800 rounded-full text-sm px-2 py-1.5 text-neutral-200 outline-none appearance-none text-center"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag}</option>
              ))}
            </select>
            <div className="hidden sm:flex items-center gap-0.5 bg-neutral-900 rounded-full p-1 border border-neutral-800">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  aria-label={l.label}
                  className={`tap w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                    lang === l.code ? "bg-amber-400/20 ring-1 ring-amber-400/50" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {view === "simulateur" ? (
        <Simulator lang={lang} />
      ) : view === "media" ? (
        <Media lang={lang} />
      ) : view === "mentions" ? (
        <MentionsLegales lang={lang} />
      ) : (
        <>
          <main className="w-full max-w-5xl mx-auto px-5 py-8">
            <div className="flex gap-1.5 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
              <button
                onClick={() => { setCategorie("champions"); setQuery(""); }}
                className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border flex items-center gap-1.5 ${
                  categorie === "champions"
                    ? "bg-amber-400 text-neutral-950 border-amber-400"
                    : "bg-transparent text-amber-400 border-amber-400/40 hover:border-amber-400"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> {t.champions}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategorie(c); setQuery(""); }}
                  className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border ${
                    categorie === c && !searching
                      ? "bg-amber-400 text-neutral-950 border-amber-400"
                      : "bg-transparent text-neutral-400 border-neutral-800 hover:border-amber-400/50 hover:text-neutral-50"
                  }`}
                >
                  {translateCategory(c, lang)}
                </button>
              ))}
            </div>

            {categorie === "champions" && !searching ? (
              <div className="space-y-2">
                {CHAMPIONS.map((c, i) => {
                  const f = allFighters.find((x) => x.nom === c.name);
                  return (
                  <div
                    key={i}
                    style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                    className="row-rise rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 flex items-center gap-4"
                  >
                    {f ? (
                      <FighterAvatar name={c.name} photo={photoOf(f)?.url} size={52} gold />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-amber-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-0.5">{translateCategory(c.categorie, lang)}</div>
                      <div className="disp text-lg truncate">{c.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {t.championSince(formatDate(c.since, lang), c.female)}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{L(c.note, lang)}</div>
                    </div>
                  </div>
                  );
                })}
                <SearchBox query={query} setQuery={setQuery} t={t} className="mt-6" />
              </div>
            ) : (
              <>
                {champion && (
                  <button
                    key={categorie + "-champ"}
                    onClick={() => setSelected(champion)}
                    className="tap row-rise relative overflow-hidden w-full h-56 sm:h-64 text-left mb-6 rounded-2xl border border-amber-400/35 hover:border-amber-400/70 bg-[radial-gradient(circle_at_75%_40%,rgba(251,191,36,0.35),#0a0a0a_65%)]"
                  >
                    {/* Portrait à droite : la photo détourée si on l'a, sinon les initiales en grand */}
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-center">
                      {photoOf(champion) ? (
                        <img src={photoOf(champion).url} alt={champion.nom} className="h-full w-full object-cover object-top [mask-image:linear-gradient(to_right,transparent,black_45%)]" />
                      ) : (
                        <span aria-hidden="true" className="disp text-[7rem] sm:text-[8rem] leading-none text-amber-400/25 self-center">{initialsOf(champion.nom)}</span>
                      )}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                    <div className="relative h-full p-5 sm:p-6 flex flex-col justify-center max-w-[65%]">
                      <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-1.5">
                        {t.champion} · {translateCategory(categorie, lang)}
                      </div>
                      <div className="disp text-3xl sm:text-4xl leading-[1.02]">{champion.nom}</div>
                      <div className="mono text-2xl text-amber-400 mt-3 tracking-tight">
                        {formatRecord(champion.victoires, champion.defaites, champion.nuls, champion.nc)}
                      </div>
                      {champion.ko > 0 && <div className="text-xs text-neutral-400 mt-1">{t.koShare(champion.ko)}</div>}
                    </div>
                  </button>
                )}

                <SearchBox query={query} setQuery={setQuery} t={t} className="mb-6" />

                {!searching && listed.some((f) => f.rang != null) && (
                  <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{t.officialRanking}</p>
                )}
                {searching && fighters.length > 0 && (
                  <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-3">{t.allCategories}</p>
                )}

                <div key={categorie + query} className="space-y-2">
                  {listed.map((f, i) => (
                    <div key={f.id}>
                      {i === firstUnranked && (
                        <p className="text-[11px] uppercase tracking-widest text-neutral-500 pt-4 pb-1">{t.unranked}</p>
                      )}
                      <button
                        onClick={() => setSelected(f)}
                        style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                        className="tap row-rise w-full text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-amber-400/40 px-4 py-2.5 flex items-center gap-3"
                      >
                        <span className={`mono text-sm w-6 shrink-0 ${f.rang === 0 || f.rang === 1 ? "text-amber-400" : "text-neutral-500"}`}>
                          {f.rang === 0 ? "C" : f.rang != null ? f.rang : "–"}
                        </span>
                        <FighterAvatar name={f.nom} photo={photoOf(f)?.url} size={44} gold={f.rang === 0 || f.rang === 1} />
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="font-semibold text-[15px] truncate">{f.nom}</span>
                          <span className="text-xs text-neutral-400 truncate">
                            {searching ? translateCategory(f.categorie, lang) : formatStyle(f.style, lang)}
                          </span>
                        </span>
                        <span className="mono text-sm text-neutral-300 shrink-0">
                          {`${f.victoires}-${f.defaites}-${f.nuls}`}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {fighters.length === 0 && (
                  <p className="text-sm text-neutral-400">{t.noResults(query)}</p>
                )}
              </>
            )}
          </main>

          {selected && <FighterPanel fighter={selected} photo={photoOf(selected)} closing={closing} onClose={closePanel} lang={lang} t={t} />}
        </>
      )}

      <footer className="mt-auto w-full max-w-5xl mx-auto px-5 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-[11px] text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{t.footer}</span>
        <button onClick={() => changeView("mentions")} className="tap underline hover:text-neutral-300">
          {t.legal}
        </button>
        <button onClick={() => setCookiesOpen(true)} className="tap underline hover:text-neutral-300">
          {t.cookies}
        </button>
      </footer>
      {banner}
    </div>
  );
}

function SearchBox({ query, setQuery, t, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors focus-within:border-amber-400/50 ${className}`}>
      <Search className="w-4 h-4 text-neutral-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-500"
      />
    </div>
  );
}

// Fiche combattant : tout vient de notre base vérifiée (fightersData.js). L'API Octagon ne sert
// plus qu'au lieu de naissance et à la salle d'entraînement, quand elle connaît le combattant.
function FighterPanel({ fighter, photo, onClose, closing, lang, t }) {
  const [extra, setExtra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setExtra(null);
    fetch(`/api/fighter/${toSlug(fighter.nom)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) { setExtra(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fighter.nom]);

  const recent = RECENT_FIGHTS[fighter.id];
  const age = ageFrom(fighter.naissance);
  const rankLabel = fighter.rang === 0 ? t.champion : fighter.rang != null ? `#${fighter.rang}` : null;
  const heroRank = fighter.rang === 0 ? t.champion : fighter.rang != null ? `${lang === "fr" ? "N°" : "#"}${fighter.rang}` : null;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 ${closing ? "backdrop-exit" : "backdrop-enter"}`} onClick={onClose}>
      <div
        className={`bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto ${closing ? "sheet-exit" : "sheet-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-80 overflow-hidden bg-neutral-950 flex items-center justify-center">
          <div className="panel-flash absolute inset-0 bg-white z-10 pointer-events-none" />
          {photo ? (
            <img src={photo.url} alt={fighter.nom} className="walkout absolute inset-0 w-full h-full object-cover object-top" />
          ) : (
            <>
              <div className="glow-pulse absolute w-64 h-64 rounded-full bg-amber-400/30 blur-2xl -translate-y-12" />
              <div className="ring-spin absolute w-44 h-44 rounded-full border-2 border-dashed border-amber-400/25 -translate-y-12" />
              <div className="walkout relative w-32 h-32 -translate-y-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                <span className="disp text-5xl text-neutral-950">{initialsOf(fighter.nom)}</span>
              </div>
            </>
          )}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent" />
          <button onClick={onClose} aria-label="Fermer" className="tap absolute top-4 right-4 bg-neutral-950/60 backdrop-blur rounded-full p-1.5 text-neutral-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute left-5 right-5 bottom-4">
            <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
              {[heroRank, translateCategory(fighter.categorie, lang)].filter(Boolean).join(" · ")}
            </div>
            <div className="flex items-center gap-2">
              <span className="disp text-3xl leading-tight">{fighter.nom}</span>
              {getInstagram(fighter.nom) && (
                <a
                  href={`https://instagram.com/${getInstagram(fighter.nom)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="tap w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-400/20 flex items-center justify-center shrink-0"
                  aria-label={t.instagramOf(fighter.nom)}
                >
                  <Instagram className="w-3.5 h-3.5 text-neutral-300" />
                </a>
              )}
            </div>
          </div>
        </div>

        {photo?.page && (
          <a href={photo.page} target="_blank" rel="noopener noreferrer" className="block px-5 pt-2 text-[10px] text-neutral-500 hover:text-neutral-300 truncate">
            {t.photoBy} {creditOf(photo)}
          </a>
        )}
        <div className="p-5 space-y-4">
          <div className="row-rise grid grid-cols-3 gap-2">
            <Tile value={formatRecord(fighter.victoires, fighter.defaites, fighter.nuls, fighter.nc)} label={t.proRecord} gold />
            <Tile value={formatHeight(fighter.taille, lang)} label={t.height} />
            <Tile value={formatHeight(fighter.allonge, lang)} label={t.reach} />
          </div>
          {fighter.victoires > 0 && fighter.ko + fighter.sub + fighter.dec > 0 && (
            <div className="row-rise" style={{ animationDelay: "20ms" }}>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{t.winsBy}</div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-neutral-800">
                <div style={{ width: `${fighter.ko}%` }} className="bg-amber-400" />
                <div style={{ width: `${fighter.sub}%` }} className="bg-amber-700" />
                <div style={{ width: `${fighter.dec}%` }} className="bg-neutral-500" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-neutral-300">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />{translateMethod("KO", lang)} {fighter.ko} %</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-700" />{translateMethod("Soumission", lang)} {fighter.sub} %</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neutral-500" />{translateMethod("Décision", lang)} {fighter.dec} %</span>
              </div>
            </div>
          )}
          <Stat icon={Users} label={t.division} value={translateCategory(fighter.categorie, lang)} delay={40} />
          <Stat icon={Medal} label={t.ranking} value={rankLabel} delay={60} />
          <Stat icon={Swords} label={t.ufcRecord} value={fighter.ufcV != null ? formatRecord(fighter.ufcV, fighter.ufcD, fighter.ufcN, fighter.ufcNc) : null} delay={80} />
          <Stat label={t.style} value={formatStyle(fighter.style, lang)} delay={120} />
          <Stat icon={Cake} label={t.age} value={age != null ? t.years(age) : null} delay={160} />
          <Stat icon={MapPin} label={t.birthplace} value={extra?.placeOfBirth} delay={200} />
          <Stat icon={Dumbbell} label={t.trainsAt} value={extra?.trainsAt} delay={240} />
          {loading && <p className="text-xs text-neutral-500">{t.loading}</p>}

          {recent && (
            <div className="row-rise pt-2" style={{ animationDelay: "280ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs uppercase tracking-widest text-neutral-400">{t.recentFights}</span>
              </div>
              <div className="space-y-2">
                {recent.map((fight, i) => (
                  <div key={i} style={{ animationDelay: `${320 + i * 40}ms` }} className="row-rise flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <span className={`mono text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${RESULT_STYLE[fight.result]}`}>
                      {{ V: t.win, D: t.loss, N: t.draw, NC: t.noContest }[fight.result]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{fight.opponent}</div>
                      <div className="text-[11px] text-neutral-500">{lang === "fr" ? fight.event : fight.event.replace(" : ", ": ")}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border shrink-0 ${METHOD_COLOR[fight.method] || "text-neutral-300 border-neutral-700"}`}>
                      {translateMethod(fight.method, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tile({ value, label, gold = false }) {
  return (
    <div className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2.5 min-w-0">
      <div className={`mono text-base sm:text-lg tracking-tight truncate ${gold ? "text-amber-400" : "text-neutral-100"}`}>{value || "–"}</div>
      <div className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delay = 0 }) {
  if (!value) return null;
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="row-rise flex items-center justify-between gap-4 py-2.5 border-b border-neutral-800 last:border-0">
      <span className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
