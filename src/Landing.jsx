import { useState, useEffect } from "react";
import { ArrowRight, Swords, Trophy, Newspaper } from "lucide-react";

const TICKER_FIGHTERS = [
  { nom: "Islam Makhachev", record: "28-1-0" },
  { nom: "Alex Pereira", record: "13-4-0" },
  { nom: "Tom Aspinall", record: "15-3-0" },
  { nom: "Alexandre Pantoja", record: "30-6-0" },
  { nom: "Justin Gaethje", record: "28-5-0" },
  { nom: "Khamzat Chimaev", record: "15-1-0" },
];

export default function Landing({ onEnter = () => {} }) {
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
        .octo-ring { animation: octoSpin 35s linear infinite; }
        .octo-ring-2 { animation: octoSpin 50s linear infinite reverse; }
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
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
      `}</style>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center">
        {/* Halo central */}
        <div className="glow absolute w-[420px] h-[420px] rounded-full bg-amber-400/20 blur-3xl" />

        {/* Octogone signature */}
        {mounted && (
          <svg
            className="octo-in absolute w-[420px] h-[420px] sm:w-[620px] sm:h-[620px]"
            viewBox="0 0 100 100"
            style={{ animationDelay: "0ms" }}
          >
            <polygon
              className="octo-ring"
              points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
              fill="none"
              stroke="#fbbf24"
              strokeOpacity="0.5"
              strokeWidth="3.4"
              style={{ transformOrigin: "50% 50%" }}
            />
            <polygon
              className="octo-ring-2"
              points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
              fill="none"
              stroke="#fbbf24"
              strokeOpacity="0.22"
              strokeWidth="2"
              transform="scale(0.8)"
              style={{ transformOrigin: "50% 50%" }}
            />
          </svg>
        )}

        <div className="blur-in relative z-10" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="mono text-xs uppercase tracking-[0.2em] text-neutral-400">Stats MMA</span>
          </div>

          <h1 className="disp text-5xl sm:text-7xl leading-[0.95] mb-5">
            ENTREZ DANS
            <br />
            <span className="shimmer-text">L'OCTOGONE.</span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-8">
            Les stats, les duels, les probabilités — tout l'univers UFC passé au crible, sans détour.
          </p>

          <button
            onClick={onEnter}
            className="tap group inline-flex items-center gap-2 bg-amber-400 text-neutral-950 font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-amber-300"
          >
            Explorer le site
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
        <NavCard icon={Trophy} title="Combattants" desc="Classements et fiches détaillées" onClick={onEnter} />
        <NavCard icon={Swords} title="Simulateur" desc="Probabilités de duels par catégorie" onClick={onEnter} />
        <NavCard icon={Newspaper} title="Média" desc="Cartes à venir et actualités" onClick={onEnter} disabled />
      </section>
    </div>
  );
}

function NavCard({ icon: Icon, title, desc, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tap text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-amber-400/40 hover:bg-neutral-800 p-5 disabled:opacity-40 disabled:hover:border-neutral-800 disabled:hover:bg-neutral-900"
    >
      <Icon className="w-5 h-5 text-amber-400 mb-3" />
      <div className="disp text-base mb-1">{title}</div>
      <div className="text-xs text-neutral-500">{disabled ? "Bientôt disponible" : desc}</div>
    </button>
  );
}
