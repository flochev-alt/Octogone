import { useState, useEffect } from "react";
import { ChevronLeft, MapPin, Sparkles, Trophy, Target, Swords, CalendarDays } from "lucide-react";
import { T, L, formatDate, translateCategory, translateMethod } from "./i18n.js";
import { eventName, TweetEmbed } from "./Media.jsx";
import { useMedia } from "./useMedia.js";
import { useFighters } from "./useFighters.js";
import { usePhotos, creditOf } from "./usePhotos.js";
import FighterAvatar from "./FighterAvatar.jsx";
import FighterLink from "./FighterLink.jsx";
import { eventSlug, cardOf, findFighter, resultSides, isUpcoming, parisDay, useNow } from "./events.js";
import { duelOdds } from "./score.js";

// Événement d'après son adresse (/evenement/<slug>), parmi les cartes à venir et les cartes passées du fil Média.
export function useEvent(slug) {
  const items = useMedia();
  const item = items.find((i) => (i.type === "upcoming" || i.type === "recap") && eventSlug(i.data) === slug);
  return item ? { ...item.data, past: item.type === "recap" } : null;
}

const PARTS = ["main", "prelims", "early"];
const PART_LABEL = { main: "mainCard", prelims: "prelims", early: "earlyPrelims" };

// Page d'un événement : affiche, compte à rebours, carte complète avec pronostics (ou résultats si l'événement est passé).
export default function EventPage({ slug, lang = "fr", onBack, onFighter, onSimulate }) {
  const t = T[lang];
  const e = useEvent(slug);
  const fighters = useFighters();
  const photos = usePhotos();
  const now = useNow();
  const title = e ? (e.past ? `${eventName(e.name, lang)} : ${t.results} | Octogone` : t.eventTitle(eventName(e.name, lang))) : null;
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  if (!e) {
    return (
      <main className="w-full max-w-3xl mx-auto px-5 py-10">
        <BackButton onBack={onBack} t={t} />
        <p className="text-sm text-neutral-400 mt-6">{t.noResults(slug)}</p>
      </main>
    );
  }

  const upcoming = !e.past && isUpcoming(e, now);
  const card = e.past ? [] : cardOf(e);
  const sides = e.past ? resultSides(e.results?.[0]?.fight || "") : null;
  const headliners = e.fighters?.length === 2 ? e.fighters : card[0] ? [card[0].a, card[0].b] : sides ? [sides.winner || sides.a, sides.loser || sides.b] : [];

  return (
    <main className="w-full max-w-3xl mx-auto px-5 py-6 sm:py-8">
      <style>{`
        @keyframes aiShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .ai-shimmer { background: linear-gradient(90deg, #262626 25%, rgba(251,191,36,0.25) 50%, #262626 75%); background-size: 200% 100%; animation: aiShimmer 1.6s linear infinite; }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .live-dot { animation: livePulse 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ai-shimmer, .live-dot { animation: none; } }
      `}</style>
      <BackButton onBack={onBack} t={t} />

      {/* Affiche */}
      <section className="row-rise relative overflow-hidden mt-4 rounded-2xl border border-amber-400/35 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.22),#0a0a0a_70%)] px-5 pt-5 pb-6 sm:px-8 sm:pt-7">
        <div className="mono text-[10px] uppercase tracking-widest text-amber-400 flex flex-wrap items-center gap-x-2 gap-y-1">
          <CalendarDays className="w-3 h-3" /> {formatDate(e.iso, lang)}
          {e.badge && <span className="rounded-full border border-amber-400/40 px-2 py-0.5 normal-case tracking-normal font-semibold">{L(e.badge, lang)}</span>}
        </div>
        <h1 className="disp text-3xl sm:text-5xl leading-[1.05] mt-2">{eventName(e.name, lang)}</h1>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
          <MapPin className="w-3 h-3 shrink-0" /> {L(e.location, lang)}
        </div>

        {headliners.length === 2 && (
          <div className="relative mt-6 flex items-start justify-between gap-3">
            <div className="glow-pulse absolute left-1/2 top-10 -translate-x-1/2 w-56 h-40 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
            {headliners.map((n, i) => (
              <div key={n} className={`relative flex-1 min-w-0 flex flex-col items-center gap-2 text-center ${i === 1 ? "order-3" : ""}`}>
                <FighterAvatar name={n} photo={photos[n]?.url} size={96} gold />
                <FighterLink name={n} fighters={fighters} onFighter={onFighter} className="disp text-base sm:text-xl leading-tight" />
              </div>
            ))}
            <span className="relative order-2 mt-8 disp text-base w-12 h-12 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 shadow-2xl">VS</span>
          </div>
        )}

        {upcoming && <Countdown e={e} now={now} t={t} />}
        {e.past && <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 text-center mt-5">{t.eventOver}</p>}
      </section>
      {headliners.some((n) => photos[n]?.page) && (
        <div className="text-[10px] text-neutral-600 mt-1.5 flex flex-wrap justify-center gap-x-3">
          {headliners.filter((n) => photos[n]?.page).map((n) => (
            <a key={n} href={photos[n].page} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400">{t.photoBy} {creditOf(photos[n])}</a>
          ))}
        </div>
      )}

      {e.note && <p className="row-rise text-sm text-neutral-400 leading-relaxed mt-5">{L(e.note, lang)}</p>}

      {/* Carte à venir, par partie (carte principale, préliminaires, early prelims) */}
      {!e.past && card.length > 0 && (
        <div className="mt-8 space-y-8">
          {PARTS.map((part) => {
            const fights = card.filter((f) => (f.part || "main") === part);
            if (!fights.length) return null;
            return (
              <section key={part}>
                <h2 className="mono text-[11px] uppercase tracking-widest text-amber-400 mb-3">{t[PART_LABEL[part]]}</h2>
                <div className="space-y-3">
                  {fights.map((f) => (
                    <FightRow
                      key={`${f.a}-${f.b}`}
                      fight={f}
                      headline={f === card[0]}
                      event={e}
                      open={upcoming}
                      fighters={fighters}
                      photos={photos}
                      lang={lang}
                      t={t}
                      onFighter={onFighter}
                      onSimulate={onSimulate}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {card.length < 5 && <p className="text-xs text-neutral-500">{t.cardSoFar}</p>}
          <p className="text-[11px] text-neutral-500">{t.aiDisclaimer}</p>
        </div>
      )}

      {/* Carte passée : résultats, liens vers les fiches et vidéo du finish */}
      {e.past && e.results?.length > 0 && (
        <section className="mt-8">
          <h2 className="mono text-[11px] uppercase tracking-widest text-amber-400 mb-3">{t.results}</h2>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 divide-y divide-neutral-800">
            {e.results.map((r, i) => {
              const s = resultSides(r.fight);
              return (
                <div key={i} className="row-rise flex items-start justify-between gap-3 px-4 py-3 text-sm" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="min-w-0">
                    {s?.winner ? (
                      <div>
                        <FighterLink name={s.winner} fighters={fighters} onFighter={onFighter} className="font-semibold text-amber-400" />
                        <span className="text-neutral-500"> {t.beat} </span>
                        <FighterLink name={s.loser} fighters={fighters} onFighter={onFighter} className="text-neutral-200" />
                      </div>
                    ) : (
                      <div className="text-neutral-200">{r.fight}</div>
                    )}
                    {r.note && <div className="text-xs text-neutral-500 mt-0.5">{L(r.note, lang)}</div>}
                  </div>
                  <span className="font-semibold text-xs text-amber-400 shrink-0 whitespace-nowrap">{translateMethod(r.method, lang)}</span>
                </div>
              );
            })}
          </div>
          {e.tweetUrl && (
            <>
              <div className="text-[11px] uppercase tracking-widest text-amber-400 mt-6">{t.finishLabel}</div>
              <TweetEmbed url={e.tweetUrl} lang={lang} t={t} />
            </>
          )}
        </section>
      )}
    </main>
  );
}

function BackButton({ onBack, t }) {
  return (
    <button onClick={onBack} className="tap inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-amber-300">
      <ChevronLeft className="w-4 h-4" /> {t.backToMedia}
    </button>
  );
}

// Compte à rebours à la seconde quand on connaît l'heure de début (start), sinon le nombre de jours.
function Countdown({ e, now, t }) {
  const start = e.start ? Date.parse(e.start) : null;
  if (start != null && now >= start) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="live-dot w-2 h-2 rounded-full bg-red-500" />
        <span className="mono text-xs uppercase tracking-[0.2em] text-red-400">{t.liveNow}</span>
      </div>
    );
  }
  if (start != null) {
    const left = start - now;
    const parts = [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60];
    return (
      <div className="mt-6">
        <div className="mono text-[10px] uppercase tracking-widest text-neutral-400 text-center mb-2">{t.startsIn}</div>
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {parts.map((v, i) => (
            <div key={i} className="rounded-xl bg-neutral-950/80 border border-neutral-800 py-2 text-center">
              <span className="mono block text-2xl leading-none text-amber-300">{String(v).padStart(2, "0")}</span>
              <span className="mono block text-[9px] uppercase text-neutral-500 mt-1">{t.countdownUnits[i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const days = Math.round((Date.parse(e.iso) - Date.parse(parisDay(now))) / 864e5);
  return (
    <div className="mt-6 text-center">
      <span className="mono inline-block rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 text-sm text-amber-300">
        {days <= 0 ? t.tonight : t.daysLeft(days)}
      </span>
    </div>
  );
}

// Pronostics de l'IA déjà reçus pendant la visite (pour ne pas redemander en changeant de page).
const picks = new Map();

function FightRow({ fight, headline, event, open, fighters, photos, lang, t, onFighter, onSimulate }) {
  const a = findFighter(fighters, fight.a);
  const b = findFighter(fighters, fight.b);
  const odds = a && b ? duelOdds(a, b) : null;
  const key = `${eventSlug(event)}|${fight.a}|${fight.b}|${lang}`;
  const [pick, setPick] = useState(() => picks.get(key) || null);
  const [state, setState] = useState(pick ? "done" : "idle");

  const loadPick = async () => {
    setState("loading");
    try {
      const r = await fetch("/api/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: eventSlug(event), a: fight.a, b: fight.b, lang }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const { analysis } = await r.json();
      if (!analysis || typeof analysis !== "object") throw new Error("empty");
      picks.set(key, analysis);
      setPick(analysis);
      setState("done");
    } catch {
      setState("error");
    }
  };

  // Le main event affiche son pronostic tout de suite ; les autres combats sur demande.
  useEffect(() => {
    const cached = picks.get(key);
    setPick(cached || null);
    setState(cached ? "done" : "idle");
    if (!cached && headline && open && odds) loadPick();
  }, [key, Boolean(odds)]);

  const sameCategory = a && b && a.categorie === b.categorie;

  return (
    <div className={`row-rise rounded-2xl border bg-neutral-900 p-4 ${headline ? "border-amber-400/40" : "border-neutral-800"}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="mono text-[10px] uppercase tracking-widest text-neutral-500 truncate">{fight.cat ? translateCategory(fight.cat, lang) : ""}</span>
        {fight.belt && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 border border-amber-400/40 rounded-full px-2 py-0.5">
            <Trophy className="w-3 h-3" /> {L(fight.belt, lang)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {[fight.a, fight.b].map((n, i) => (
          <div key={n} className={`min-w-0 flex items-center gap-2.5 ${i === 1 ? "order-3 flex-row-reverse text-right" : ""}`}>
            <FighterAvatar name={n} photo={photos[n]?.url} size={headline ? 52 : 44} gold={headline} />
            <FighterLink name={n} fighters={fighters} onFighter={onFighter} className="font-semibold text-sm sm:text-[15px] leading-tight break-words min-w-0" />
          </div>
        ))}
        <span className="order-2 mono text-[11px] text-neutral-500">VS</span>
      </div>

      {odds ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5">
            <span className="mono text-amber-400 text-sm normal-case tracking-normal">{odds.probA}%</span>
            <span>{t.modelPick}</span>
            <span className="mono text-neutral-300 text-sm normal-case tracking-normal">{odds.probB}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden flex">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${odds.probA}%` }} />
            <div className="h-full bg-neutral-500" style={{ width: `${odds.probB}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-neutral-500">{t.aiPickNoData}</p>
      )}

      {odds && open && (
        <div className="mt-4">
          {state === "idle" && (
            <button onClick={loadPick} className="tap w-full rounded-xl border border-amber-400/50 text-amber-300 text-xs font-semibold py-2.5 hover:bg-amber-400/10 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t.aiPickShow}
            </button>
          )}
          {state === "loading" && (
            <div className="space-y-2" aria-live="polite">
              <div className="ai-shimmer h-3 rounded-full w-4/5" />
              <div className="ai-shimmer h-3 rounded-full w-3/5" />
              <p className="text-[11px] text-neutral-500">{t.aiPickLoading}</p>
            </div>
          )}
          {state === "error" && <p className="text-[11px] text-neutral-500">{t.aiPickFailed}</p>}
          {state === "done" && pick && (
            <div className="row-rise rounded-xl border border-amber-400/40 bg-amber-400/[0.06] p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-400 mb-2">
                <Sparkles className="w-3 h-3" /> {t.aiPick}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-semibold px-2.5 py-1">
                  <Trophy className="w-3 h-3" /> {t.favorite(pick.favori)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 text-amber-300 text-[11px] font-semibold px-2.5 py-1">
                  <Target className="w-3 h-3" /> {t.finishLabels[pick.tendance] || pick.tendance}
                </span>
                <span className="inline-flex items-center rounded-full border border-neutral-700 text-neutral-300 text-[11px] font-semibold px-2.5 py-1">
                  {t.aiConfidence} : {t.confidenceLabels[pick.confiance] || pick.confiance}
                </span>
              </div>
              <p className="text-sm text-neutral-100 leading-relaxed">{pick.verdict}</p>
            </div>
          )}
          {sameCategory && (
            <button onClick={() => onSimulate(a, b)} className="tap mt-2 w-full text-[11px] font-semibold text-neutral-400 hover:text-amber-300 flex items-center justify-center gap-1.5 py-1.5">
              <Swords className="w-3.5 h-3.5" /> {t.fullAnalysis}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
