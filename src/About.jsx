import { Trophy, Swords, CalendarDays, Vote, Newspaper, Smartphone, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { FIGHTERS } from "./fightersData.js";
import { LEAGUE_FIGHTERS } from "./otherLeagues.js";

// Page « Qu'est-ce qu'Octogone.space ? » : le site résumé sur une page, avec un bouton vers chaque rubrique.
const EMAIL = "octogone.space@gmail.com";
// Arrondi à la dizaine inférieure : « plus de 260 combattants » reste vrai quand la base grandit.
const COUNT = Math.floor((FIGHTERS.length + LEAGUE_FIGHTERS.length) / 10) * 10;

const CONTENT = {
  fr: {
    kicker: "À propos",
    title: "Qu'est-ce qu'Octogone.space ?",
    intro: `Octogone.space, c'est le site des fans de MMA : les fiches de plus de ${COUNT} combattants, un simulateur de combat avec analyse par l'IA, les cartes des prochains événements et un vote pour battre l'IA. Gratuit, sans compte, en français, en anglais et en espagnol.`,
    features: [
      ["combattants", "Les fiches des combattants", "Bilan, âge, taille, allonge, style, part de KO et de soumissions, et les 5 derniers combats. Tout le top 15 UFC de chaque catégorie, les champions, les autres combattants des prochaines cartes, 15 légendes et les champions PFL, KSW, ARES et Hexagone MMA.", "Voir les combattants"],
      ["simulateur", "Le Simulateur de combat", "Choisis deux combattants : le site calcule les chances de victoire de chacun à partir de leurs stats, puis l'IA écrit une analyse complète du duel (5 analyses gratuites par jour). Tu peux partager ton pronostic en image.", "Lancer le Simulateur"],
      ["evenement", "Les pages d'événement", "Chaque événement UFC a sa page : la carte complète, la date et l'heure, puis les résultats avec la méthode et le round dès la fin des combats.", "Voir le prochain événement"],
      ["vote", "Les fans contre l'IA", "Sur la carte principale du prochain événement, vote pour le combattant que tu vois gagner : ton vote dévoile le pronostic de l'IA et l'avis des autres fans. Après l'événement, le score montre qui a vu juste. Vote anonyme et sans compte.", "Voter maintenant"],
      ["media", "Médias", "Les finishs des main events en vidéo, les grands moments et un peu de trash-talk, tirés des comptes X de l'UFC et des médias MMA.", "Voir les médias"],
      ["app", "L'appli sur ton téléphone", "Octogone.space s'installe comme une appli sur iPhone et Android, sans passer par un store, avec le lien « Installer l'appli » en bas de page.", null],
    ],
    trustTitle: "Des infos vérifiées",
    trust: [
      "Chaque statistique est vérifiée sur au moins 2 sources (ufc-fr.com, UFC.com, Tapology, Wikipédia…). En cas de doute, le site n'affiche rien plutôt qu'une info fausse.",
      "Après chaque événement, les résultats, les bilans et les classements sont mis à jour automatiquement.",
      "Chaque semaine, un contrôle qualité repasse sur les fiches, les cartes et les photos.",
      "Les photos sont toutes sous licence libre, avec leur auteur indiqué.",
    ],
    whoTitle: "Qui est derrière ?",
    who: "Octogone.space est un site de fan, fait par un passionné de MMA. Il est indépendant : il n'est ni affilié ni sponsorisé par l'UFC ou une autre ligue. Les pronostics sont là pour le plaisir, pas pour parier.",
    contact: "Une erreur, une idée ? Écris à",
  },
  en: {
    kicker: "About",
    title: "What is Octogone.space?",
    intro: `Octogone.space is the site for MMA fans: profiles of more than ${COUNT} fighters, a fight simulator with AI analysis, the cards of upcoming events and a vote to beat the AI. Free, no account, in French, English and Spanish.`,
    features: [
      ["combattants", "Fighter profiles", "Record, age, height, reach, style, share of KOs and submissions, and the last 5 fights. The full UFC top 15 of every division, the champions, the other fighters on upcoming cards, 15 legends and the PFL, KSW, ARES and Hexagone MMA champions.", "See the fighters"],
      ["simulateur", "The fight Simulator", "Pick two fighters: the site works out each one's chances from their stats, then the AI writes a full breakdown of the matchup (5 free analyses a day). You can share your pick as an image.", "Open the Simulator"],
      ["evenement", "Event pages", "Every UFC event has its own page: the full card, the date and time, then the results with method and round as soon as the fights are over.", "See the next event"],
      ["vote", "Fans vs AI", "On the main card of the next event, vote for the fighter you think will win: your vote reveals the AI's pick and what other fans think. After the event, the score shows who got it right. Anonymous vote, no account.", "Vote now"],
      ["media", "Media", "Main-event finishes on video, big moments and a bit of trash talk, from the X accounts of the UFC and MMA media.", "See the media"],
      ["app", "The app on your phone", "Octogone.space installs like an app on iPhone and Android, no store needed, with the “Install the app” link at the bottom of the page.", null],
    ],
    trustTitle: "Checked information",
    trust: [
      "Every stat is checked against at least 2 sources (ufc-fr.com, UFC.com, Tapology, Wikipedia…). When in doubt, the site shows nothing rather than wrong info.",
      "After every event, results, records and rankings are updated automatically.",
      "Every week, a quality check goes over the profiles, cards and photos.",
      "All photos are under free licences, with their author credited.",
    ],
    whoTitle: "Who's behind it?",
    who: "Octogone.space is a fan site, made by an MMA enthusiast. It is independent: it is not affiliated with or sponsored by the UFC or any other league. Picks are for fun, not for betting.",
    contact: "Spotted a mistake, got an idea? Write to",
  },
  es: {
    kicker: "Acerca de",
    title: "¿Qué es Octogone.space?",
    intro: `Octogone.space es el sitio de los fans del MMA: las fichas de más de ${COUNT} peleadores, un simulador de combate con análisis de IA, las carteleras de los próximos eventos y una votación para ganarle a la IA. Gratis, sin cuenta, en francés, inglés y español.`,
    features: [
      ["combattants", "Fichas de peleadores", "Récord, edad, altura, alcance, estilo, porcentaje de KO y sumisiones, y las 5 últimas peleas. Todo el top 15 de la UFC en cada categoría, los campeones, los demás peleadores de las próximas carteleras, 15 leyendas y los campeones de PFL, KSW, ARES y Hexagone MMA.", "Ver los peleadores"],
      ["simulateur", "El Simulador de combate", "Elige dos peleadores: el sitio calcula las probabilidades de cada uno a partir de sus estadísticas y luego la IA escribe un análisis completo del duelo (5 análisis gratis al día). Puedes compartir tu pronóstico como imagen.", "Abrir el Simulador"],
      ["evenement", "Páginas de eventos", "Cada evento de la UFC tiene su página: la cartelera completa, la fecha y la hora, y luego los resultados con el método y el asalto en cuanto terminan las peleas.", "Ver el próximo evento"],
      ["vote", "Los fans contra la IA", "En la cartelera principal del próximo evento, vota por el peleador que crees que ganará: tu voto revela el pronóstico de la IA y la opinión de los demás fans. Después del evento, el marcador muestra quién acertó. Voto anónimo y sin cuenta.", "Votar ahora"],
      ["media", "Medios", "Los finales de los main events en vídeo, los grandes momentos y algo de trash talk, de las cuentas de X de la UFC y de medios de MMA.", "Ver los medios"],
      ["app", "La app en tu móvil", "Octogone.space se instala como una app en iPhone y Android, sin pasar por una tienda, con el enlace «Instalar la app» al pie de la página.", null],
    ],
    trustTitle: "Información verificada",
    trust: [
      "Cada estadística se verifica en al menos 2 fuentes (ufc-fr.com, UFC.com, Tapology, Wikipedia…). En caso de duda, el sitio no muestra nada antes que un dato falso.",
      "Después de cada evento, los resultados, récords y clasificaciones se actualizan automáticamente.",
      "Cada semana, un control de calidad revisa las fichas, las carteleras y las fotos.",
      "Todas las fotos tienen licencia libre, con su autor indicado.",
    ],
    whoTitle: "¿Quién está detrás?",
    who: "Octogone.space es un sitio de fans, hecho por un apasionado del MMA. Es independiente: no está afiliado ni patrocinado por la UFC ni por ninguna otra liga. Los pronósticos son para divertirse, no para apostar.",
    contact: "¿Un error, una idea? Escribe a",
  },
};

const ICONS = { combattants: Trophy, simulateur: Swords, evenement: CalendarDays, vote: Vote, media: Newspaper, app: Smartphone };

// onGo(id) : id = combattants | simulateur | evenement | vote | media. Sans prochain événement, les boutons événement et vote sont masqués.
export default function About({ lang = "fr", onGo = () => {}, hasEvent = true }) {
  const c = CONTENT[lang] || CONTENT.fr;
  return (
    <main className="w-full max-w-5xl mx-auto px-5 py-10 sm:py-14">
      <style>{`
        @keyframes aboutRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .about-rise { opacity: 0; animation: aboutRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media (prefers-reduced-motion: reduce) { .about-rise { animation: none; opacity: 1; } }
      `}</style>

      <header className="max-w-2xl mb-10 sm:mb-12">
        <div className="about-rise inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-amber-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {c.kicker}
        </div>
        <h1 className="about-rise disp text-3xl sm:text-5xl leading-[1.02]" style={{ animationDelay: "60ms" }}>{c.title}</h1>
        <p className="about-rise text-neutral-300 text-sm sm:text-base leading-relaxed mt-4" style={{ animationDelay: "120ms" }}>{c.intro}</p>
      </header>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {c.features.map(([id, title, text, cta], i) => {
          const Icon = ICONS[id];
          const showCta = cta && (hasEvent || (id !== "evenement" && id !== "vote"));
          return (
            <section
              key={id}
              style={{ animationDelay: `${180 + i * 70}ms` }}
              className="about-rise rounded-3xl bg-neutral-900/80 border border-neutral-800 p-5 sm:p-6 flex flex-col"
            >
              <span className="relative w-12 h-12 flex items-center justify-center mb-4">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
                  <polygon points="32,6 68,6 94,32 94,68 68,94 32,94 6,68 6,32" className="fill-amber-400/10 stroke-amber-400/60" strokeWidth="4" />
                </svg>
                <Icon className="relative w-5 h-5 text-amber-400" />
              </span>
              <h2 className="disp text-lg sm:text-xl">{title}</h2>
              <p className="text-sm text-neutral-400 leading-relaxed mt-2 flex-1">{text}</p>
              {showCta && (
                <button
                  onClick={() => onGo(id)}
                  className="tap group self-start mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
                >
                  {cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </section>
          );
        })}
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 mt-3 sm:mt-4">
        <section className="rounded-3xl border border-amber-400/30 bg-amber-400/[0.04] p-5 sm:p-6">
          <h2 className="disp text-lg sm:text-xl flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" /> {c.trustTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {c.trust.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm text-neutral-300 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-5 sm:p-6">
          <h2 className="disp text-lg sm:text-xl flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-amber-400" /> {c.whoTitle}
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed mt-3">{c.who}</p>
          <p className="text-sm text-neutral-300 leading-relaxed mt-3">
            {c.contact} <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline break-all">{EMAIL}</a>
          </p>
        </section>
      </div>
    </main>
  );
}
