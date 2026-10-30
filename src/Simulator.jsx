import { useState, useMemo, useEffect, useRef } from "react";
import { Swords, Sparkles, TrendingUp, ChevronDown, Trophy, Lock, KeyRound, Activity, Film, AlertTriangle, Target, Share2, Download, X } from "lucide-react";
import { useFighters } from "./useFighters.js";
import { T, translateCategory, formatHeight, formatStyle, ageFrom, CATEGORY_ORDER } from "./i18n.js";
import { usePhotos, creditOf } from "./usePhotos.js";
import FighterAvatar from "./FighterAvatar.jsx";
import CategoryBar from "./CategoryBar.jsx";
import { getVipCode } from "./vip.js";
import { RECENT_FIGHTS } from "./recentFights.js";
import { makeShareImage } from "./shareImage.js";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// Champion en premier, puis classés 1 à 15, puis non-classés.
const byRank = (a, b) => (a.rang ?? 99) - (b.rang ?? 99);

const DAILY_LIMIT = 5;

function getDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  const stored = JSON.parse(localStorage.getItem("octogone-ai-usage") || "{}");
  return stored.date === today ? stored.count : 0;
}

function incrementDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  const current = getDailyUsage();
  localStorage.setItem("octogone-ai-usage", JSON.stringify({ date: today, count: current + 1 }));
  return current + 1;
}

function computeScore(f) {
  const winRate = (f.victoires / (f.victoires + f.defaites)) * 100;
  const striking = f.striking ?? 50;
  const tdAcc = f.tdAcc ?? 30;
  const tdDef = f.tdDef ?? 65;
  const finishRate = (f.ko ?? 20) + (f.sub ?? 15);
  return winRate * 0.45 + striking * 0.2 + tdAcc * 0.1 + tdDef * 0.15 + finishRate * 0.1;
}

export default function Simulator({ lang = "fr", vip = false }) {
  const t = T[lang];
  const fighters = useFighters();
  // Toutes les catégories de la base, dans l'ordre du plus léger au plus lourd (puis femmes et légendes).
  const CATEGORIES = useMemo(
    () => CATEGORY_ORDER.filter((c) => fighters.some((f) => f.categorie === c)),
    [fighters]
  );
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  useEffect(() => {
    if (!CATEGORIES.includes(categorie)) setCategorie(CATEGORIES[0]);
  }, [CATEGORIES]);
  const fightersInCategorie = useMemo(
    () => fighters.filter((f) => f.categorie === categorie).sort(byRank),
    [fighters, categorie]
  );

  const [idA, setIdA] = useState(fightersInCategorie[0]?.id);
  const [idB, setIdB] = useState(fightersInCategorie[1]?.id);
  const [showResult, setShowResult] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [dailyUsage, setDailyUsage] = useState(0);

  useEffect(() => {
    setDailyUsage(getDailyUsage());
  }, []);

  useEffect(() => {
    setIdA(fightersInCategorie[0]?.id);
    setIdB(fightersInCategorie[1]?.id ?? fightersInCategorie[0]?.id);
    setShowResult(false);
    setAiText(null);
    setLimitHit(false);
    requestId.current++;
  }, [fightersInCategorie]);

  const fighterA = fightersInCategorie.find((f) => f.id === idA);
  const fighterB = fightersInCategorie.find((f) => f.id === idB);

  const { probA, probB } = useMemo(() => {
    if (!fighterA || !fighterB) return { probA: 50, probB: 50 };
    const scoreA = computeScore(fighterA);
    const scoreB = computeScore(fighterB);
    const total = scoreA + scoreB;
    return {
      probA: Math.round((scoreA / total) * 100),
      probB: Math.round((scoreB / total) * 100),
    };
  }, [fighterA, fighterB]);

  const advantages = useMemo(() => {
    if (!fighterA || !fighterB) return null;
    return computeAdvantages(fighterA, fighterB);
  }, [fighterA, fighterB]);

  const [clashing, setClashing] = useState(false);

  const [limitHit, setLimitHit] = useState(false);
  const requestId = useRef(0);

  // Changer de combattant efface le résultat précédent : il faut relancer l'analyse.
  const pickA = (id) => { setIdA(id); setShowResult(false); setLimitHit(false); requestId.current++; };
  const pickB = (id) => { setIdB(id); setShowResult(false); setLimitHit(false); requestId.current++; };

  // Chaque clic sur « Analyser le duel » compte pour une des analyses du jour (sauf VIP).
  // Une fois la limite atteinte, on n'affiche plus ni stats ni pronostic, seulement le message de limite.
  const analyser = () => {
    setShowResult(false);
    setAiText(null);
    setAiError(null);
    if (!vip && dailyUsage >= DAILY_LIMIT) {
      setLimitHit(true);
      return;
    }
    setLimitHit(false);
    if (!vip) setDailyUsage(incrementDailyUsage());
    setClashing(true);
    setTimeout(() => {
      setClashing(false);
      setShowResult(true);
    }, 900);
    genererAnalyseIA();
  };

  // Les 5 derniers combats donnent à l'IA la forme du moment.
  const withRecent = (f) => ({ ...f, recent: f.recent || RECENT_FIGHTS[f.id] || [] });

  async function genererAnalyseIA() {
    const id = ++requestId.current;
    setAiLoading(true);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vip-code": vip ? getVipCode() || "" : "" },
        body: JSON.stringify({ fighterA: withRecent(fighterA), fighterB: withRecent(fighterB), probA, probB, lang }),
      });
      if (id !== requestId.current) return;
      if (r.status === 429) {
        setDailyUsage(DAILY_LIMIT);
        setShowResult(false);
        setLimitHit(true);
        return;
      }
      if (!r.ok) throw new Error("failed");
      const data = await r.json();
      if (id !== requestId.current) return;
      if (!data.analysis || typeof data.analysis !== "object") throw new Error("empty");
      setAiText(data.analysis);
    } catch (e) {
      if (id === requestId.current) setAiError(t.aiFailed);
    } finally {
      if (id === requestId.current) setAiLoading(false);
    }
  }

  const notEnoughFighters = fightersInCategorie.length < 2;
  const photos = usePhotos();
  const photoOf = (f) => photos[f.nom]?.url;
  const favorite = probA === probB ? null : probA > probB ? fighterA : fighterB;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-8">
      <style>{`
        @keyframes clashInLeft {
          0% { transform: translateX(-60px) scale(0.85); opacity: 0.4; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes clashInRight {
          0% { transform: translateX(60px) scale(0.85); opacity: 0.4; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes clashFlashBurst {
          0%, 45% { opacity: 0; transform: scale(0.2); }
          60% { opacity: 0.9; transform: scale(1.6); }
          100% { opacity: 0; transform: scale(2.8); }
        }
        @keyframes clashShakeKf {
          0%, 55% { transform: translateX(0); }
          60% { transform: translateX(-6px); }
          66% { transform: translateX(6px); }
          72% { transform: translateX(-3px); }
          78% { transform: translateX(3px); }
          84%, 100% { transform: translateX(0); }
        }
        .clash-in-left { animation: clashInLeft 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .clash-in-right { animation: clashInRight 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .clash-flash { animation: clashFlashBurst 0.9s ease-out forwards; filter: blur(8px); }
        .clash-shake { animation: clashShakeKf 0.9s ease-out both; }
        @keyframes confidencePulse { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.35); } }
        .confidence-pulse { animation: confidencePulse 1.6s ease-in-out infinite; }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .bar-grow-l { transform-origin: right; animation: barGrow 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .bar-grow-r { transform-origin: left; animation: barGrow 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes aiShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .ai-shimmer { background: linear-gradient(90deg, #262626 25%, rgba(251,191,36,0.25) 50%, #262626 75%); background-size: 200% 100%; animation: aiShimmer 1.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ai-shimmer { animation: none; } }
      `}</style>

      {/* En-tête */}
      <div className="row-rise text-center mb-6">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-amber-400 mb-2">
          <Swords className="w-3.5 h-3.5" /> {t.simTitle}
        </div>
        <p className="text-sm text-neutral-400">{t.simSubtitle}</p>
      </div>

      {/* Catégories */}
      <CategoryBar active={categorie}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            data-cat={c}
            onClick={() => setCategorie(c)}
            className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border ${
              categorie === c
                ? "bg-amber-400 text-neutral-950 border-amber-400"
                : "bg-transparent text-neutral-400 border-neutral-800 hover:border-amber-400/50 hover:text-neutral-50"
            }`}
          >
            {translateCategory(c, lang)}
          </button>
        ))}
      </CategoryBar>

      {notEnoughFighters ? (
        <p className="text-sm text-neutral-400 mb-6 text-center">{t.notEnoughFighters}</p>
      ) : (
        fighterA && fighterB && (
          <>
            {/* Face-à-face : les deux coins de l'octogone */}
            <div className={`relative grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4 mb-5 ${clashing ? "clash-shake" : ""}`}>
              <FighterCorner side="a" fighter={fighterA} photo={photoOf(fighterA)} fighters={fightersInCategorie} onChange={pickA} exclude={idB} t={t} lang={lang} animate={clashing} />
              <div className="relative flex items-center justify-center w-12 sm:w-20">
                {clashing && <div className="clash-flash absolute w-24 h-24 rounded-full bg-amber-300" />}
                <svg viewBox="0 0 100 100" className="relative w-12 h-12 sm:w-16 sm:h-16" aria-hidden="true">
                  <polygon points="32,6 68,6 94,32 94,68 68,94 32,94 6,68 6,32" fill="#0a0a0a" stroke="#fbbf24" strokeWidth="5" />
                  <text x="50" y="62" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="34" fill="#fbbf24">VS</text>
                </svg>
              </div>
              <FighterCorner side="b" fighter={fighterB} photo={photoOf(fighterB)} fighters={fightersInCategorie} onChange={pickB} exclude={idA} t={t} lang={lang} animate={clashing} />
            </div>
            {/* Crédit des photos libres (auteur · licence), avec lien vers le fichier d'origine. */}
            {[fighterA, fighterB].some((f) => photos[f.nom]?.page) && (
              <div className="-mt-3 mb-4 text-[10px] text-neutral-600 flex flex-wrap justify-center gap-x-3">
                {[fighterA, fighterB].filter((f) => photos[f.nom]?.page).map((f) => (
                  <a key={f.nom} href={photos[f.nom].page} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400">
                    {t.photoBy} {creditOf(photos[f.nom])}
                  </a>
                ))}
              </div>
            )}

            <button
              onClick={analyser}
              disabled={clashing}
              className="tap w-full rounded-2xl bg-amber-400 text-neutral-950 font-semibold text-sm py-4 mb-6 hover:bg-amber-300 flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(251,191,36,0.6)] disabled:opacity-70"
            >
              <Swords className="w-4 h-4" /> {t.analyze}
            </button>

            {/* Face-à-face et résultat, après « Analyser le duel » */}
            {limitHit && (
              <div className="row-rise rounded-2xl border border-amber-400/30 bg-neutral-900 p-6 text-center">
                <Lock className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                <div className="disp text-lg mb-2">{t.limitTitle}</div>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">{t.limitReached(DAILY_LIMIT)}</p>
              </div>
            )}

            {showResult && (
            <div key={idA + idB} className="row-rise space-y-5">
            <ExpertAnalysis analysis={aiText} loading={aiLoading} error={aiError} vip={vip} left={Math.max(0, DAILY_LIMIT - dailyUsage)} fighterA={fighterA} t={t} />
            {!aiLoading && (
              <ShareButton
                t={t}
                data={{
                  fighterA, fighterB, probA, probB, analysis: aiText,
                  photoA: photoOf(fighterA), photoB: photoOf(fighterB),
                  creditA: photos[fighterA.nom] && creditOf(photos[fighterA.nom]), creditB: photos[fighterB.nom] && creditOf(photos[fighterB.nom]),
                  category: translateCategory(categorie, lang),
                  text: { ...t.shareImg, photoBy: t.photoBy, favorite: t.favorite, finish: t.aiFinish, confidence: t.aiConfidence, finishLabels: t.finishLabels, confidenceLabels: t.confidenceLabels },
                }}
              />
            )}
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-4">
                  <TrendingUp className="w-3.5 h-3.5" /> {t.taleOfTape}
                </div>
                <div className="space-y-3">
                  <TapeRow label={t.record2} a={`${fighterA.victoires}-${fighterA.defaites}-${fighterA.nuls}`} b={`${fighterB.victoires}-${fighterB.defaites}-${fighterB.nuls}`} va={winRate(fighterA)} vb={winRate(fighterB)} />
                  <TapeRow label={t.age} a={ageFrom(fighterA.naissance) != null ? t.years(ageFrom(fighterA.naissance)) : "—"} b={ageFrom(fighterB.naissance) != null ? t.years(ageFrom(fighterB.naissance)) : "—"} />
                  <TapeRow label={t.height} a={formatHeight(fighterA.taille, lang) ?? "—"} b={formatHeight(fighterB.taille, lang) ?? "—"} va={fighterA.taille} vb={fighterB.taille} />
                  <TapeRow label={t.reach} a={formatHeight(fighterA.allonge, lang) ?? "—"} b={formatHeight(fighterB.allonge, lang) ?? "—"} va={fighterA.allonge} vb={fighterB.allonge} />
                  <TapeRow label={t.strikingAcc} a={pct(fighterA.striking)} b={pct(fighterB.striking)} va={fighterA.striking} vb={fighterB.striking} />
                  <TapeRow label={t.tdAcc} a={pct(fighterA.tdAcc)} b={pct(fighterB.tdAcc)} va={fighterA.tdAcc} vb={fighterB.tdAcc} />
                  <TapeRow label={t.tdDef} a={pct(fighterA.tdDef)} b={pct(fighterB.tdDef)} va={fighterA.tdDef} vb={fighterB.tdDef} />
                </div>
              </div>

                <div className="space-y-5">
                  <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-neutral-900 p-5">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
                    {favorite && (
                      <div className="relative flex items-center justify-center gap-2 mb-4 text-amber-400">
                        <Trophy className="w-4 h-4" />
                        <span className="disp text-lg">{t.favorite(favorite.nom)}</span>
                      </div>
                    )}
                    <div className="relative flex items-end justify-between mb-2">
                      <span className="mono text-3xl sm:text-4xl text-amber-400"><CountUp value={probA} suffix="%" /></span>
                      <span className="mono text-3xl sm:text-4xl text-neutral-300"><CountUp value={probB} suffix="%" /></span>
                    </div>
                    <div className="relative h-3 rounded-full bg-neutral-800 overflow-hidden flex">
                      <div className={`h-full bg-gradient-to-r from-amber-500 to-amber-300 ${probA > probB ? "confidence-pulse" : ""}`} style={{ width: `${probA}%`, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
                      <div className={`h-full bg-neutral-500 ${probB > probA ? "confidence-pulse" : ""}`} style={{ width: `${probB}%` }} />
                    </div>
                    <div className="relative flex justify-between mt-2 text-xs text-neutral-400">
                      <span className="truncate max-w-[45%]">{fighterA.nom}</span>
                      <span className="truncate max-w-[45%] text-right">{fighterB.nom}</span>
                    </div>
                    {advantages && (
                      <div className="relative flex items-center justify-center gap-3 pt-3 mt-4 border-t border-neutral-800">
                        <span className="mono text-lg text-amber-400">{advantages.scoreA}</span>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500">{t.advantages}</span>
                        <span className="mono text-lg text-neutral-300">{advantages.scoreB}</span>
                      </div>
                    )}
                    <div className="relative text-center text-[11px] text-neutral-500 mt-3">
                      {t.probLabel(translateCategory(categorie, lang))}
                    </div>
                  </div>

                </div>
            </div>
            </div>
            )}
          </>
        )
      )}
    </div>
  );
}

// « Partager mon pronostic » : crée l'image, l'affiche, puis ouvre le menu de partage du téléphone
// (WhatsApp, Insta, X...) ou la télécharge sur ordinateur.
function ShareButton({ data, t }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  useEffect(() => {
    if (!url) return;
    const onKey = (e) => e.key === "Escape" && setUrl(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [url]);

  const create = async () => {
    setBusy(true);
    setError(null);
    try {
      const f = await makeShareImage(data);
      setFile(f);
      setUrl(URL.createObjectURL(f));
      window.gtag?.("event", "share_image_created");
    } catch {
      setError(t.shareFailed);
    } finally {
      setBusy(false);
    }
  };
  const canShare = file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] });
  const share = async () => {
    try {
      await navigator.share({ files: [file], title: "Octogone", text: `${t.shareText(data.fighterA.nom, data.fighterB.nom)} https://octogone.space` });
      window.gtag?.("event", "share", { method: "share_sheet", content_type: "pronostic" });
    } catch {
      // Partage annulé : rien à faire.
    }
  };
  const download = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    window.gtag?.("event", "share", { method: "download", content_type: "pronostic" });
  };

  return (
    <>
      <button
        onClick={create}
        disabled={busy}
        className="tap w-full rounded-2xl border border-amber-400/60 bg-neutral-900 text-amber-300 font-semibold text-sm py-3.5 hover:bg-amber-400/10 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <Share2 className="w-4 h-4" /> {busy ? t.sharePreparing : t.shareMyPick}
      </button>
      {error && <p className="text-xs text-neutral-400 text-center">{error}</p>}
      {url && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.shareMyPick}
          onClick={() => setUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div onClick={(e) => e.stopPropagation()} className="row-rise flex flex-col items-center gap-3 max-h-full w-full max-w-sm">
            <div className="relative min-h-0 max-w-full">
              <img src={url} alt={t.shareMyPick} className="block max-h-[calc(100dvh-9rem)] w-auto max-w-full object-contain rounded-xl border border-neutral-800 shadow-2xl" />
              <button onClick={() => setUrl(null)} aria-label={t.closeAction} className="tap absolute -top-3 -right-3 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex w-full gap-2 shrink-0">
              {canShare && (
                <button onClick={share} className="tap flex-1 rounded-xl bg-amber-400 text-neutral-950 font-semibold text-sm py-3 flex items-center justify-center gap-2 hover:bg-amber-300">
                  <Share2 className="w-4 h-4" /> {t.shareAction}
                </button>
              )}
              <button onClick={download} className={`tap flex-1 rounded-xl font-semibold text-sm py-3 flex items-center justify-center gap-2 ${canShare ? "border border-neutral-700 text-neutral-200 hover:border-amber-400/60" : "bg-amber-400 text-neutral-950 hover:bg-amber-300"}`}>
                <Download className="w-4 h-4" /> {t.downloadAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// L'analyse IA, mise en avant juste sous le bouton : accroche, clés du combat, forme, scénario, piège et verdict.
function ExpertAnalysis({ analysis, loading, error, vip, left, fighterA, t }) {
  const a = analysis && typeof analysis === "object" ? analysis : null;
  const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-400 mb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <div className="text-sm text-neutral-200 leading-relaxed">{children}</div>
    </div>
  );
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/[0.07] to-neutral-900 p-5 sm:p-6 shadow-[0_0_40px_-15px_rgba(251,191,36,0.5)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 mb-4">
        <Sparkles className="w-4 h-4" /> {t.expertAnalysis}
      </div>

      {loading && (
        <div className="space-y-2.5" aria-live="polite">
          <div className="ai-shimmer h-5 rounded-full w-4/5" />
          <div className="ai-shimmer h-3 rounded-full w-full" />
          <div className="ai-shimmer h-3 rounded-full w-11/12" />
          <div className="ai-shimmer h-3 rounded-full w-3/5" />
          <p className="text-[11px] text-neutral-500 pt-1">{t.generating}</p>
        </div>
      )}

      {!loading && error && <p className="text-sm text-neutral-400">{error}</p>}

      {!loading && a && (
        <div className="row-rise space-y-4">
          <p className="disp text-xl sm:text-2xl leading-snug text-neutral-50">{a.accroche}</p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-neutral-950 text-xs font-semibold px-3 py-1.5">
              <Trophy className="w-3.5 h-3.5" /> {t.favorite(a.favori || fighterA.nom)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1.5">
              <Target className="w-3.5 h-3.5" /> {t.aiFinish} : {t.finishLabels[a.tendance] || a.tendance}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 text-neutral-300 text-xs font-semibold px-3 py-1.5">
              {t.aiConfidence} : {t.confidenceLabels[a.confiance] || a.confiance}
            </span>
          </div>

          {a.cles?.length > 0 && (
            <Section icon={KeyRound} title={t.aiKeys}>
              <ol className="space-y-2.5">
                {a.cles.map((k, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mono text-amber-400 shrink-0">{i + 1}</span>
                    <span><span className="font-semibold text-neutral-50">{k.titre}.</span> {k.detail}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Section icon={Activity} title={t.aiForm}>{a.forme}</Section>
            <Section icon={Film} title={t.aiScenario}>{a.scenario}</Section>
          </div>
          <Section icon={AlertTriangle} title={t.aiTrap}>{a.piege}</Section>

          <div className="rounded-xl border border-amber-400/50 bg-amber-400/10 p-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-400 mb-2">
              <Trophy className="w-3.5 h-3.5" /> {t.aiVerdict}
            </div>
            <p className="text-sm sm:text-base text-neutral-50 leading-relaxed font-medium">{a.verdict}</p>
          </div>

          <p className="text-[11px] text-neutral-500">{t.aiDisclaimer}</p>
        </div>
      )}

      {!loading && <p className="text-[11px] text-neutral-500 mt-2">{vip ? t.vipActive : t.freeLeft(left)}</p>}
    </div>
  );
}

function CountUp({ value, suffix = "", duration = 700 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    let frame;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <>{display}{suffix}</>;
}

function winRate(f) {
  const total = f.victoires + f.defaites;
  return total > 0 ? (f.victoires / total) * 100 : 0;
}

// Compare chaque statistique dispo et attribue un point au combattant qui a l'avantage (égalité = pas de point).
function computeAdvantages(fighterA, fighterB) {
  const categories = [
    { key: "winRate", a: winRate(fighterA), b: winRate(fighterB) },
    { key: "striking", a: fighterA.striking, b: fighterB.striking },
    { key: "tdAcc", a: fighterA.tdAcc, b: fighterB.tdAcc },
    { key: "tdDef", a: fighterA.tdDef, b: fighterB.tdDef },
    { key: "reach", a: fighterA.allonge, b: fighterB.allonge },
  ];
  let scoreA = 0;
  let scoreB = 0;
  const winners = {};
  categories.forEach((c) => {
    if (c.a == null || c.b == null) { winners[c.key] = null; return; }
    if (c.a > c.b) { winners[c.key] = "a"; scoreA++; }
    else if (c.b > c.a) { winners[c.key] = "b"; scoreB++; }
    else { winners[c.key] = null; }
  });
  return { winners, scoreA, scoreB };
}

function pct(v) {
  return v == null ? "—" : `${v}%`;
}

// Ligne du face-à-face : valeur A, barres opposées (la plus forte en doré), valeur B.
function TapeRow({ label, a, b, va = null, vb = null }) {
  const both = va != null && vb != null && va + vb > 0;
  const max = both ? Math.max(va, vb) : 1;
  const wa = both ? (va / max) * 100 : 0;
  const wb = both ? (vb / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className={`mono ${both && va > vb ? "text-amber-400 font-semibold" : "text-neutral-200"}`}>{a}</span>
        <span className="text-[11px] text-neutral-500 text-center px-2">{label}</span>
        <span className={`mono text-right ${both && vb > va ? "text-amber-400 font-semibold" : "text-neutral-200"}`}>{b}</span>
      </div>
      {both && (
        <div className="flex gap-1 h-1.5">
          <div className="flex-1 flex justify-end rounded-full bg-neutral-800 overflow-hidden">
            <div className={`bar-grow-l h-full rounded-full ${va >= vb ? "bg-amber-400" : "bg-neutral-500"}`} style={{ width: `${wa}%` }} />
          </div>
          <div className="flex-1 rounded-full bg-neutral-800 overflow-hidden">
            <div className={`bar-grow-r h-full rounded-full ${vb >= va ? "bg-amber-400" : "bg-neutral-500"}`} style={{ width: `${wb}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Coin d'un combattant : portrait, nom, bilan, et la liste déroulante (invisible, posée sur la carte) pour en changer.
function FighterCorner({ side, fighter, photo, fighters, onChange, exclude, t, lang, animate }) {
  const gold = side === "a";
  const rank = fighter.rang === 0 ? t.champion : fighter.rang != null ? `#${fighter.rang}` : null;
  return (
    <label
      className={`${animate ? (gold ? "clash-in-left" : "clash-in-right") : ""} tap relative min-w-0 cursor-pointer rounded-2xl border ${
        gold ? "border-amber-400/40 bg-gradient-to-b from-amber-400/10 to-neutral-900" : "border-neutral-700 bg-gradient-to-b from-neutral-700/20 to-neutral-900"
      } p-3 sm:p-5 flex flex-col items-center text-center hover:border-amber-400/70`}
    >
      <span className={`text-[10px] uppercase tracking-widest mb-2 ${gold ? "text-amber-400" : "text-neutral-400"}`}>
        {gold ? t.fighter1 : t.fighter2}
      </span>
      <FighterAvatar name={fighter.nom} photo={photo} size={88} gold={gold} className="mb-3 sm:hidden" />
      <FighterAvatar name={fighter.nom} photo={photo} size={120} gold={gold} className="mb-3 hidden sm:flex" />
      <span className="disp text-base sm:text-2xl leading-tight break-words w-full">{fighter.nom}</span>
      <span className="mono text-xs sm:text-sm text-neutral-300 mt-1">
        {fighter.victoires}-{fighter.defaites}-{fighter.nuls}
      </span>
      <span className="text-[11px] text-neutral-500 mt-0.5 truncate w-full">
        {[rank, formatStyle(fighter.style, lang).split(" · ")[0]].filter(Boolean).join(" · ")}
      </span>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-300 border border-neutral-700 rounded-full px-2.5 py-1">
        {t.changeFighter} <ChevronDown className="w-3 h-3" />
      </span>
      <select
        value={fighter.id}
        onChange={(e) => onChange(e.target.value)}
        aria-label={gold ? t.fighter1 : t.fighter2}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {fighters.filter((f) => f.id !== exclude).map((f) => (
          <option key={f.id} value={f.id}>
            {f.rang === 0 ? "C · " : f.rang != null ? `#${f.rang} · ` : ""}{f.nom}
          </option>
        ))}
      </select>
    </label>
  );
}
