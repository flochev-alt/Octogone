import { useMemo } from "react";
import { Calculator, ChevronDown, Target } from "lucide-react";
import { formatDate } from "./i18n.js";
import { computeParts, WEIGHTS } from "./score.js";
import { verdictOf } from "./fans.js";
import { useFanVotes } from "./useFanVotes.js";

// Transparence (audit nov. 2026) : comment le pourcentage du Simulateur est calculé,
// et le bilan public des pronostics de l'IA sur les combats déjà terminés.
const TEXT = {
  fr: {
    how: "Comment on calcule ?",
    intro: "Le pourcentage vient uniquement des stats de la fiche de chaque combattant. Chaque critère a un poids, on additionne, puis on compare les deux totaux.",
    crit: { winRate: "Taux de victoires", striking: "Précision de frappe", tdDef: "Défense de lutte", tdAcc: "Précision de lutte", finish: "Taux de finitions (KO + soumissions)" },
    weight: "Poids",
    total: "Score",
    missing: "Stat manquante : on prend une valeur moyenne.",
    limits: "C'est une estimation, pas une certitude : le style, la forme du moment, les blessures ou le changement de catégorie ne sont pas dans ce calcul. L'analyse de l'IA, elle, en tient compte et peut donc donner un autre favori.",
    sources: "Stats croisées sur au moins 2 sources (UFC, Tapology, Wikipédia…), mises à jour après chaque événement.",
    record: "Bilan public de l'IA",
    good: "de bons pronos",
    recordLine: (r, n) => `${r} sur ${n} combat${n > 1 ? "s" : ""} terminé${n > 1 ? "s" : ""}`,
    since: (d) => `depuis le ${d}`,
    none: "Le bilan démarre au premier événement terminé : chaque prono de l'IA est figé avant le combat, puis comparé au résultat.",
    frozen: "Prono figé avant le combat, jamais modifié après.",
  },
  en: {
    how: "How is it calculated?",
    intro: "The percentage comes only from each fighter's profile stats. Each criterion has a weight, we add them up, then compare the two totals.",
    crit: { winRate: "Win rate", striking: "Striking accuracy", tdDef: "Takedown defense", tdAcc: "Takedown accuracy", finish: "Finish rate (KO + submissions)" },
    weight: "Weight",
    total: "Score",
    missing: "Missing stat: an average value is used.",
    limits: "It's an estimate, not a certainty: style, current form, injuries or a weight-class change are not in this formula. The AI analysis does take them into account, so it can pick a different favorite.",
    sources: "Stats cross-checked on at least 2 sources (UFC, Tapology, Wikipedia…), updated after every event.",
    record: "AI public track record",
    good: "correct picks",
    recordLine: (r, n) => `${r} out of ${n} finished fight${n > 1 ? "s" : ""}`,
    since: (d) => `since ${d}`,
    none: "The record starts with the first finished event: every AI pick is locked before the fight, then compared to the result.",
    frozen: "Pick locked before the fight, never changed afterwards.",
  },
  es: {
    how: "¿Cómo se calcula?",
    intro: "El porcentaje sale solo de las stats de la ficha de cada peleador. Cada criterio tiene un peso, se suman y luego se comparan los dos totales.",
    crit: { winRate: "Porcentaje de victorias", striking: "Precisión de golpeo", tdDef: "Defensa de derribos", tdAcc: "Precisión de derribos", finish: "Porcentaje de finalizaciones (KO + sumisiones)" },
    weight: "Peso",
    total: "Puntuación",
    missing: "Stat que falta: se usa un valor medio.",
    limits: "Es una estimación, no una certeza: el estilo, la forma del momento, las lesiones o un cambio de categoría no entran en este cálculo. El análisis de la IA sí los tiene en cuenta, así que puede elegir otro favorito.",
    sources: "Stats contrastadas en al menos 2 fuentes (UFC, Tapology, Wikipedia…), actualizadas tras cada evento.",
    record: "Balance público de la IA",
    good: "de aciertos",
    recordLine: (r, n) => `${r} de ${n} combate${n > 1 ? "s" : ""} terminado${n > 1 ? "s" : ""}`,
    since: (d) => `desde el ${d}`,
    none: "El balance empieza con el primer evento terminado: cada pronóstico de la IA se fija antes del combate y luego se compara con el resultado.",
    frozen: "Pronóstico fijado antes del combate, nunca cambiado después.",
  },
};

const num = (v) => (v == null || Number.isNaN(v) ? "—" : `${Math.round(v)}%`);

export function HowWeCalc({ fighterA, fighterB, lang = "fr" }) {
  const tx = TEXT[lang] || TEXT.fr;
  const pa = computeParts(fighterA), pb = computeParts(fighterB);
  const anyMissing = pa.missing || pb.missing;
  return (
    <details className="group relative mt-4 border-t border-neutral-800 pt-3">
      <summary className="tap list-none cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 [&::-webkit-details-marker]:hidden">
        <Calculator className="w-3.5 h-3.5" /> {tx.how}
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 text-left text-xs text-neutral-400 space-y-3">
        <p>{tx.intro}</p>
        <table className="w-full text-[11px] sm:text-xs">
          <thead>
            <tr className="text-neutral-500">
              <th className="text-left font-normal pb-1.5" />
              <th className="font-normal pb-1.5 px-1">{tx.weight}</th>
              <th className="font-semibold pb-1.5 px-1 text-amber-400 truncate max-w-[5rem]">{fighterA.nom.split(" ").at(-1)}</th>
              <th className="font-semibold pb-1.5 pl-1 text-neutral-300 truncate max-w-[5rem]">{fighterB.nom.split(" ").at(-1)}</th>
            </tr>
          </thead>
          <tbody>
            {WEIGHTS.map(({ key, w }) => (
              <tr key={key} className="border-t border-neutral-800/70">
                <td className="py-1.5 pr-1 text-neutral-300">{tx.crit[key]}</td>
                <td className="py-1.5 px-1 text-center mono text-neutral-500">{Math.round(w * 100)}%</td>
                <td className={`py-1.5 px-1 text-center mono ${pa.values[key] > pb.values[key] ? "text-amber-300" : ""}`}>{num(pa.values[key])}</td>
                <td className={`py-1.5 pl-1 text-center mono ${pb.values[key] > pa.values[key] ? "text-neutral-100" : ""}`}>{num(pb.values[key])}</td>
              </tr>
            ))}
            <tr className="border-t border-neutral-700">
              <td className="py-1.5 pr-1 font-semibold text-neutral-200">{tx.total}</td>
              <td />
              <td className="py-1.5 px-1 text-center mono font-semibold text-amber-300">{pa.total.toFixed(1)}</td>
              <td className="py-1.5 pl-1 text-center mono font-semibold text-neutral-100">{pb.total.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
        {anyMissing && <p className="text-[11px] text-neutral-500">{tx.missing}</p>}
        <p>{tx.limits}</p>
        <p className="text-[11px] text-neutral-500">{tx.sources}</p>
      </div>
    </details>
  );
}

// Bilan de l'IA : ses pronos figés (fan_combats.ia_favori) comparés aux résultats des cartes passées.
export function aiRecordOf(rows, cards) {
  let right = 0, total = 0, first = null;
  for (const c of cards) {
    for (const r of c.results || []) {
      const v = verdictOf(rows, c.iso, r.fight);
      if (!v || v.ia === null) continue;
      total++;
      if (v.ia) right++;
      if (!first || c.iso < first) first = c.iso;
    }
  }
  return { right, total, pct: total ? Math.round((right / total) * 100) : 0, since: first };
}

export function AiRecord({ cards = [], lang = "fr", className = "" }) {
  const tx = TEXT[lang] || TEXT.fr;
  const rows = useFanVotes();
  const rec = useMemo(() => aiRecordOf(rows, cards), [rows, cards]);
  return (
    <div className={`rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3 flex items-start gap-3 ${className}`}>
      <span className="w-8 h-8 shrink-0 rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center">
        <Target className="w-4 h-4 text-amber-400" />
      </span>
      <div className="min-w-0 text-sm leading-snug">
        <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">{tx.record}</div>
        {rec.total ? (
          <>
            <div className="text-neutral-200 mt-0.5">
              <span className="text-lg text-amber-300 font-extrabold">{rec.pct}%</span> {tx.good} · {tx.recordLine(rec.right, rec.total)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{tx.since(formatDate(rec.since, lang))}. {tx.frozen}</div>
          </>
        ) : (
          <div className="text-xs text-neutral-400 mt-0.5">{tx.none}</div>
        )}
      </div>
    </div>
  );
}
