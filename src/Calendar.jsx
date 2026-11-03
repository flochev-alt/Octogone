import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Vote, ArrowRight, Trophy } from "lucide-react";
import { L, formatDate, translateMethod } from "./i18n.js";
import { eventName } from "./events.js";
import { eventSlug, resultSides } from "./events.js";
import { AiRecord } from "./Transparency.jsx";

// Page « Calendrier » (/evenements) : tous les événements à venir, puis les résultats des cartes passées,
// mois par mois. Chaque carte ouvre la page de l'événement.
const TEXT = {
  fr: {
    kicker: "Calendrier", title: "Événements MMA", intro: "Les prochaines cartes et les derniers résultats, mois par mois.",
    upcoming: "À venir", results: "Résultats", next: "Prochain", vote: "Votes ouverts", today: "Aujourd'hui", tomorrow: "Demain",
    inDays: (n) => `Dans ${n} jours`, empty: "Aucun événement annoncé pour l'instant.", emptyPast: "Pas encore de résultats.",
    see: "Voir l'événement", won: (w, l, m) => `${w} bat ${l}${m ? ` · ${m}` : ""}`,
  },
  en: {
    kicker: "Calendar", title: "MMA events", intro: "Upcoming cards and the latest results, month by month.",
    upcoming: "Upcoming", results: "Results", next: "Next", vote: "Voting open", today: "Today", tomorrow: "Tomorrow",
    inDays: (n) => `In ${n} days`, empty: "No event announced yet.", emptyPast: "No results yet.",
    see: "See the event", won: (w, l, m) => `${w} def. ${l}${m ? ` · ${m}` : ""}`,
  },
  es: {
    kicker: "Calendario", title: "Eventos de MMA", intro: "Las próximas carteleras y los últimos resultados, mes a mes.",
    upcoming: "Próximos", results: "Resultados", next: "Próximo", vote: "Votación abierta", today: "Hoy", tomorrow: "Mañana",
    inDays: (n) => `En ${n} días`, empty: "Todavía no hay eventos anunciados.", emptyPast: "Todavía no hay resultados.",
    see: "Ver el evento", won: (w, l, m) => `${w} vence a ${l}${m ? ` · ${m}` : ""}`,
  },
};

const DAY = 864e5;
const monthKey = (iso) => iso.slice(0, 7);

export default function Calendar({ lang = "fr", upcoming = [], past = [], voteEvent = null, onEvent = () => {} }) {
  const tx = TEXT[lang] || TEXT.fr;
  const [tab, setTab] = useState("upcoming");
  const list = useMemo(
    () => (tab === "upcoming" ? [...upcoming].sort((a, b) => a.iso.localeCompare(b.iso)) : [...past].sort((a, b) => b.iso.localeCompare(a.iso))),
    [tab, upcoming, past]
  );
  const months = useMemo(() => {
    const out = [];
    for (const e of list) {
      const k = monthKey(e.iso);
      if (out.at(-1)?.k !== k) out.push({ k, events: [] });
      out.at(-1).events.push(e);
    }
    return out;
  }, [list]);
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const when = (e) => {
    const n = Math.round((Date.parse(e.iso) - today) / DAY);
    return n <= 0 ? tx.today : n === 1 ? tx.tomorrow : tx.inDays(n);
  };
  const monthLabel = (k) => formatDate(`${k}-15`, lang, { month: "long", year: "numeric" });

  return (
    <main className="w-full max-w-3xl mx-auto px-5 py-8">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
        <CalendarDays className="w-3.5 h-3.5" /> {tx.kicker}
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{tx.title}</h1>
      <p className="text-sm text-neutral-400 mt-2">{tx.intro}</p>

      <div role="tablist" className="mt-5 inline-flex rounded-full border border-neutral-800 bg-neutral-900 p-1">
        {[["upcoming", tx.upcoming], ["results", tx.results]].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`tap text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full ${tab === id ? "bg-amber-400 text-neutral-950" : "text-neutral-400 hover:text-neutral-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "results" && <AiRecord cards={past} lang={lang} className="mt-5" />}

      {!months.length && <p className="mt-8 text-sm text-neutral-500">{tab === "upcoming" ? tx.empty : tx.emptyPast}</p>}

      {months.map(({ k, events }) => (
        <section key={k} className="mt-7">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3 capitalize">{monthLabel(k)}</h2>
          <div className="space-y-3">
            {events.map((e, i) => {
              const isNext = tab === "upcoming" && e === list[0];
              const canVote = voteEvent && eventSlug(voteEvent) === eventSlug(e);
              const headline = tab === "results" ? (e.results || []).map((r) => ({ r, s: resultSides(r.fight) })).find((x) => x.s?.winner) : null;
              return (
                <button
                  key={e.name + e.iso}
                  onClick={() => onEvent(e, { vote: canVote })}
                  style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
                  className={`row-rise tap group w-full text-left rounded-2xl border bg-neutral-900/70 hover:bg-neutral-900 p-4 flex gap-4 items-start ${isNext ? "border-amber-400/50" : "border-neutral-800 hover:border-amber-400/40"}`}
                >
                  <div className={`shrink-0 w-14 rounded-xl text-center py-2 border ${isNext ? "border-amber-400/60 bg-amber-400/10" : "border-neutral-800 bg-neutral-950"}`}>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">{formatDate(e.iso, lang, { weekday: "short" }).replace(".", "")}</div>
                    <div className={`text-2xl font-extrabold leading-none mt-0.5 ${isNext ? "text-amber-300" : "text-neutral-100"}`}>{Number(e.iso.slice(8, 10))}</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">{formatDate(e.iso, lang, { month: "short" }).replace(".", "")}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {isNext && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950">{tx.next}</span>}
                      {canVote && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-400/50 text-amber-300"><Vote className="w-3 h-3" /> {tx.vote}</span>}
                      {tab === "upcoming" && <span className="text-[11px] text-neutral-500">{when(e)}</span>}
                    </div>
                    <h3 className="font-bold leading-snug">{eventName(e.name, lang)}</h3>
                    {e.main && tab === "upcoming" && <p className="text-sm text-neutral-300 mt-0.5">{L(e.main, lang)}</p>}
                    {headline && (
                      <p className="text-sm text-neutral-300 mt-0.5 flex items-start gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-[3px]" />
                        <span>{tx.won(headline.s.winner, headline.s.loser, headline.r.method ? translateMethod(headline.r.method, lang) : "")}</span>
                      </p>
                    )}
                    {e.location && (
                      <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{L(e.location, lang)}</span>
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-amber-300 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
