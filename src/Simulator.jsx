import { useState, useMemo, useEffect } from "react";
import { Search, Swords, Sparkles, Ruler, TrendingUp } from "lucide-react";
import { FIGHTERS } from "./fightersData.js";
import { T, translateCategory, formatHeight } from "./i18n.js";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const CATEGORIES = [...new Set(FIGHTERS.map((f) => f.categorie))];

const DAILY_LIMIT = 5;

// Accès illimité pour toi : visite une seule fois octogone.space/?vip=flo-illimite-2026
// sur un appareil, et cet appareil garde l'accès illimité en permanence (stocké localement).
const VIP_CODE = "flo-illimite-2026";
const VIP_KEY = "octogone-vip";

function isVip() {
  return localStorage.getItem(VIP_KEY) === "true";
}

function checkVipUnlock() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("vip") === VIP_CODE) {
    localStorage.setItem(VIP_KEY, "true");
  }
}

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

export default function Simulator({ lang = "fr" }) {
  const t = T[lang];
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const fightersInCategorie = useMemo(
    () => FIGHTERS.filter((f) => f.categorie === categorie),
    [categorie]
  );

  const [idA, setIdA] = useState(fightersInCategorie[0]?.id);
  const [idB, setIdB] = useState(fightersInCategorie[1]?.id);
  const [showResult, setShowResult] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [vip, setVip] = useState(false);

  useEffect(() => {
    checkVipUnlock();
    setVip(isVip());
    setDailyUsage(getDailyUsage());
  }, []);

  useEffect(() => {
    setIdA(fightersInCategorie[0]?.id);
    setIdB(fightersInCategorie[1]?.id ?? fightersInCategorie[0]?.id);
    setShowResult(false);
    setAiText(null);
  }, [categorie]);

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

  const analyser = () => {
    setShowResult(false);
    setAiText(null);
    setAiError(null);
    setClashing(true);
    setTimeout(() => {
      setClashing(false);
      setShowResult(true);
    }, 900);
  };

  const genererAnalyseIA = async () => {
    if (!vip && dailyUsage >= DAILY_LIMIT) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighterA, fighterB, probA, probB }),
      });
      if (!r.ok) throw new Error("failed");
      const data = await r.json();
      setAiText(data.analysis);
      setDailyUsage(incrementDailyUsage());
    } catch (e) {
      setAiError(t.aiUnavailable);
    } finally {
      setAiLoading(false);
    }
  };

  const notEnoughFighters = fightersInCategorie.length < 2;

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <style>{`
        @keyframes clashInLeft {
          0% { transform: translateX(-36px) scale(0.8); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes clashInRight {
          0% { transform: translateX(36px) scale(0.8); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes clashFlashBurst {
          0%, 50% { opacity: 0; transform: scale(0.2); }
          62% { opacity: 0.9; transform: scale(1.6); }
          100% { opacity: 0; transform: scale(2.6); }
        }
        @keyframes clashShakeKf {
          0%, 58% { transform: translateX(0); }
          62% { transform: translateX(-5px); }
          68% { transform: translateX(5px); }
          74% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
          86%, 100% { transform: translateX(0); }
        }
        .clash-in-left { animation: clashInLeft 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .clash-in-right { animation: clashInRight 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .clash-flash { animation: clashFlashBurst 0.9s ease-out forwards; filter: blur(6px); }
        .clash-shake { animation: clashShakeKf 0.9s ease-out both; }
      `}</style>
      <div className="row-rise flex items-center gap-2 mb-6">
        <Swords className="w-4 h-4 text-amber-400" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">{t.simTitle}</span>
      </div>

      <div className="mb-4">
        <label className="block text-[11px] uppercase tracking-widest text-neutral-500 mb-1.5">{t.weightCategory}</label>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100 outline-none focus:border-amber-400/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{translateCategory(c, lang)}</option>
          ))}
        </select>
      </div>

      {notEnoughFighters ? (
        <p className="text-sm text-neutral-400 mb-6">{t.notEnoughFighters}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <FighterPicker label={t.fighter1} fighters={fightersInCategorie} value={idA} onChange={setIdA} exclude={idB} />
            <FighterPicker label={t.fighter2} fighters={fightersInCategorie} value={idB} onChange={setIdB} exclude={idA} />
          </div>

          <button
            onClick={analyser}
            className="tap w-full rounded-xl bg-amber-400 text-neutral-950 font-semibold text-sm py-3.5 mb-6 hover:bg-amber-300"
          >
            {t.analyze}
          </button>
        </>
      )}

      {clashing && fighterA && fighterB && (
        <div className="clash-shake relative h-36 flex items-center justify-center mb-5 px-2 overflow-hidden">
          <div className="clash-flash absolute w-24 h-24 rounded-full bg-amber-300" />
          <div className="clash-in-left flex flex-col items-center gap-1.5 min-w-0 flex-1 max-w-[40%]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <span className="disp text-xl text-neutral-950">{initials(fighterA.nom)}</span>
            </div>
            <span className="text-xs text-neutral-300 font-medium text-center truncate w-full px-1">{fighterA.nom}</span>
          </div>
          <span className="disp text-2xl text-neutral-700 z-10 shrink-0 px-2">VS</span>
          <div className="clash-in-right flex flex-col items-center gap-1.5 min-w-0 flex-1 max-w-[40%]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center shrink-0">
              <span className="disp text-xl text-neutral-100">{initials(fighterB.nom)}</span>
            </div>
            <span className="text-xs text-neutral-300 font-medium text-center truncate w-full px-1">{fighterB.nom}</span>
          </div>
        </div>
      )}

      {showResult && fighterA && fighterB && (
        <div key={idA + idB} className="row-rise space-y-5">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="disp text-lg truncate">{fighterA.nom}</span>
              <span className="disp text-lg truncate text-right">{fighterB.nom}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-2xl text-amber-400"><CountUp value={probA} suffix="%" /></span>
              <div className="flex-1 h-2.5 rounded-full bg-neutral-800 overflow-hidden flex">
                <div className="h-full bg-amber-400" style={{ width: `${probA}%` }} />
                <div className="h-full bg-neutral-600" style={{ width: `${probB}%` }} />
              </div>
              <span className="mono text-2xl text-neutral-300"><CountUp value={probB} suffix="%" /></span>
            </div>
            <div className="text-center text-xs text-neutral-500 mt-2">
              {t.probLabel(translateCategory(categorie, lang))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> {t.comparatif}
            </div>
            <StatRow label={t.record2} a={`${fighterA.victoires}-${fighterA.defaites}`} b={`${fighterB.victoires}-${fighterB.defaites}`} winner={advantages?.winners.winRate} />
            <StatRow label={t.strikingAcc} a={pct(fighterA.striking)} b={pct(fighterB.striking)} winner={advantages?.winners.striking} />
            <StatRow label={t.tdAcc} a={pct(fighterA.tdAcc)} b={pct(fighterB.tdAcc)} winner={advantages?.winners.tdAcc} />
            <StatRow label={t.tdDef} a={pct(fighterA.tdDef)} b={pct(fighterB.tdDef)} winner={advantages?.winners.tdDef} />
            <StatRow label={t.reach} a={formatHeight(fighterA.allonge, lang) ?? "—"} b={formatHeight(fighterB.allonge, lang) ?? "—"} winner={advantages?.winners.reach} />

            {advantages && (
              <div className="flex items-center justify-center gap-3 pt-2 mt-1 border-t border-neutral-800">
                <span className="mono text-lg text-amber-400">{advantages.scoreA}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Avantages</span>
                <span className="mono text-lg text-neutral-300">{advantages.scoreB}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t.expertAnalysis}
            </div>
            {!aiText && !aiError && (vip || dailyUsage < DAILY_LIMIT) && (
              <>
                <button
                  onClick={genererAnalyseIA}
                  disabled={aiLoading}
                  className="tap text-sm px-4 py-2 rounded-lg border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 disabled:opacity-50"
                >
                  {aiLoading ? t.generating : t.generateAI}
                </button>
                <p className="text-[11px] text-neutral-500 mt-2">
                  {vip ? "Accès illimité activé" : t.freeLeft(DAILY_LIMIT - dailyUsage)}
                </p>
              </>
            )}
            {!aiText && !aiError && !vip && dailyUsage >= DAILY_LIMIT && (
              <p className="text-sm text-neutral-400">{t.limitReached(DAILY_LIMIT)}</p>
            )}
            {aiText && <p className="text-sm text-neutral-200 leading-relaxed">{aiText}</p>}
            {aiError && <p className="text-sm text-neutral-400">{aiError}</p>}
          </div>
        </div>
      )}
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

function StatRow({ label, a, b, winner }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`mono w-20 text-left ${winner === "a" ? "text-amber-400 font-semibold" : "text-neutral-200"}`}>
        {a}{winner === "a" && <span className="ml-1">▲</span>}
      </span>
      <span className="text-neutral-500 text-xs flex-1 text-center">{label}</span>
      <span className={`mono w-20 text-right ${winner === "b" ? "text-amber-400 font-semibold" : "text-neutral-200"}`}>
        {winner === "b" && <span className="mr-1">▲</span>}{b}
      </span>
    </div>
  );
}

function FighterPicker({ label, fighters, value, onChange, exclude }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-neutral-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100 outline-none focus:border-amber-400/50"
      >
        {fighters.filter((f) => f.id !== exclude).map((f) => (
          <option key={f.id} value={f.id}>
            {f.nom}
          </option>
        ))}
      </select>
    </div>
  );
}
