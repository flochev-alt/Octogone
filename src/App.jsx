import { useState, useEffect, useMemo } from "react";
import { Search, X, ChevronRight, Trophy, MapPin, Ruler, Users, Swords, Instagram } from "lucide-react";
import Simulator from "./Simulator.jsx";
import Landing from "./Landing.jsx";
import Media from "./Media.jsx";
import { LANGUAGES, T, translateDivision, formatHeight, getInitialLang, setStoredLang } from "./i18n.js";

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

const DIVISIONS = [
  "flyweight", "bantamweight", "featherweight", "lightweight",
  "welterweight", "middleweight", "light-heavyweight", "heavyweight",
  "women-strawweight", "women-flyweight", "women-bantamweight", "women-featherweight",
];

const label = (slug) =>
  slug.replace("women-", "F. ").replace("-", " ").replace(/^\w/, (c) => c.toUpperCase());

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const RECENT_FIGHTS = {
  "islam-makhachev": [
    { opponent: "Jack Della Maddalena", result: "V", method: "Décision unanime", event: "UFC 322" },
    { opponent: "Renato Moicano", result: "V", method: "Soumission", event: "UFC 311" },
    { opponent: "Dustin Poirier", result: "V", method: "Soumission", event: "UFC 302" },
    { opponent: "Alexander Volkanovski", result: "V", method: "KO", event: "UFC 294" },
    { opponent: "Alexander Volkanovski", result: "V", method: "Décision unanime", event: "UFC 284" },
  ],
  "jon-jones": [
    { opponent: "Stipe Miocic", result: "V", method: "TKO", event: "UFC 309" },
    { opponent: "Ciryl Gane", result: "V", method: "Soumission", event: "UFC 285" },
    { opponent: "Dominick Reyes", result: "V", method: "Décision unanime", event: "UFC 247" },
    { opponent: "Thiago Santos", result: "V", method: "Décision", event: "UFC 239" },
    { opponent: "Anthony Smith", result: "V", method: "Décision unanime", event: "UFC 235" },
  ],
};

const METHOD_COLOR = {
  "KO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "TKO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Soumission": "text-sky-400 border-sky-400/30 bg-sky-400/10",
  "Décision": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision unanime": "text-neutral-300 border-neutral-700 bg-neutral-800",
};

export default function App() {
  const [view, setView] = useState("landing");
  const [lang, setLangState] = useState("fr");
  const t = T[lang];

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = (l) => {
    setLangState(l);
    setStoredLang(l);
  };

  const [rankings, setRankings] = useState(null);
  const [division, setDivision] = useState("lightweight");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (view !== "combattants") return;
    setLoading(true);
    setError(null);
    fetch(`/api/division/${division}`)
      .then((r) => { if (!r.ok) throw new Error("indisponible"); return r.json(); })
      .then((data) => { setRankings(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [division, view]);

  const fighters = useMemo(() => {
    if (!rankings?.fighters) return [];
    if (!query) return rankings.fighters;
    return rankings.fighters.filter((f) => f.name?.toLowerCase().includes(query.toLowerCase()));
  }, [rankings, query]);

  // Si la recherche ne donne rien dans la catégorie actuelle, on cherche
  // le combattant dans les autres catégories et on bascule automatiquement dessus.
  useEffect(() => {
    if (view !== "combattants") return;
    if (loading) return;
    if (!query || query.trim().length < 3) return;
    if (fighters.length > 0) return;

    let cancelled = false;
    const searchOtherDivisions = async () => {
      setRedirecting(true);
      for (const d of DIVISIONS) {
        if (d === division || cancelled) continue;
        try {
          const r = await fetch(`/api/division/${d}`);
          if (!r.ok) continue;
          const data = await r.json();
          const match = data.fighters?.find((f) =>
            f.name?.toLowerCase().includes(query.toLowerCase())
          );
          if (match && !cancelled) {
            setDivision(d);
            break;
          }
        } catch (e) {
          // on ignore et on passe à la catégorie suivante
        }
      }
      if (!cancelled) setRedirecting(false);
    };
    searchOtherDivisions();
    return () => { cancelled = true; };
  }, [query, fighters.length, division, loading, view]);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => { setSelected(null); setClosing(false); }, 260);
  };

  if (view === "landing") {
    return <Landing onEnter={() => setView("combattants")} onEnterMedia={() => setView("media")} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        .row-rise { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .sheet-enter { animation: sheetIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sheet-exit { animation: sheetOut 0.26s cubic-bezier(0.4, 0, 1, 1) forwards; }
        .backdrop-enter { animation: backdropIn 0.3s ease forwards; }
        .backdrop-exit { animation: backdropOut 0.26s ease forwards; }
        .walkout { animation: walkoutIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .ring-spin { animation: ringSpin 12s linear infinite; }
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
      `}</style>

      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
          <button onClick={() => setView("landing")} className="tap flex items-center gap-2.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="disp text-lg tracking-tight">OCTOGONE<span className="text-amber-400">.</span></span>
          </button>

          <nav className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1 border border-neutral-800">
              <button
                onClick={() => setView("combattants")}
                className={`tap text-xs font-semibold px-3.5 py-1.5 rounded-full ${
                  view === "combattants" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navCombattants}
              </button>
              <button
                onClick={() => setView("simulateur")}
                className={`tap text-xs font-semibold px-3.5 py-1.5 rounded-full ${
                  view === "simulateur" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navSimulateur}
              </button>
              <button
                onClick={() => setView("media")}
                className={`tap text-xs font-semibold px-3.5 py-1.5 rounded-full ${
                  view === "media" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navMedia}
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-0.5 bg-neutral-900 rounded-full p-1 border border-neutral-800 shrink-0">
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
      </header>

      {view === "simulateur" ? (
        <Simulator lang={lang} />
      ) : view === "media" ? (
        <Media />
      ) : (
        <>
          <main className="max-w-5xl mx-auto px-5 py-8">
            <div className="flex gap-1.5 overflow-x-auto pb-4 mb-6 -mx-1 px-1">
              {DIVISIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDivision(d); setQuery(""); }}
                  className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border ${
                    division === d
                      ? "bg-amber-400 text-neutral-950 border-amber-400"
                      : "bg-transparent text-neutral-400 border-neutral-800 hover:border-amber-400/50 hover:text-neutral-50"
                  }`}
                >
                  {translateDivision(d, lang)}
                </button>
              ))}
            </div>

            {rankings?.champion && (
              <div key={division + "-champ"} className="row-rise mb-6 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-0.5">{t.champion} — {translateDivision(division, lang)}</div>
                  <div className="disp text-xl truncate">{rankings.champion.championName}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 mb-6 transition-colors focus-within:border-amber-400/50">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-500"
              />
            </div>

            {loading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-neutral-900 animate-pulse" />)}
              </div>
            )}
            {error && <p className="text-sm text-amber-400">{t.categoryUnavailable}</p>}

            <div key={division + query} className="space-y-2">
              {fighters.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                  className="tap row-rise w-full text-left rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-amber-400/40 px-4 py-3.5 flex items-center gap-4"
                >
                  <span className="mono text-xs text-neutral-500 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-medium text-sm truncate">{f.name}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>
              ))}
            </div>

            {redirecting && (
              <p className="text-sm text-amber-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {t.searchingOtherCategories}
              </p>
            )}

            {!loading && !error && !redirecting && fighters.length === 0 && (
              <p className="text-sm text-neutral-400">{t.noResults(query)}</p>
            )}
          </main>

          {selected && <FighterPanel fighter={selected} closing={closing} onClose={closePanel} lang={lang} t={t} />}
        </>
      )}

      <footer className="max-w-5xl mx-auto px-5 py-10 text-[11px] text-neutral-500">
        {t.footer}
      </footer>
    </div>
  );
}

function FighterPanel({ fighter, onClose, closing, lang, t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/fighter/${fighter.id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [fighter.id]);

  const recent = RECENT_FIGHTS[fighter.id];

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 ${closing ? "backdrop-exit" : "backdrop-enter"}`} onClick={onClose}>
      <div
        className={`bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto ${closing ? "sheet-exit" : "sheet-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 overflow-hidden bg-neutral-950 flex items-center justify-center">
          <div className="glow-pulse absolute w-56 h-56 rounded-full bg-amber-400/30 blur-2xl" />
          <div className="ring-spin absolute w-40 h-40 rounded-full border-2 border-dashed border-amber-400/25" />
          <div className="walkout relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
            <span className="disp text-4xl text-neutral-950">{initials(fighter.name)}</span>
          </div>
          <button onClick={onClose} className="tap absolute top-4 right-4 bg-neutral-950/60 backdrop-blur rounded-full p-1.5 text-neutral-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pt-4 flex items-center gap-2">
          <span className="disp text-xl">{fighter.name}</span>
          {getInstagram(fighter.name) && (
            <a
              href={`https://instagram.com/${getInstagram(fighter.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="tap w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-400/20 flex items-center justify-center shrink-0"
              aria-label={`Instagram de ${fighter.name}`}
            >
              <Instagram className="w-3.5 h-3.5 text-neutral-300" />
            </a>
          )}
        </div>

        <div className="p-5 space-y-4">
          {loading && <p className="text-sm text-neutral-400">Chargement…</p>}
          {data && (
            <>
              {(data.wins || data.losses) && (
                <div className="row-rise text-center py-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="mono text-2xl text-amber-400 tracking-tight">{data.wins}-{data.losses}-{data.draws}</div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{t.record}</div>
                </div>
              )}
              <Stat icon={Users} label={t.division} value={data.category} delay={40} />
              <Stat icon={Ruler} label={`${t.heightReach} (in)`} value={[data.height, data.reach].filter(Boolean).join(" / ")} delay={80} />
              <Stat icon={MapPin} label={t.birthplace} value={data.placeOfBirth} delay={120} />
              <Stat label={t.trainsAt} value={data.trainsAt} delay={160} />
              <Stat label={t.style} value={data.fightingStyle} delay={200} />
              <Stat label={t.age} value={data.age} delay={240} />

              {recent && (
                <div className="row-rise pt-2" style={{ animationDelay: "280ms" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Swords className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-xs uppercase tracking-widest text-neutral-400">{t.recentFights}</span>
                  </div>
                  <div className="space-y-2">
                    {recent.map((fight, i) => (
                      <div key={i} style={{ animationDelay: `${320 + i * 40}ms` }} className="row-rise flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                        <span className={`mono text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          fight.result === "V" ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400"
                        }`}>
                          {fight.result}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{fight.opponent}</div>
                          <div className="text-[11px] text-neutral-500">{fight.event}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border shrink-0 ${METHOD_COLOR[fight.method] || "text-neutral-300 border-neutral-700"}`}>
                          {fight.method}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delay = 0 }) {
  if (!value) return null;
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="row-rise flex items-center justify-between py-2.5 border-b border-neutral-800 last:border-0">
      <span className="flex items-center gap-2 text-xs text-neutral-400">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
