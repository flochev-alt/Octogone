import { Trophy, Swords, Newspaper, ArrowRight, Info } from "lucide-react";
import { LANGUAGES, T } from "./i18n.js";

// Page de choix, après « Explorer le site » : Combattants, Simulateur ou Médias.
export default function Hub({ onPick, onHome, lang = "fr", setLang = () => {}, onLegal = () => {}, onCookies = () => {}, onContact = () => {}, onAbout = () => {} }) {
  const t = T[lang];
  const sections = [
    { id: "combattants", icon: Trophy, title: t.navCombattants, desc: t.navCardCombattantsDesc },
    { id: "simulateur", icon: Swords, title: t.navSimulateur, desc: t.navCardSimulateurDesc },
    { id: "media", icon: Newspaper, title: t.navMedia, desc: t.navCardMediaDesc },
  ];
  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-neutral-950 text-neutral-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .disp { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
        @keyframes hubRise { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        .hub-rise { opacity: 0; animation: hubRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes hubSpin { to { transform: rotate(360deg); } }
        .hub-spin { animation: hubSpin 60s linear infinite; }
        .hub-card::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
          background: linear-gradient(135deg, rgba(251,191,36,0.7), rgba(251,191,36,0) 45%, rgba(251,191,36,0) 60%, rgba(251,191,36,0.45));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.35; transition: opacity 0.3s;
        }
        .hub-card:hover::before, .hub-card:focus-visible::before { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .hub-rise { animation: none; opacity: 1; } .hub-spin { animation: none; } }
      `}</style>

      {/* Décor : halo doré et grand octogone qui tourne lentement */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[36rem] h-[36rem] rounded-full bg-amber-400/10 blur-3xl" />
        <svg className="hub-spin absolute w-[44rem] h-[44rem] opacity-[0.07]" viewBox="0 0 100 100">
          <polygon points="32,4 68,4 96,32 96,68 68,96 32,96 4,68 4,32" fill="none" stroke="#fbbf24" strokeWidth="0.6" />
          <polygon points="35,14 65,14 86,35 86,65 65,86 35,86 14,65 14,35" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Appli installée sur iPhone : le haut de page passe sous l'heure et la batterie, on décale d'autant (safe-area). */}
      <header className="relative z-10 flex items-center justify-between pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[calc(1.25rem_+_env(safe-area-inset-top))]">
        <button onClick={onHome} aria-label="Octogone" className="tap h-12 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="disp text-lg tracking-tight">OCTOGONE<span className="text-amber-400">.</span></span>
        </button>
        <div className="flex items-center gap-1 bg-neutral-900/80 backdrop-blur rounded-full p-1 border border-neutral-800">
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
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-5 py-10 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-12">
          <div className="hub-rise inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-amber-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Octogone
          </div>
          <h1 className="hub-rise disp text-4xl sm:text-6xl leading-[0.95]" style={{ animationDelay: "80ms" }}>
            {t.hubTitle}
          </h1>
          <p className="hub-rise text-neutral-400 text-sm sm:text-base mt-4" style={{ animationDelay: "140ms" }}>
            {t.hubSubtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          {sections.map(({ id, icon: Icon, title, desc }, i) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              style={{ animationDelay: `${220 + i * 90}ms` }}
              className="hub-rise hub-card tap group relative text-left rounded-3xl bg-neutral-900/80 backdrop-blur border border-neutral-800 hover:bg-neutral-900 p-5 sm:p-7 flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 sm:min-h-[260px]"
            >
              <span className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center sm:mb-auto">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
                  <polygon points="32,6 68,6 94,32 94,68 68,94 32,94 6,68 6,32" className="fill-amber-400/10 stroke-amber-400/60 group-hover:fill-amber-400/20 transition-colors" strokeWidth="4" />
                </svg>
                <Icon className="relative w-6 h-6 text-amber-400" />
              </span>
              <span className="flex-1 min-w-0 sm:flex-none sm:mt-8">
                <span className="disp block text-xl sm:text-2xl">{title}</span>
                <span className="block text-xs sm:text-sm text-neutral-400 mt-1">{desc}</span>
              </span>
              <span className="shrink-0 w-9 h-9 rounded-full border border-neutral-700 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors sm:mt-6">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onAbout}
          style={{ animationDelay: "520ms" }}
          className="hub-rise tap self-center mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur px-4 py-2.5 text-sm text-neutral-300 hover:text-amber-300 hover:border-amber-400/50"
        >
          <Info className="w-4 h-4 text-amber-400" /> {t.aboutCta}
        </button>
      </main>
      {/* Mentions légales et cookies accessibles depuis chaque page (LCEN, CNIL). */}
      <div className="relative z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-wrap justify-center gap-x-4 gap-y-1 px-4 text-[11px] text-neutral-600">
        <button onClick={onAbout} className="tap underline hover:text-neutral-300">{t.about}</button>
        <button onClick={onLegal} className="tap underline hover:text-neutral-300">{t.legal}</button>
        <button onClick={onCookies} className="tap underline hover:text-neutral-300">{t.cookies}</button>
        <button onClick={onContact} className="tap underline hover:text-neutral-300">{t.contact}</button>
      </div>
    </div>
  );
}
