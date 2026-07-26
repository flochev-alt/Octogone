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

  const analyser = () => {
    setShowResult(true);
    setAiText(null);
    setAiError(null);
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

      {showResult && fighterA && fighterB && (
        <div key={idA + idB} className="row-rise space-y-5">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="disp text-lg truncate">{fighterA.nom}</span>
              <span className="disp text-lg truncate text-right">{fighterB.nom}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-2xl text-amber-400">{probA}%</span>
              <div className="flex-1 h-2.5 rounded-full bg-neutral-800 overflow-hidden flex">
                <div className="h-full bg-amber-400" style={{ width: `${probA}%` }} />
                <div className="h-full bg-neutral-600" style={{ width: `${probB}%` }} />
              </div>
              <span className="mono text-2xl text-neutral-300">{probB}%</span>
            </div>
            <div className="text-center text-xs text-neutral-500 mt-2">
              {t.probLabel(translateCategory(categorie, lang))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> {t.comparatif}
            </div>
            <StatRow label={t.record2} a={`${fighterA.victoires}-${fighterA.defaites}`} b={`${fighterB.victoires}-${fighterB.defaites}`} />
            <StatRow label={t.strikingAcc} a={pct(fighterA.striking)} b={pct(fighterB.striking)} />
            <StatRow label={t.tdAcc} a={pct(fighterA.tdAcc)} b={pct(fighterB.tdAcc)} />
            <StatRow label={t.tdDef} a={pct(fighterA.tdDef)} b={pct(fighterB.tdDef)} />
            <StatRow label={t.reach} a={formatHeight(fighterA.allonge, lang) ?? "—"} b={formatHeight(fighterB.allonge, lang) ?? "—"} icon={Ruler} />
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

function pct(v) {
  return v == null ? "—" : `${v}%`;
}

function StatRow({ label, a, b }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="mono text-neutral-200 w-20 text-left">{a}</span>
      <span className="text-neutral-500 text-xs flex-1 text-center">{label}</span>
      <span className="mono text-neutral-200 w-20 text-right">{b}</span>
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
