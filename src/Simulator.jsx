import { useState, useMemo, useEffect } from "react";
import { Search, Swords, Sparkles, Ruler, TrendingUp } from "lucide-react";
import { FIGHTERS } from "./fightersData.js";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const CATEGORIES = [...new Set(FIGHTERS.map((f) => f.categorie))];

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

export default function Simulator() {
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

  useEffect(() => {
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
    if (dailyUsage >= DAILY_LIMIT) return;
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
      setAiError(
        "L'analyse IA n'est pas encore activée sur ce site (il manque une clé API Anthropic dans les réglages Vercel)."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const notEnoughFighters = fightersInCategorie.length < 2;

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="row-rise flex items-center gap-2 mb-6">
        <Swords className="w-4 h-4 text-amber-400" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">Simulateur de duel</span>
      </div>

      <div className="mb-4">
        <label className="block text-[11px] uppercase tracking-widest text-neutral-500 mb-1.5">Catégorie de poids</label>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100 outline-none focus:border-amber-400/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {notEnoughFighters ? (
        <p className="text-sm text-neutral-400 mb-6">
          Pas assez de combattants dans cette catégorie pour l'instant — reviens plus tard une fois la base enrichie.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <FighterPicker label="Combattant 1" fighters={fightersInCategorie} value={idA} onChange={setIdA} exclude={idB} />
            <FighterPicker label="Combattant 2" fighters={fightersInCategorie} value={idB} onChange={setIdB} exclude={idA} />
          </div>

          <button
            onClick={analyser}
            className="tap w-full rounded-xl bg-amber-400 text-neutral-950 font-semibold text-sm py-3.5 mb-6 hover:bg-amber-300"
          >
            Analyser le duel
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
              Probabilité de victoire estimée à partir des stats connues — {categorie}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Comparatif
            </div>
            <StatRow label="Bilan" a={`${fighterA.victoires}-${fighterA.defaites}`} b={`${fighterB.victoires}-${fighterB.defaites}`} />
            <StatRow label="Précision striking" a={pct(fighterA.striking)} b={pct(fighterB.striking)} />
            <StatRow label="Précision takedown" a={pct(fighterA.tdAcc)} b={pct(fighterB.tdAcc)} />
            <StatRow label="Défense takedown" a={pct(fighterA.tdDef)} b={pct(fighterB.tdDef)} />
            <StatRow label="Allonge" a={`${fighterA.allonge} cm`} b={`${fighterB.allonge} cm`} icon={Ruler} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Analyse experte
            </div>
            {!aiText && !aiError && dailyUsage < DAILY_LIMIT && (
              <>
                <button
                  onClick={genererAnalyseIA}
                  disabled={aiLoading}
                  className="tap text-sm px-4 py-2 rounded-lg border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 disabled:opacity-50"
                >
                  {aiLoading ? "Génération..." : "Générer une analyse IA"}
                </button>
                <p className="text-[11px] text-neutral-500 mt-2">
                  {DAILY_LIMIT - dailyUsage} analyse{DAILY_LIMIT - dailyUsage > 1 ? "s" : ""} gratuite{DAILY_LIMIT - dailyUsage > 1 ? "s" : ""} restante{DAILY_LIMIT - dailyUsage > 1 ? "s" : ""} aujourd'hui
                </p>
              </>
            )}
            {!aiText && !aiError && dailyUsage >= DAILY_LIMIT && (
              <p className="text-sm text-neutral-400">
                Limite quotidienne atteinte ({DAILY_LIMIT} analyses/jour). Reviens demain pour de nouvelles analyses !
              </p>
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
