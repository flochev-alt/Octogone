import { useState, useEffect, useRef } from "react";
import { ArrowRight, Swords, Trophy, Newspaper } from "lucide-react";
import { LANGUAGES, T } from "./i18n.js";
import { eventName } from "./Media.jsx";
import { useMedia } from "./useMedia.js";

// Événements à venir, lus dans le fil Média (Supabase, sinon mediaData.js), du plus proche au plus lointain.
// `start` (facultatif) = début de la carte principale en UTC : il active le compte à rebours à la seconde.
// Un événement reste « en cours » 6 h après son début, sinon jusqu'à la fin de sa journée (heure de Paris).
const parisDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(d);
const LIVE_HOURS = 6;
function upcomingEvents(items, now) {
  return items
    .filter((p) => p.type === "upcoming")
    .map((p) => p.data)
    .filter((e) => (e.start ? now - Date.parse(e.start) < LIVE_HOURS * 3600e3 : e.iso >= parisDay(now)))
    .sort((a, b) => (a.start || a.iso).localeCompare(b.start || b.iso));
}
const LOCALES = { fr: "fr-FR", en: "en-US", es: "es-ES" };
const shortDate = (iso, lang) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALES[lang], { day: "2-digit", month: "2-digit", year: "numeric" });
const lastName = (n) => n.split(" ").slice(-1)[0];

// Heure courante, rafraîchie chaque seconde (pour le compte à rebours).
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  delay: i * 0.18,
}));

export default function Landing({ onEnter = () => {}, onEnterSimulator = () => {}, onEnterMedia = () => {}, lang = "fr", setLang = () => {} }) {
  const t = T[lang];
  const [mounted, setMounted] = useState(false);
  const now = useNow();
  const events = upcomingEvents(useMedia(), now);
  const nextEvent = events[0];
  const [particles, setParticles] = useState([]);
  const lastSpawn = useRef(0);

  const spawnParticle = (e) => {
    const now = Date.now();
    if (now - lastSpawn.current < 70) return;
    lastSpawn.current = now;
    const rect = e.currentTarget.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const id = `${now}-${Math.random().toString(36).slice(2, 7)}`;
    setParticles((p) => [...p.slice(-20), { id, x, y }]);
    setTimeout(() => {
      setParticles((p) => p.filter((pt) => pt.id !== id));
    }, 900);
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-neutral-950 text-neutral-50 overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif", WebkitTouchCallout: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .disp { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
        .mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
        @keyframes octoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes octoFade { from { opacity: 0; transform: scale(0.9); filter: blur(14px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
        @keyframes blurIn { from { opacity: 0; transform: scale(1.05); filter: blur(18px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
        @keyframes riseUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowBreathe { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes sparkFly {
          0% { opacity: 0; transform: rotate(var(--a)) translateX(0) scale(0.4); }
          15% { opacity: 0.9; }
          75% { opacity: 0.7; }
          100% { opacity: 0; transform: rotate(var(--a)) translateX(260px) scale(1); }
        }
        @keyframes shine { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }
        @keyframes particleFloat {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -140%) scale(0.3); }
        }
        .particle-dot { animation: particleFloat 0.9s ease-out forwards; }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .live-dot { animation: livePulse 1.2s ease-in-out infinite; }
        @keyframes borderSpin { to { transform: rotate(360deg); } }
        .event-border {
          background: conic-gradient(from 0deg, transparent 0 62%, rgba(251,191,36,0.35) 72%, #fbbf24 86%, #fef3c7 90%, transparent 96%);
          animation: borderSpin 4s linear infinite;
        }
        .event-card { box-shadow: 0 0 40px -10px rgba(251,191,36,0.45); }

        /* Les deux anneaux restent fixes après leur entrée, pour garder un alignement parfait comme sur la photo de référence */
        .octo-outer { }
        .octo-inner { }
        .octo-in { animation: octoFade 1.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .blur-in { animation: blurIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .rise { animation: riseUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .glow { animation: glowBreathe 4s ease-in-out infinite; }
        .ticker-track { animation: tickerScroll 28s linear infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #fbbf24 0%, #fef3c7 50%, #fbbf24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .spark { animation: sparkFly 3.4s ease-out infinite; }
        .shine-btn { position: relative; overflow: hidden; }
        .shine-sweep {
          position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: shine 2.6s ease-in-out infinite;
          animation-delay: 1.2s;
        }
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
      `}</style>

      {/* Hero */}
      <section
        className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-5 pb-16 text-center"
        onMouseMove={spawnParticle}
        onTouchMove={spawnParticle}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-dot absolute w-1.5 h-1.5 rounded-full bg-amber-300 pointer-events-none z-30"
            style={{ left: p.x, top: p.y, boxShadow: "0 0 8px 2px rgba(251,191,36,0.6)" }}
          />
        ))}
        {/* Logo, en haut à gauche */}
        <div className="rise absolute top-5 left-5 z-40 w-14 h-14 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 100 100">
            <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="none" stroke="#fbbf24" strokeWidth="9" />
            <text x="50" y="66" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="48" fill="white">O<tspan fill="#fbbf24">.</tspan></text>
          </svg>
        </div>

        {/* Sélecteur de langue : au-dessus de la carte du prochain événement, qui occupe le haut de l'écran. */}
        <div className="rise absolute top-5 right-5 z-40 flex items-center gap-1 bg-neutral-900/80 backdrop-blur rounded-full p-1 border border-neutral-800">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-label={l.label}
              className={`tap w-8 h-8 rounded-full flex items-center justify-center text-base ${
                lang === l.code ? "bg-amber-400/20 ring-1 ring-amber-400/50" : "opacity-50 hover:opacity-90"
              }`}
            >
              {l.flag}
            </button>
          ))}
        </div>

        {/* Prochain événement, au-dessus de l'octogone (dans le flux, pour ne jamais le chevaucher) */}
        {nextEvent && (
          <div className="blur-in relative z-20 w-full pt-24 sm:pt-20" style={{ animationDelay: "150ms" }}>
            <NextEventCard e={nextEvent} now={now} lang={lang} t={t} onClick={onEnterMedia} />
          </div>
        )}

        {/* Scène : l'octogone est centré sur le titre */}
        <div className="relative w-full flex items-center justify-center h-[420px] sm:h-[560px]">
          {/* Fondu chaud discret, contenu dans le petit octogone */}
          <div className="absolute inset-0 m-auto w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-amber-400/40 blur-2xl pointer-events-none" />

          {/* Étincelles discrètes */}
          {mounted && (
            <div className="absolute w-2 h-2" aria-hidden>
              {SPARKS.map((s, i) => (
                <div
                  key={i}
                  className="spark absolute w-1 h-1 rounded-full bg-amber-300"
                  style={{ "--a": `${s.angle}deg`, animationDelay: `${1.6 + s.delay}s` }}
                />
              ))}
            </div>
          )}

          {/* Octogone : anneau extérieur épais fixe + anneau intérieur fin qui tourne */}
          {mounted && (
            <svg
              className="octo-in absolute w-[400px] h-[400px] sm:w-[560px] sm:h-[560px]"
              viewBox="0 0 100 100"
              style={{ animationDelay: "0ms" }}
            >
              <polygon
                className="octo-outer"
                points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
                fill="none"
                stroke="#fbbf24"
                strokeOpacity="0.5"
                strokeWidth="3.4"
              />
              <polygon
                className="octo-inner"
                points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
                fill="none"
                stroke="#fbbf24"
                strokeOpacity="0.28"
                strokeWidth="1.2"
                transform="scale(0.8)"
                style={{ transformOrigin: "50% 50%" }}
              />
            </svg>
          )}

          <div className="blur-in relative z-10" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="mono text-xs uppercase tracking-[0.2em] text-neutral-400">{t.landingKicker}</span>
            </div>

            <h1 className="disp text-5xl sm:text-7xl leading-[0.95] mb-5">
              {t.landingTitle1}
              <br />
              <span className="shimmer-text">{t.landingTitle2}</span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-8">
              {t.landingSubtitle}
            </p>

            <button
              onClick={onEnter}
              className="shine-btn tap group inline-flex items-center gap-2 bg-amber-400 text-neutral-950 font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-amber-300"
            >
              <span className="shine-sweep" aria-hidden />
              <span className="relative z-10 flex items-center gap-2">
                {t.landingCta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Ticker */}
        <div className="rise absolute bottom-8 left-0 right-0 overflow-hidden" style={{ animationDelay: "700ms" }}>
          <div className="flex whitespace-nowrap ticker-track">
            {/* Prochains événements : « UFC 334 le 14/11/2026 » */}
            {[...events, ...events, ...events].map((e, i) => (
              <span key={i} className="mono text-xs text-neutral-500 mx-6 flex items-center gap-2">
                {eventName(e.name, lang)} <span className="text-amber-400/70">{t.onDate(shortDate(e.iso, lang))}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation vers les sections : iPad et PC seulement (sur téléphone, en portrait comme en paysage, on passe par « Explorer le site »). */}
      <section className="hidden sm:grid [@media(max-height:500px)]:hidden max-w-4xl mx-auto px-5 pb-20 grid-cols-3 gap-3">
        <NavCard icon={Trophy} title={t.navCombattants} desc={t.navCardCombattantsDesc} onClick={onEnter} />
        <NavCard icon={Swords} title={t.navSimulateur} desc={t.navCardSimulateurDesc} onClick={onEnterSimulator} />
        <NavCard icon={Newspaper} title={t.navMedia} desc={t.navCardMediaDesc} onClick={onEnterMedia} />
      </section>
    </div>
  );
}

// Carte du prochain événement : bordure dorée animée, affiche du combat et compte à rebours.
function NextEventCard({ e, now, lang, t, onClick }) {
  const start = e.start ? Date.parse(e.start) : null;
  const live = start != null && now >= start;
  const daysLeft = Math.round((Date.parse(e.iso) - Date.parse(parisDay(now))) / 864e5);
  const label = live ? t.liveNow : !start && daysLeft <= 0 ? t.tonight : t.nextEvent;
  const headline = e.fighters?.length === 2 ? `${lastName(e.fighters[0])} vs. ${lastName(e.fighters[1])}` : eventName(e.name, lang);
  const left = start != null && !live ? start - now : null;
  const parts = left != null
    ? [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60]
    : null;

  return (
    <button onClick={onClick} className="tap event-card group relative mx-auto block w-full max-w-sm overflow-hidden rounded-2xl p-[1.5px] text-left">
      <span className="event-border absolute -inset-full" aria-hidden />
      <span className="relative block rounded-2xl bg-neutral-950/95 px-4 py-3.5 sm:px-5 sm:py-4">
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className={`live-dot w-2 h-2 rounded-full shrink-0 ${live ? "bg-red-500" : "bg-amber-400"}`} />
            <span className={`mono text-[10px] uppercase tracking-[0.2em] ${live ? "text-red-400" : "text-amber-400"}`}>{label}</span>
          </span>
          <span className="mono text-[10px] text-neutral-500">{shortDate(e.iso, lang)}</span>
        </span>
        <span className="disp block text-2xl sm:text-3xl leading-tight mt-2 truncate group-hover:text-amber-300 transition-colors">{headline}</span>
        <span className="block text-xs text-neutral-400 truncate mt-0.5">{eventName(e.name, lang)}</span>
        {parts && (
          <span className="mt-3 grid grid-cols-4 gap-1.5">
            {parts.map((v, i) => (
              <span key={i} className="rounded-lg bg-neutral-900 border border-neutral-800 py-1.5 text-center">
                <span className="mono block text-lg leading-none text-amber-300">{String(v).padStart(2, "0")}</span>
                <span className="mono block text-[9px] uppercase text-neutral-500 mt-1">{t.countdownUnits[i]}</span>
              </span>
            ))}
          </span>
        )}
        {!parts && !live && daysLeft > 0 && (
          <span className="mono mt-2 inline-block rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
            {`${t.countdownUnits[0].toUpperCase()}-${daysLeft}`}
          </span>
        )}
      </span>
    </button>
  );
}

function NavCard({ icon: Icon, title, desc, onClick, disabled, comingSoon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tap text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-amber-400/40 hover:bg-neutral-800 p-5 disabled:opacity-40 disabled:hover:border-neutral-800 disabled:hover:bg-neutral-900"
    >
      <Icon className="w-5 h-5 text-amber-400 mb-3" />
      <div className="disp text-base mb-1">{title}</div>
      <div className="text-xs text-neutral-500">{disabled ? comingSoon : desc}</div>
    </button>
  );
}
