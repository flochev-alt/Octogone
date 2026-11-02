import { useMemo } from "react";
import { Vote, Check, X, Clock, ArrowRight, Trophy, Smartphone } from "lucide-react";
import { norm, sameName, cardOf } from "./events.js";
import { useFanVotes, myVotes } from "./useFanVotes.js";
import { recapOf } from "./ResultsPopup.jsx";
import { formatDate, translateMethod } from "./i18n.js";
import { eventName } from "./Media.jsx";

// Page « Mes pronos » : l'historique des pronos faits sur cet appareil (pas de compte),
// événement par événement, avec le score face à l'IA. Les événements à venir montrent les choix en attente.
const DAY = 864e5;
const near = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) <= DAY;
const cap = (s) => s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());

const TEXT = {
  fr: {
    kicker: "Toi contre l'IA", title: "Mes pronos",
    intro: "Tous tes pronos, événement par événement, et ton score face à l'IA.",
    you: "Toi", ai: "L'IA", fans: "Fans", over: (n) => `sur ${n} combat${n > 1 ? "s" : ""}`, rate: (p) => `${p} % de bons pronos`,
    lead: "Tu mènes face à l'IA", tie: "Égalité avec l'IA", behind: "L'IA mène… pour l'instant",
    pending: "En attente des résultats", soon: "Résultats bientôt", past: "Événements passés",
    yourPick: "Ton choix", won: (n, m) => `${n} gagne${m ? ` · ${m}` : ""}`,
    empty: "Tu n'as pas encore fait de prono.",
    emptySub: "Choisis le vainqueur de chaque combat du prochain événement, puis compare-toi à l'IA une fois les résultats tombés.",
    go: "Faire mes pronos", more: "Continuer mes pronos", see: "Voir l'événement",
    noAi: "L'IA n'a pas donné de prono sur ce combat",
    device: "Tes pronos sont gardés sur cet appareil et dans ce navigateur (pas besoin de compte).",
  },
  en: {
    kicker: "You vs the AI", title: "My picks",
    intro: "All your picks, event by event, and your score against the AI.",
    you: "You", ai: "AI", fans: "Fans", over: (n) => `over ${n} fight${n > 1 ? "s" : ""}`, rate: (p) => `${p}% right picks`,
    lead: "You're ahead of the AI", tie: "Tied with the AI", behind: "The AI leads… for now",
    pending: "Waiting for results", soon: "Results coming soon", past: "Past events",
    yourPick: "Your pick", won: (n, m) => `${n} wins${m ? ` · ${m}` : ""}`,
    empty: "You haven't made any picks yet.",
    emptySub: "Pick the winner of each fight of the next event, then compare yourself to the AI once the results are in.",
    go: "Make my picks", more: "Keep picking", see: "See the event",
    noAi: "The AI made no pick on this fight",
    device: "Your picks are saved on this device and in this browser (no account needed).",
  },
  es: {
    kicker: "Tú contra la IA", title: "Mis pronósticos",
    intro: "Todos tus pronósticos, evento por evento, y tu marcador contra la IA.",
    you: "Tú", ai: "IA", fans: "Fans", over: (n) => `en ${n} combate${n > 1 ? "s" : ""}`, rate: (p) => `${p} % de aciertos`,
    lead: "Vas por delante de la IA", tie: "Empate con la IA", behind: "La IA va ganando… por ahora",
    pending: "Esperando resultados", soon: "Resultados pronto", past: "Eventos pasados",
    yourPick: "Tu elección", won: (n, m) => `gana ${n}${m ? ` · ${m}` : ""}`,
    empty: "Todavía no has hecho ningún pronóstico.",
    emptySub: "Elige al ganador de cada combate del próximo evento y compárate con la IA cuando lleguen los resultados.",
    go: "Hacer mis pronósticos", more: "Seguir pronosticando", see: "Ver el evento",
    noAi: "La IA no dio pronóstico en este combate",
    device: "Tus pronósticos se guardan en este dispositivo y en este navegador (sin cuenta).",
  },
};

// Vrai si l'appareil a déjà au moins un prono (pour afficher l'accès « Mes pronos »).
export const hasPronos = () => Object.keys(myVotes()).length > 0;

export default function MyPronos({ lang = "fr", cards = [], upcoming = [], voteEvent = null, onEvent = () => {} }) {
  const tx = TEXT[lang] || TEXT.fr;
  const votes = useFanVotes();
  const mine = useMemo(() => myVotes(), []);
  const date = (iso) => formatDate(iso, lang, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const { past, waiting, total } = useMemo(() => {
    const keys = Object.keys(mine);
    const used = new Set();
    const keyOf = (iso, a, b) => {
      const pair = [norm(a), norm(b)].sort().join("|");
      return keys.find((k) => { const [d, x, y] = k.split("|"); return near(d, iso) && [x, y].sort().join("|") === pair; });
    };
    // Événements passés avec résultats : bilan via recapOf (même calcul que le pop-up « Toi contre l'IA »).
    const past = [...cards]
      .sort((a, b) => b.iso.localeCompare(a.iso))
      .map((c) => {
        const r = recapOf(c, votes, mine);
        if (!r) return null;
        for (const res of c.results || []) {
          const [w, l] = res.fight.split(/\s+def\.\s+/);
          if (l) { const k = keyOf(c.iso, w.trim(), l.trim()); if (k) used.add(k); }
        }
        return r;
      })
      .filter(Boolean);
    // Événements à venir (ou résultats pas encore publiés) : les choix en attente.
    const waiting = [];
    for (const e of upcoming) {
      const picks = cardOf(e)
        .map((f) => { const k = keyOf(e.iso, f.a, f.b); if (!k) return null; used.add(k); return { pick: mine[k], opp: sameName(mine[k], f.a) ? f.b : f.a }; })
        .filter(Boolean);
      if (picks.length) waiting.push({ event: e, picks });
    }
    const orphans = {};
    for (const k of keys) {
      if (used.has(k)) continue;
      const [d, x, y] = k.split("|");
      if (Date.now() - Date.parse(d) > 21 * DAY) continue; // vieux combat absent des résultats : on ne l'affiche plus
      (orphans[d] ||= []).push({ pick: mine[k], opp: cap(sameName(mine[k], x) ? y : x) });
    }
    for (const [d, picks] of Object.entries(orphans)) waiting.push({ iso: d, picks, soon: true });
    const total = past.reduce((s, r) => ({ n: s.n + r.total, me: s.me + r.me, ia: s.ia + r.ia, fans: s.fans + r.fans }), { n: 0, me: 0, ia: 0, fans: 0 });
    return { past, waiting, total };
  }, [cards, upcoming, votes, mine]);

  const empty = !past.length && !waiting.length;
  const pct = total.n ? Math.round((total.me / total.n) * 100) : 0;
  const verdict = total.me > total.ia ? tx.lead : total.me === total.ia ? tx.tie : tx.behind;
  const canVoteMore = voteEvent && !waiting.some((w) => w.event === voteEvent && w.picks.length >= cardOf(voteEvent).length);

  return (
    <main className="w-full max-w-3xl mx-auto px-5 py-8">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
        <Vote className="w-3.5 h-3.5" /> {tx.kicker}
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{tx.title}</h1>
      <p className="text-sm text-neutral-400 mt-2">{tx.intro}</p>

      {empty ? (
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
          <Vote className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="font-semibold mt-3">{tx.empty}</p>
          <p className="text-sm text-neutral-400 mt-1.5 max-w-md mx-auto">{tx.emptySub}</p>
          {voteEvent && (
            <button onClick={() => onEvent(voteEvent, { vote: true })} className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 text-neutral-950 font-bold text-sm px-5 py-3 hover:bg-amber-300">
              {tx.go} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <>
          {total.n > 0 && (
            <section className="mt-6 rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-400/10 to-neutral-900/60 p-5">
              <div className="flex items-center justify-center gap-5 sm:gap-8">
                <Score label={tx.you} value={total.me} lead={total.me > total.ia} />
                <span className="text-neutral-600 text-2xl font-light">–</span>
                <Score label={tx.ai} value={total.ia} lead={total.ia > total.me} />
              </div>
              <p className="text-center text-sm font-semibold text-amber-300 mt-3 flex items-center justify-center gap-1.5">
                {total.me > total.ia && <Trophy className="w-4 h-4" />} {verdict}
              </p>
              <p className="text-center text-xs text-neutral-400 mt-1">
                {tx.over(total.n)} · {tx.rate(pct)} · {tx.fans} {total.fans}/{total.n}
              </p>
            </section>
          )}

          {canVoteMore && (
            <button onClick={() => onEvent(voteEvent, { vote: true })} className="tap group mt-4 w-full text-left rounded-2xl border border-amber-400/30 hover:border-amber-400/60 bg-neutral-900/80 px-4 py-3 flex items-center gap-3">
              <Vote className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="flex-1 min-w-0 text-sm">
                <span className="text-amber-400 font-semibold">{waiting.some((w) => w.event === voteEvent) ? tx.more : tx.go}</span>
                <span className="text-neutral-400"> · {eventName(voteEvent.name, lang)}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-amber-300 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {waiting.length > 0 && (
            <section className="mt-7">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">{tx.pending}</h2>
              <div className="space-y-3">
                {waiting.map((w) => (
                  <EventCard
                    key={w.event ? w.event.name : w.iso}
                    title={w.event ? eventName(w.event.name, lang) : tx.soon}
                    date={date(w.event ? w.event.iso : w.iso)}
                    onOpen={w.event ? () => onEvent(w.event) : null}
                    see={tx.see}
                    badge={<span className="inline-flex items-center gap-1 text-[11px] text-neutral-400"><Clock className="w-3.5 h-3.5" /> {w.picks.length}</span>}
                  >
                    {w.picks.map((p) => (
                      <li key={p.pick + p.opp} className="flex items-center gap-2.5 py-2">
                        <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span className="text-sm min-w-0"><b className="text-neutral-50">{p.pick}</b> <span className="text-neutral-500">vs. {p.opp}</span></span>
                      </li>
                    ))}
                  </EventCard>
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="mt-7">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">{tx.past}</h2>
              <div className="space-y-3">
                {past.map((r) => (
                  <EventCard
                    key={r.card.name + r.card.iso}
                    title={eventName(r.card.name, lang)}
                    date={date(r.card.iso)}
                    onOpen={() => onEvent(r.card)}
                    see={tx.see}
                    badge={
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${r.me > r.ia ? "border-amber-400/60 text-amber-300 bg-amber-400/10" : r.me === r.ia ? "border-neutral-700 text-neutral-300" : "border-neutral-800 text-neutral-500"}`}>
                        {tx.you} {r.me} – {r.ia} {tx.ai}
                      </span>
                    }
                  >
                    {r.fights.map((f) => (
                      <li key={f.pick + f.opp} className="flex items-start gap-2.5 py-2">
                        {f.ok ? <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                        <span className="flex-1 min-w-0 text-sm">
                          <span className="text-neutral-500">{tx.yourPick} : </span>
                          <b className={f.ok ? "text-neutral-50" : "text-neutral-400 line-through decoration-rose-400/60"}>{f.pick}</b>
                          <span className="text-neutral-500"> vs. {f.opp}</span>
                          <span className="block text-[11.5px] text-neutral-500 mt-0.5">{tx.won(f.winner, f.method ? translateMethod(f.method, lang) : "")}</span>
                        </span>
                        <span title={f.iaPick ? `${tx.ai} : ${f.iaPick}` : tx.noAi} className={`shrink-0 max-w-[40%] truncate text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${!f.iaPick ? "border-neutral-800 text-neutral-600" : f.ia ? "border-emerald-500/40 text-emerald-400" : "border-rose-500/30 text-rose-400/80"}`}>
                          {tx.ai} {f.iaPick ? `${f.iaPick.split(" ").slice(1).join(" ") || f.iaPick} ${f.ia ? "✓" : "✗"}` : "–"}
                        </span>
                      </li>
                    ))}
                  </EventCard>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <p className="mt-8 flex items-start gap-2 text-xs text-neutral-500">
        <Smartphone className="w-4 h-4 shrink-0" /> {tx.device}
      </p>
    </main>
  );
}

function Score({ label, value, lead }) {
  return (
    <div className="text-center">
      <div className={`text-4xl sm:text-5xl font-extrabold tabular-nums ${lead ? "text-amber-300" : "text-neutral-100"}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-neutral-400 mt-1">{label}</div>
    </div>
  );
}

function EventCard({ title, date, badge, onOpen, see, children }) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold leading-snug">{title}</h3>
          <p className="text-xs text-neutral-500 mt-0.5 capitalize">{date}</p>
        </div>
        <div className="shrink-0">{badge}</div>
      </div>
      <ul className="mt-2 divide-y divide-neutral-800/80">{children}</ul>
      {onOpen && (
        <button onClick={onOpen} className="tap mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300">
          {see} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </article>
  );
}
