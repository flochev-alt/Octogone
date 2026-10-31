import { useEffect, useMemo, useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { norm, sameName, resultSides } from "./events.js";
import { findRow, fanPick } from "./fans.js";
import { useFanVotes, fanVotesReady, myVotes } from "./useFanVotes.js";
import { formatDate, translateMethod } from "./i18n.js";
import { eventName } from "./Media.jsx";

// Pop-up « Toi contre l'IA » : à la première visite après les résultats d'un événement où le visiteur
// a voté (sur cet appareil), son score face à celui de l'IA et des fans. Une seule fois par événement.
const SEEN_KEY = "octogone-pronos-vus";
const DAY = 864e5;
const RECENT_DAYS = 10; // au-delà, on ne ressort plus un vieil événement

const readSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY)) || [];
  } catch {
    return [];
  }
};
const markSeen = (id) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...readSeen().filter((x) => x !== id), id].slice(-30)));
  } catch {}
};
const cardId = (c) => `${c.iso}|${norm(c.name)}`;

// Mon vote pour un combat « gagnant / perdant » : les clés sont « iso|nom1|nom2 » (noms simplifiés, triés),
// avec la date de l'affiche, qui peut différer d'un jour de celle des résultats.
function myPick(mine, iso, winner, loser) {
  const t = Date.parse(iso);
  const pair = [norm(winner), norm(loser)].sort().join("|");
  for (const [cle, pick] of Object.entries(mine)) {
    const [d, a, b] = cle.split("|");
    if (Math.abs(Date.parse(d) - t) <= DAY && [a, b].sort().join("|") === pair) return pick;
  }
  return null;
}

// Bilan d'une carte passée pour ce visiteur, ou null s'il n'y a voté sur aucun combat.
export function recapOf(card, votes, mine) {
  const fights = [];
  for (const r of card.results || []) {
    const s = resultSides(r.fight);
    if (!s?.winner) continue;
    const pick = myPick(mine, card.iso, s.winner, s.loser);
    if (!pick) continue;
    const row = findRow(votes, card.iso, s.winner, s.loser);
    const fans = fanPick(row);
    fights.push({
      pick,
      opp: sameName(pick, s.winner) ? s.loser : s.winner,
      winner: s.winner,
      method: r.method,
      ok: sameName(pick, s.winner),
      ia: row?.ia_favori ? sameName(row.ia_favori, s.winner) : false,
      fans: fans ? sameName(fans, s.winner) : false,
    });
  }
  if (!fights.length) return null;
  const n = (k) => fights.filter((f) => f[k]).length;
  return { card, fights, total: fights.length, me: n("ok"), ia: n("ia"), fans: n("fans") };
}

// Démo pour essayer le pop-up sans attendre un événement : ?pronos=bravo | victoire | nul | perdu
function demoRecap(cards, mode) {
  const card = [...cards].sort((a, b) => b.iso.localeCompare(a.iso))[0];
  if (!card) return null;
  const res = (card.results || []).map((r) => ({ r, s: resultSides(r.fight) })).filter((x) => x.s?.winner).slice(0, 4);
  const right = { bravo: res.length, victoire: Math.max(res.length - 1, 0), nul: Math.max(res.length - 1, 0), perdu: 1 }[mode] ?? res.length;
  const iaRight = { bravo: res.length - 1, victoire: res.length - 2, nul: res.length - 1, perdu: res.length - 1 }[mode] ?? 0;
  const fights = res.map(({ r, s }, i) => {
    const ok = i < right;
    return { pick: ok ? s.winner : s.loser, opp: ok ? s.loser : s.winner, winner: s.winner, method: r.method, ok, ia: i >= res.length - Math.max(iaRight, 0), fans: i % 2 === 0 };
  });
  const n = (k) => fights.filter((f) => f[k]).length;
  return { card, fights, total: fights.length, me: n("ok"), ia: n("ia"), fans: n("fans"), demo: true };
}

const TEXT = {
  fr: {
    you: "Toi", ai: "L'IA", vsAi: "Toi contre l'IA", winner: "Vainqueur", close: "Fermer",
    bravo: "BRAVOOOOO !", victory: "VICTOIRE !", draw: "MATCH NUL !", aiWins: "L'IA L'EMPORTE…",
    subBravo: (n) => `Victoire par sans-faute : ${n} pronos sur ${n}.`,
    subPerfectDraw: (n) => `Sans-faute : ${n} sur ${n}… mais l'IA aussi !`,
    subVictory: (m, n) => `${m} bons pronos sur ${n} : tu bats l'IA !`,
    subDraw: (m) => `${m} partout avec l'IA. La revanche, c'est au prochain event.`,
    subLose: (m, n) => `${m} bon${m > 1 ? "s" : ""} prono${m > 1 ? "s" : ""} sur ${n} cette fois. Prends ta revanche au prochain event !`,
    fans: "Les fans", fansBetter: "tu fais mieux que la moyenne des fans", fansTop: "tu fais partie des meilleurs pronostiqueurs", fansNext: "la prochaine fois sera la bonne",
    wins: (n) => `${n} gagne`, cta: "Défier l'IA au prochain événement", ctaLose: "Prendre ma revanche", next: "Prochain vote",
  },
  en: {
    you: "You", ai: "The AI", vsAi: "You vs the AI", winner: "Winner", close: "Close",
    bravo: "BRAVOOOOO!", victory: "VICTORY!", draw: "DRAW!", aiWins: "THE AI WINS…",
    subBravo: (n) => `Flawless victory: ${n} picks out of ${n}.`,
    subPerfectDraw: (n) => `Flawless: ${n} out of ${n}… but so was the AI!`,
    subVictory: (m, n) => `${m} right picks out of ${n}: you beat the AI!`,
    subDraw: (m) => `${m} each with the AI. Get your rematch at the next event.`,
    subLose: (m, n) => `${m} right pick${m > 1 ? "s" : ""} out of ${n} this time. Get your revenge at the next event!`,
    fans: "The fans", fansBetter: "you beat the fans' average", fansTop: "you're among the best predictors", fansNext: "next time's the one",
    wins: (n) => `${n} wins`, cta: "Take on the AI at the next event", ctaLose: "Get my revenge", next: "Next vote",
  },
  es: {
    you: "Tú", ai: "La IA", vsAi: "Tú contra la IA", winner: "Ganador", close: "Cerrar",
    bravo: "¡BRAVOOOOO!", victory: "¡VICTORIA!", draw: "¡EMPATE!", aiWins: "GANA LA IA…",
    subBravo: (n) => `Victoria perfecta: ${n} pronósticos de ${n}.`,
    subPerfectDraw: (n) => `Perfecto: ${n} de ${n}… ¡pero la IA también!`,
    subVictory: (m, n) => `${m} aciertos de ${n}: ¡le ganas a la IA!`,
    subDraw: (m) => `${m} a ${m} con la IA. La revancha, en el próximo evento.`,
    subLose: (m, n) => `${m} acierto${m > 1 ? "s" : ""} de ${n} esta vez. ¡Toma la revancha en el próximo evento!`,
    fans: "Los fans", fansBetter: "superas la media de los fans", fansTop: "estás entre los mejores pronosticadores", fansNext: "la próxima será la buena",
    wins: (n) => `gana ${n}`, cta: "Desafía a la IA en el próximo evento", ctaLose: "Tomar la revancha", next: "Próxima votación",
  },
};

const lastName = (n) => n.split(" ").slice(1).join(" ") || n;
// Nom court dans les petites cartes (nom de famille), sauf si les deux combattants ont le même.
const short = (n, other) => (lastName(n) === lastName(other) ? n : lastName(n));

export default function ResultsPopup({ cards, lang = "fr", nextEvent = null, onNext = () => {}, paused = false }) {
  const tx = TEXT[lang] || TEXT.fr;
  const votes = useFanVotes();
  const ready = fanVotesReady();
  const [demo] = useState(() => new URLSearchParams(window.location.search).get("pronos"));
  const [open, setOpen] = useState(null);

  const recap = useMemo(() => {
    if (demo) return demoRecap(cards, demo);
    if (!ready) return null;
    const mine = myVotes();
    if (!Object.keys(mine).length) return null;
    const seen = readSeen();
    const now = Date.now();
    return [...cards]
      .filter((c) => now - Date.parse(`${c.iso}T12:00:00Z`) < RECENT_DAYS * DAY && !seen.includes(cardId(c)))
      .sort((a, b) => b.iso.localeCompare(a.iso))
      .map((c) => recapOf(c, votes, mine))
      .find(Boolean) || null;
  }, [cards, votes, ready, demo]);

  // Un court délai : le site s'affiche d'abord, puis le pop-up arrive.
  useEffect(() => {
    if (!recap || open || paused) return;
    const id = setTimeout(() => {
      setOpen(recap);
      if (!recap.demo) markSeen(cardId(recap.card));
    }, 900);
    return () => clearTimeout(id);
  }, [recap, open, paused]);

  const close = () => setOpen((o) => (o ? { ...o, closed: true } : o));
  useEffect(() => {
    if (!open || open.closed) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || open.closed) return null;
  const { card, fights, total, me, ia, fans } = open;
  const perfect = me === total;
  const mode = perfect ? "bravo" : me > ia ? "victory" : me === ia ? "draw" : "lose";
  const title = { bravo: tx.bravo, victory: tx.victory, draw: tx.draw, lose: tx.aiWins }[mode];
  const sub = perfect
    ? ia === total ? tx.subPerfectDraw(total) : tx.subBravo(total)
    : mode === "victory" ? tx.subVictory(me, total) : mode === "draw" ? tx.subDraw(me) : tx.subLose(me, total);
  const fansLine = mode === "lose" ? tx.fansNext : perfect && me > fans ? tx.fansTop : me >= fans ? tx.fansBetter : tx.fansNext;
  const [org, main] = eventName(card.name, lang).split(/\s*:\s*/);
  const [m1, m2] = (main || "").split(/\s+vs\.?\s+/i);
  const date = formatDate(card.iso, lang, { weekday: "short", day: "numeric", month: "short" });
  const nextName = nextEvent ? eventName(nextEvent.name, lang) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${tx.vsAi} · ${card.name}`}
      className={`pr-pop pr-${mode} fixed inset-0 z-[80] overflow-y-auto bg-black/95 backdrop-blur-sm text-neutral-50`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <style>{`
        .pr-pop .disp { font-family: 'Archivo', sans-serif; font-weight: 900; }
        .pr-pop { animation: prFade .35s ease both; }
        @keyframes prFade { from { opacity: 0; } to { opacity: 1; } }
        .pr-beam { position: fixed; top: -10%; width: 60%; height: 120%; pointer-events: none;
          background: conic-gradient(from 180deg at 50% 0%, transparent 165deg, rgba(251,191,36,.18) 180deg, transparent 195deg); }
        .pr-draw .pr-beam { opacity: .45; } .pr-lose .pr-beam { opacity: .25; }
        .pr-box { animation: prRise .55s cubic-bezier(.16,1,.3,1) both; }
        @keyframes prRise { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: none; } }
        .pr-main { background: linear-gradient(180deg,#fff,#d4d4d4); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .pr-side { background: linear-gradient(180deg,#1a1a1a,#0e0e0e); border: 1px solid #262626; }
        .pr-side.lead { border-color: #fbbf24; background: linear-gradient(180deg,rgba(251,191,36,.22),rgba(251,191,36,.04)); box-shadow: 0 0 40px rgba(251,191,36,.25); }
        .pr-side.lead .pr-sc { color: #fbbf24; }
        .pr-side.ai-lead { border-color: #a3a3a3; background: linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.02)); box-shadow: 0 0 30px rgba(255,255,255,.08); }
        .pr-lose .pr-side.me .pr-sc { color: #737373; }
        .pr-belt { background: linear-gradient(90deg,#b45309,#fbbf24,#fde68a,#fbbf24,#b45309); }
        .pr-belt.silver { background: linear-gradient(90deg,#525252,#e5e5e5,#fafafa,#e5e5e5,#525252); }
        .pr-title { font-size: clamp(30px, 9vw, 40px); }
        .pr-bravo .pr-title, .pr-victory .pr-title {
          background: linear-gradient(180deg,#fff7d6 0%,#fde68a 30%,#fbbf24 60%,#b45309 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 18px rgba(251,191,36,.55)) drop-shadow(0 4px 0 rgba(120,53,15,.6));
        }
        .pr-bravo .pr-title { font-size: min(52px, 11.5vw); white-space: nowrap; animation: prPop .7s .25s cubic-bezier(.2,1.6,.4,1) both; transform: rotate(-2deg) skewX(-6deg); }
        @keyframes prPop { from { transform: scale(.4) rotate(-8deg); opacity: 0; } to { transform: rotate(-2deg) skewX(-6deg); opacity: 1; } }
        .pr-lose .pr-title { color: #d4d4d4; }
        .pr-cta { background: linear-gradient(90deg,#f59e0b,#fbbf24,#fde68a); box-shadow: 0 10px 30px rgba(251,191,36,.25); }
        @media (max-height: 500px) {
          .pr-bravo .pr-title { font-size: 40px; } .pr-title { font-size: 30px; }
          .pr-sc { font-size: 40px !important; }
        }
        @media (prefers-reduced-motion: reduce) { .pr-pop, .pr-box, .pr-bravo .pr-title { animation: none; } }
      `}</style>
      <div aria-hidden="true" className="pr-beam -left-[15%] -rotate-[18deg]" />
      <div aria-hidden="true" className="pr-beam -right-[15%] rotate-[18deg]" />
      <svg aria-hidden="true" className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmin] h-[150vmin] opacity-[0.08] pointer-events-none" viewBox="0 0 100 100">
        <polygon points="32,4 68,4 96,32 96,68 68,96 32,96 4,68 4,32" fill="none" stroke="#fbbf24" strokeWidth=".5" />
        <polygon points="35,13 65,13 87,35 87,65 65,87 35,87 13,65 13,35" fill="none" stroke="#fbbf24" strokeWidth=".3" />
      </svg>

      <button
        onClick={close}
        aria-label={tx.close}
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-10 w-10 h-10 rounded-full border border-neutral-700 bg-neutral-950/80 text-neutral-300 hover:text-white flex items-center justify-center"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className="min-h-full flex items-center justify-center pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="pr-box relative w-full max-w-[440px] text-center [@media(max-height:500px)]:max-w-3xl [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:gap-x-6 [@media(max-height:500px)]:items-center">

          <div>
            <div className="text-[11px] tracking-[0.28em] uppercase text-amber-400 font-bold">
              {org}{date && <> · {date}</>}
            </div>
            {main && (
              <div className="pr-main disp uppercase leading-none mt-2 text-[clamp(22px,6.4vw,34px)] [@media(max-height:500px)]:text-[24px] tracking-[-0.01em]">
                {m2 ? <>{m1} <span className="text-amber-400 [-webkit-text-fill-color:#fbbf24] text-[0.6em] align-middle">vs.</span> {m2}</> : main}
              </div>
            )}
            <div className="flex items-center justify-center gap-2.5 mt-3 text-[11px] tracking-[0.3em] uppercase text-neutral-400">
              <i className="block w-9 h-px bg-gradient-to-r from-transparent to-amber-400" />
              {tx.vsAi}
              <i className="block w-9 h-px bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 mt-5">
              <ScoreSide label={tx.you} value={me} total={total} lead={me >= ia} belt={me > ia ? tx.winner : null} className="me" />
              <span className="disp text-lg text-neutral-600">VS</span>
              <ScoreSide label={tx.ai} value={ia} total={total} lead={ia === me} aiLead={ia > me} belt={ia > me ? tx.winner : null} silver />
            </div>

            <h2 className="pr-title disp leading-none mt-6 [@media(max-height:500px)]:mt-4 tracking-[-0.01em]">{title}</h2>
            <p className="text-sm text-neutral-300 mt-2.5">{sub}</p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 mt-5 text-left">
              {fights.map((f, i) => (
                <div key={i} className={`rounded-2xl px-3 py-2.5 bg-neutral-900/90 border min-w-0 ${f.ok ? "border-green-500/35" : "border-red-400/30"}`}>
                  <div className="flex items-center gap-1.5 text-[13px] min-w-0">
                    {f.ok ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0" strokeWidth={3} /> : <X className="w-3.5 h-3.5 text-red-400 shrink-0" strokeWidth={3} />}
                    <b className={`truncate ${f.ok ? "" : "line-through text-neutral-400"}`}>{short(f.pick, f.opp)}</b>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                    vs {short(f.opp, f.pick)} · {f.ok ? translateMethod(f.method, lang) : tx.wins(short(f.winner, f.winner === f.pick ? f.opp : f.pick))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              {tx.fans} : <b className="text-neutral-50">{fans}/{total}</b> · {fansLine}
            </p>
            {nextEvent ? (
              <>
                <button
                  onClick={() => { close(); onNext(nextEvent); }}
                  className="pr-cta tap w-full mt-4 py-3.5 rounded-full text-neutral-950 font-extrabold text-[14.5px] inline-flex items-center justify-center gap-2"
                >
                  {mode === "lose" ? tx.ctaLose : tx.cta} <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11.5px] text-neutral-500 mt-2">
                  {tx.next} : {nextName} · {formatDate(nextEvent.iso, lang, { weekday: "short", day: "numeric", month: "short" })}
                </p>
              </>
            ) : (
              <button onClick={close} className="pr-cta tap w-full mt-4 py-3.5 rounded-full text-neutral-950 font-extrabold text-[14.5px]">
                {tx.close}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreSide({ label, value, total, lead, aiLead, belt, silver, className = "" }) {
  return (
    <div className={`pr-side ${lead ? "lead" : ""} ${aiLead ? "ai-lead" : ""} ${className} relative rounded-[20px] px-2 pt-4 pb-3`}>
      {belt && (
        <span className={`pr-belt ${silver ? "silver" : ""} absolute left-1/2 -top-3 -translate-x-1/2 text-[10px] font-black tracking-[0.18em] uppercase text-stone-900 px-2.5 py-1 rounded-md whitespace-nowrap`}>
          {belt}
        </span>
      )}
      <div className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">{label}</div>
      <div className="pr-sc disp text-[clamp(44px,14vw,58px)] leading-none mt-1.5 tracking-[-0.03em]">
        {value}
        <small className="text-[0.38em] text-neutral-500">/{total}</small>
      </div>
    </div>
  );
}
