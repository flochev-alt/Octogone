import { useState, useMemo, useEffect, useRef } from "react";
import { Newspaper, MapPin, CheckCircle2, Search, Play } from "lucide-react";
import { T, L, formatDate, translateMethod } from "./i18n.js";
import { useMedia } from "./useMedia.js";
import { usePhotos, creditOf } from "./usePhotos.js";
import { getConsent } from "./consent.js";
import FighterAvatar from "./FighterAvatar.jsx";

export const eventName = (name, lang) => (lang === "fr" ? name : name.replace(" : ", ": "));

// Fil unique, trié par date décroissante (le plus lointain/récent en haut).
const byIsoDesc = (a, b) => (a.iso < b.iso ? 1 : -1);

const shortDate = (iso, lang) => formatDate(iso, lang, { day: "numeric", month: "short", year: "numeric" });

function Avatar({ label, highlight }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
      highlight ? "bg-amber-400 text-neutral-950" : "bg-neutral-800 text-neutral-300"
    }`}>
      {label}
    </div>
  );
}

function FightersBadges({ fighters, highlight }) {
  if (!fighters || fighters.length < 2) return <Avatar label="UFC" highlight={highlight} />;
  return (
    <div className="flex -space-x-2 shrink-0">
      <FighterAvatar name={fighters[0]} size={36} gold={highlight} />
      <FighterAvatar name={fighters[1]} size={36} gold={highlight} />
    </div>
  );
}

// Face-à-face des affiches mises en avant : écussons (ou photos) des deux combattants.
function FaceOff({ names, t }) {
  const photos = usePhotos();
  const photoOf = (n) => photos[n]?.url;
  return (
    <>
    <div className="relative overflow-hidden mt-3 rounded-xl border border-amber-400/30 bg-neutral-950 px-4 py-5 flex items-start justify-between gap-3">
      <div className="glow-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
      {names.map((n, i) => (
        <div key={n} className={`relative flex-1 min-w-0 flex flex-col items-center gap-2 text-center ${i === 1 ? "order-3" : ""}`}>
          <FighterAvatar name={n} photo={photoOf(n)} size={72} gold />
          <span className="disp text-sm leading-tight">{n}</span>
        </div>
      ))}
      <span className="relative order-2 self-start mt-4 disp text-sm w-10 h-10 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0">VS</span>
    </div>
    <PhotoCredits names={names} photos={photos} t={t} />
    </>
  );
}

function Post({ children }) {
  return (
    <div className="border-b border-neutral-800 px-5 py-4 hover:bg-neutral-900/40 transition-colors">
      {children}
    </div>
  );
}

function UpcomingPost({ c, lang, t }) {
  return (
    <div className="flex gap-3">
      <FightersBadges fighters={c.fighters} highlight={c.highlight} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">UFC</span>
          <span className="text-neutral-500 text-xs">@ufc</span>
          <span className="text-neutral-600 text-xs">· {formatDate(c.iso, lang)}</span>
          {c.highlight && (
            <span className="ml-1 text-[10px] font-semibold text-amber-400 border border-amber-400/40 rounded-full px-2 py-0.5">{L(c.badge, lang) || t.titleFight}</span>
          )}
        </div>
        <div className="disp text-base mt-1">{eventName(c.name, lang)}</div>
        <div className="text-sm text-neutral-200 mt-1">{L(c.main, lang)}</div>
        {c.highlight && c.fighters?.length === 2 && <FaceOff names={c.fighters} t={t} />}
        {c.note && <div className="text-xs text-neutral-500 mt-2">{L(c.note, lang)}</div>}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2">
          <MapPin className="w-3 h-3" /> {L(c.location, lang)}
          <CheckCircle2 className="w-3 h-3 text-amber-400 ml-2" /> {t.official}
        </div>
      </div>
    </div>
  );
}

function RecapPost({ card, lang, t }) {
  return (
    <div className="flex gap-3">
      <Avatar label="UFC" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">UFC</span>
          <span className="text-neutral-500 text-xs">@ufc</span>
          <span className="text-neutral-600 text-xs">· {formatDate(card.iso, lang)}</span>
        </div>
        <div className="disp text-base mt-1">{eventName(card.name, lang)}</div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 mb-3">
          <MapPin className="w-3 h-3" /> {L(card.location, lang)}
        </div>
        <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3">
          {card.results.map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-xs border-t border-neutral-800 pt-2 first:border-0 first:pt-0">
              <div>
                <div className="text-neutral-200">{r.fight}</div>
                <div className="text-neutral-500">{L(r.note, lang)}</div>
              </div>
              <span className="font-semibold text-amber-400 shrink-0 whitespace-nowrap">{translateMethod(r.method, lang)}</span>
            </div>
          ))}
        </div>
        {card.note && <div className="text-xs text-neutral-500 mt-2">{L(card.note, lang)}</div>}
        {card.tweetUrl && (
          <>
            <div className="text-[11px] uppercase tracking-widest text-amber-400 mt-3">{t.finishLabel}</div>
            <TweetEmbed url={card.tweetUrl} lang={lang} t={t} />
          </>
        )}
      </div>
    </div>
  );
}

// Charge le widget officiel X (Twitter) uniquement quand le post apparaît à l'écran en scrollant.
// X n'est pas soumis aux mêmes restrictions de diffusion par pays que les vidéos YouTube de l'UFC.
// Le widget X dépose ses propres cookies : il ne se charge qu'avec l'accord du visiteur (bandeau cookies
// accepté, ou clic sur « Afficher le post X »), comme le demande la CNIL. Sinon, un simple lien vers X.
function TweetEmbed({ url, lang, t }) {
  const [allowed, setAllowed] = useState(() => getConsent() === "accepted");
  if (!allowed) {
    return (
      <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-center">
        <p className="text-[11px] text-neutral-500 leading-relaxed">{t.xConsentNote}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button onClick={() => setAllowed(true)} className="tap rounded-lg border border-amber-400/60 text-amber-400 text-xs font-semibold px-3 py-2 hover:bg-amber-400/10">
            <Play className="inline w-3 h-3 mr-1 fill-amber-400" />{t.xShow}
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="tap rounded-lg border border-neutral-700 text-neutral-300 text-xs font-semibold px-3 py-2 hover:bg-neutral-800">
            {t.viewPost}
          </a>
        </div>
      </div>
    );
  }
  return <TweetWidget url={url} lang={lang} t={t} />;
}

function TweetWidget({ url, lang, t }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (window.twttr?.widgets) {
      window.twttr.widgets.load(ref.current);
      return;
    }
    if (document.getElementById("twitter-wjs")) return;
    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, [inView]);

  return (
    <div ref={ref} className="mt-3 flex justify-center">
      {inView && (
        <blockquote className="twitter-tweet" data-theme="dark" data-lang={lang}>
          <a href={url}>{t.viewPost}</a>
        </blockquote>
      )}
    </div>
  );
}

function ReactionPost({ r, lang }) {
  const author = L(r.author, lang);
  return (
    <div className="flex gap-3">
      <Avatar label={author.split(" ").map((w) => w[0]).join("").slice(0, 2)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">{author}</span>
          {r.handle && <span className="text-neutral-500 text-xs">{r.handle}</span>}
          <span className="text-neutral-600 text-xs">· {shortDate(r.iso, lang)}</span>
        </div>
        {r.text && <p className="text-sm text-neutral-200 mt-1">{r.text}</p>}
        {r.summary && <p className="text-sm text-neutral-300 mt-1">{L(r.summary, lang)}</p>}
        {r.context && <div className="text-xs text-neutral-500 mt-1.5">{L(r.context, lang)}</div>}
      </div>
    </div>
  );
}

function TweetPost({ tw, lang, t }) {
  return (
    <div className="flex gap-3">
      <Avatar label={tw.author.split(" ").map((w) => w[0]).join("").slice(0, 2)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">{tw.author}</span>
          <span className="text-neutral-500 text-xs">{tw.handle}</span>
          <span className="text-neutral-600 text-xs">· {shortDate(tw.iso, lang)}</span>
        </div>
        <p className="text-sm text-neutral-300 mt-1">{L(tw.context, lang)}</p>
        <TweetEmbed url={tw.url} lang={lang} t={t} />
      </div>
    </div>
  );
}

// Crédit des photos libres affichées (auteur · licence · Wikimedia Commons), avec lien vers le fichier.
function PhotoCredits({ names, photos, t }) {
  const shown = names.filter((n) => photos[n]?.page);
  if (!shown.length) return null;
  return (
    <div className="text-[10px] text-neutral-500 mt-1.5 flex flex-wrap gap-x-2">
      {shown.map((n) => (
        <a key={n} href={photos[n].page} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">
          {t.photoBy} {creditOf(photos[n])}
        </a>
      ))}
    </div>
  );
}

// Nom de famille pour les titres d'affiche : "Carlos Prates" -> "Prates".
const lastName = (n) => n.split(" ").slice(1).join(" ") || n;

// Affiche « À venir » : les deux combattants face à face, en grand, comme un poster.
function UpcomingPoster({ c, lang, t }) {
  const photos = usePhotos();
  const photoOf = (n) => photos[n]?.url;
  return (
    <section className="row-rise rounded-2xl overflow-hidden border border-amber-400/35 bg-neutral-900">
      <div className="relative h-56 sm:h-64 flex">
        {c.fighters.map((n) => (
          <div key={n} className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.22),#0a0a0a_70%)] flex items-start justify-center pt-6">
            {photoOf(n) ? (
              <img src={photoOf(n)} alt={n} onError={(e) => { e.currentTarget.style.display = "none"; }} className="photo-fade absolute inset-0 w-full h-full object-cover object-top" />
            ) : (
              <span aria-hidden="true" className="disp text-6xl sm:text-7xl text-amber-400/30">{n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
            )}
          </div>
        ))}
        <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 disp text-base w-14 h-14 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl">VS</span>
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-900 to-transparent" />
        <div className="absolute left-4 right-4 bottom-3 disp text-2xl leading-tight">
          {lastName(c.fighters[0])} vs. {lastName(c.fighters[1])}
        </div>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="text-sm font-semibold text-amber-400">
          {eventName(c.name, lang)}{c.badge ? ` · ${L(c.badge, lang)}` : c.highlight ? ` · ${t.titleFight}` : ""}
        </div>
        <div className="text-xs text-neutral-400 mt-1">{formatDate(c.iso, lang)} · {L(c.location, lang)}</div>
        <PhotoCredits names={c.fighters} photos={photos} t={t} />
      </div>
    </section>
  );
}

// Carte « Derniers résultats » : vignette vers la vidéo du finish, puis les deux premiers combats.
function LatestResults({ card, lang, t }) {
  return (
    <section className="row-rise rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
      {card.tweetUrl && (
        <a
          href={card.tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tap relative h-36 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#3a2f10_0_10px,#2a220b_10px_20px)]"
        >
          <span className="w-14 h-14 rounded-full bg-neutral-950/80 border border-amber-400 flex items-center justify-center">
            <Play className="w-5 h-5 text-amber-400 fill-amber-400 ml-0.5" />
          </span>
          <span className="absolute left-3 top-3 mono text-[10px] uppercase tracking-widest text-amber-400 bg-neutral-950 rounded-md px-2 py-1">{t.finishVideo}</span>
        </a>
      )}
      <div className="px-4 py-3.5 space-y-1.5">
        <div className="disp text-lg">{eventName(card.name, lang)}</div>
        {card.results.slice(0, 2).map((r, i) => {
          const [winner, loser] = r.fight.split(" def. ");
          return (
            <div key={i} className="text-sm">
              <span className="text-amber-400 font-semibold">{lastName(winner)}</span>
              <span className="text-neutral-400"> {t.beat} {loser ? lastName(loser) : ""} · {translateMethod(r.method, lang)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Toutes les versions d'un texte multilingue, pour que la recherche marche quelle que soit la langue tapée.
const allLangs = (v) => (v && typeof v === "object" ? Object.values(v) : [v]);

// Fonction de recherche : concatène tous les champs texte pertinents d'un item pour le filtrage.
function searchTextFor(item) {
  const d = item.data;
  let fields = [];
  if (item.type === "upcoming") fields = [d.name, d.main, d.note, d.location, ...(d.fighters || [])];
  if (item.type === "recap") fields = [d.name, d.location, d.note, ...d.results.flatMap((r) => [r.fight, r.method, r.note])];
  if (item.type === "reaction") fields = [d.author, d.text, d.summary, d.context];
  if (item.type === "tweet") fields = [d.author, d.handle, d.context];
  return fields.flatMap(allLangs).filter(Boolean).join(" ").toLowerCase();
}

export default function Media({ lang = "fr" }) {
  const t = T[lang];
  const [query, setQuery] = useState("");
  const items = useMedia();
  const feed = useMemo(() => items.filter((i) => i.type !== "trash_talk").sort(byIsoDesc), [items]);
  const trashTalk = useMemo(() => items.filter((i) => i.type === "trash_talk").map((i) => i.data), [items]);

  const filteredFeed = useMemo(() => {
    if (!query.trim()) return feed;
    const q = query.toLowerCase();
    return feed.filter((item) => searchTextFor(item).includes(q));
  }, [query, feed]);

  const filteredTrashTalk = useMemo(() => {
    if (!query.trim()) return trashTalk;
    const q = query.toLowerCase();
    return trashTalk.filter((tt) =>
      [tt.a, tt.b, ...allLangs(tt.summary)].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query, trashTalk]);

  const noResults = filteredFeed.length === 0 && filteredTrashTalk.length === 0;

  // À la une : la prochaine affiche (avec ses deux combattants) et le dernier événement terminé.
  const today = new Date().toISOString().slice(0, 10);
  const nextPoster = useMemo(
    () => items.filter((i) => i.type === "upcoming" && i.iso >= today && i.data.fighters?.length === 2).sort((a, b) => (a.iso < b.iso ? -1 : 1))[0]?.data,
    [items, today]
  );
  const latestRecap = useMemo(() => feed.find((i) => i.type === "recap")?.data, [feed]);

  return (
    <div className="w-full max-w-2xl lg:max-w-5xl mx-auto">
      <div className="row-rise flex items-center gap-2 px-5 py-6">
        <Newspaper className="w-4 h-4 text-amber-400" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">{t.mediaTitle}</span>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors focus-within:border-amber-400/50">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.mediaSearch}
            className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-500"
          />
        </div>
      </div>

      {!query.trim() && (nextPoster || latestRecap) && (
        // Sur ordinateur, l'affiche et les derniers résultats sont côte à côte.
        <div className="px-5 pb-6 grid gap-6 lg:grid-cols-2">
          {nextPoster && (
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">{t.upcomingLabel}</div>
              <UpcomingPoster c={nextPoster} lang={lang} t={t} />
            </div>
          )}
          {latestRecap && (
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">{t.latestResults}</div>
              <LatestResults card={latestRecap} lang={lang} t={t} />
            </div>
          )}
          <div className="mono text-[10px] uppercase tracking-widest text-neutral-400 pt-2 lg:col-span-2">{t.newsFeed}</div>
        </div>
      )}

      <div className="border-t border-neutral-800 lg:max-w-2xl lg:mx-auto">
        {filteredFeed.map((item, i) => (
          <Post key={`${item.type}-${i}`}>
            {item.type === "upcoming" && <UpcomingPost c={item.data} lang={lang} t={t} />}
            {item.type === "recap" && <RecapPost card={item.data} lang={lang} t={t} />}
            {item.type === "reaction" && <ReactionPost r={item.data} lang={lang} />}
            {item.type === "tweet" && <TweetPost tw={item.data} lang={lang} t={t} />}
          </Post>
        ))}

        {/* Trash talk — non daté, toujours en fin de fil */}
        {filteredTrashTalk.map((tt, i) => (
          <Post key={`tt-${i}`}>
            <div className="flex gap-3">
              <Avatar label={tt.a.split(" ").map((w) => w[0]).join("").slice(0, 2)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-neutral-100">{tt.a}</span>
                  <span className="text-amber-400 text-xs">vs {tt.b}</span>
                  <span className="text-neutral-600 text-xs">· {L(tt.date, lang)}</span>
                </div>
                <p className="text-sm text-neutral-300 mt-1.5 leading-relaxed">{L(tt.summary, lang)}</p>
              </div>
            </div>
          </Post>
        ))}

        {noResults && (
          <p className="text-sm text-neutral-400 px-5 py-6">{t.noResults(query)}</p>
        )}
      </div>

      <p className="text-[11px] text-neutral-600 px-5 py-6">{t.mediaDisclaimer}</p>
    </div>
  );
}
