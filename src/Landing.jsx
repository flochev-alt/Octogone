import { useState, useEffect } from "react";
import { ArrowRight, Swords, Trophy, Newspaper } from "lucide-react";
import { LANGUAGES, T } from "./i18n.js";

const TICKER_FIGHTERS = [
  { nom: "Islam Makhachev", record: "28-1-0" },
  { nom: "Alex Pereira", record: "13-4-0" },
  { nom: "Tom Aspinall", record: "15-3-0" },
  { nom: "Alexandre Pantoja", record: "30-6-0" },
  { nom: "Justin Gaethje", record: "28-5-0" },
  { nom: "Khamzat Chimaev", record: "15-1-0" },
];

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  delay: i * 0.18,
}));

export default function Landing({ onEnter = () => {}, lang = "fr", setLang = () => {} }) {
  const t = T[lang];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
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
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center">
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
            className="octo-in absolute w-[420px] h-[420px] sm:w-[620px] sm:h-[620px]"
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

        {/* Sélecteur de langue */}
        <div className="rise absolute top-5 right-5 z-20 flex items-center gap-1 bg-neutral-900/80 backdrop-blur rounded-full p-1 border border-neutral-800">
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

        {/* Ticker */}
        <div className="rise absolute bottom-8 left-0 right-0 overflow-hidden" style={{ animationDelay: "700ms" }}>
          <div className="flex whitespace-nowrap ticker-track">
            {[...TICKER_FIGHTERS, ...TICKER_FIGHTERS, ...TICKER_FIGHTERS].map((f, i) => (
              <span key={i} className="mono text-xs text-neutral-600 mx-6 flex items-center gap-2">
                {f.nom} <span className="text-amber-400/60">{f.record}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation vers les sections */}
      <section className="max-w-4xl mx-auto px-5 pb-20 grid sm:grid-cols-3 gap-3">
        <NavCard icon={Trophy} title={t.navCombattants} desc={t.navCardCombattantsDesc} onClick={onEnter} />
        <NavCard icon={Swords} title={t.navSimulateur} desc={t.navCardSimulateurDesc} onClick={onEnter} />
        <NavCard icon={Newspaper} title="Média" desc={t.navCardMediaDesc} onClick={onEnter} disabled comingSoon={t.comingSoon} />
      </section>
    </div>
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
