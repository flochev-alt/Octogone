import { useState, useEffect, useMemo, useRef, Fragment } from "react";
import { Search, X, ChevronLeft, ChevronRight, Trophy, MapPin, Users, Swords, Instagram, Cake, Dumbbell, Medal, CalendarDays } from "lucide-react";
import Simulator from "./Simulator.jsx";
import Landing from "./Landing.jsx";
import Hub from "./Hub.jsx";
import CategoryBar from "./CategoryBar.jsx";
import Media, { eventName } from "./Media.jsx";
import EventPage from "./EventPage.jsx";
import MentionsLegales from "./MentionsLegales.jsx";
import About from "./About.jsx";
import ResultsPopup from "./ResultsPopup.jsx";
import { nextVoteEvent } from "./fans.js";
import ConsentBanner from "./ConsentBanner.jsx";
import { initVip, activateVip } from "./vip.js";
import { useInstall } from "./install.js";
import { useFighters } from "./useFighters.js";
import FighterAvatar, { initialsOf } from "./FighterAvatar.jsx";
import { usePhotos, creditOf } from "./usePhotos.js";
import { RECENT_FIGHTS } from "./recentFights.js";
import { LEAGUES, LEAGUE_FIGHTERS, VACANT } from "./otherLeagues.js";
import { LEGENDS } from "./legends.js";
import { FIGHTERS } from "./fightersData.js";
import { fighterPath, slugFromPath, slugify } from "./slug.js";
import { eventSlug, eventPath, eventSlugFromPath, upcomingEvents, nextFightOf, findFighter } from "./events.js";
import { useMedia } from "./useMedia.js";
import {
  LANGUAGES, T, L, CATEGORY_ORDER, translateCategory, translateMethod, formatStyle,
  formatHeight, formatDate, ageFrom, getInitialLang, setStoredLang,
} from "./i18n.js";

// Comptes Instagram officiels vérifiés manuellement — recherche par nom (pas exhaustif,
// à compléter au fur et à mesure). Un fighter absent de cette liste n'affiche pas la bulle.
const INSTAGRAM = {
  "islam makhachev": "islam_makhachev",
  "alex pereira": "alexpoatanpereira",
  "justin gaethje": "justin_gaethje",
  "ilia topuria": "iliatopuria",
  "alexander volkanovski": "alexvolkanovski",
  "petr yan": "petr_yan",
  "merab dvalishvili": "merab.dvalishvili",
  "alexandre pantoja": "pantoja_oficial",
  "khamzat chimaev": "khamzat_chimaev",
  "sean strickland": "stricklandmma",
  "tom aspinall": "tomaspinallofficial",
  "ciryl gane": "ciryl_gane",
  "jack della maddalena": "jackdellamaddalena",
  "magomed ankalaev": "ankalaev_magomed",
  "kayla harrison": "kaylaharrisonofficial",
  "valentina shevchenko": "bulletvalentina",
  "mackenzie dern": "mackenziedern",
  "julianna pena": "venezuelanvixen",
  "virna jandiroba": "virnajandiroba",
  "khabib nurmagomedov": "khabib_nurmagomedov",
  "conor mcgregor": "thenotoriousmma",
  "georges st-pierre": "georgesstpierre",
};

const getInstagram = (name) => INSTAGRAM[name?.toLowerCase()];

const normName = (n) => n?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ").toLowerCase().trim();
const formatRecord = (v, d, n, nc) => `${v}-${d}-${n}${nc ? ` (${nc} NC)` : ""}`;
// Identifiant de l'API Octagon (slug UFC.com) déduit du nom : "Uroš Medić" -> "uros-medic".
const toSlug = (name) => normName(name).replace(/['.]/g, "").replace(/\s+/g, "-");

// Classement : champion (rang 0), puis 1 à 15, puis les autres combattants (hors top 15) par ordre alphabétique.
const byRank = (a, b) => (a.rang ?? 99) - (b.rang ?? 99) || (a.rang == null && b.rang == null ? a.nom.localeCompare(b.nom) : 0);

// Champions actuels — vérifiés manuellement (recherches croisées), à mettre à jour à chaque changement de titre.
const CHAMPIONS = [
  {
    categorie: "Poids lourd", name: "Ciryl Gane", since: "2026-09-20",
    note: {
      fr: "Champion intérimaire (KO face à Alex Pereira, UFC Freedom 250), promu champion incontesté après l'abandon du titre par Tom Aspinall, blessé à l'œil. Première défense face à Josh Hokit le 14 nov. 2026 (UFC 334).",
      en: "Interim champion (KO over Alex Pereira, UFC Freedom 250), promoted to undisputed champion after Tom Aspinall vacated the title with an eye injury. First defense against Josh Hokit on Nov. 14, 2026 (UFC 334).",
      es: "Campeón interino (KO a Alex Pereira, UFC Freedom 250), ascendido a campeón indiscutible tras la renuncia al título de Tom Aspinall, lesionado en un ojo. Primera defensa ante Josh Hokit el 14 de nov. de 2026 (UFC 334).",
    },
  },
  {
    categorie: "Poids mi-lourd", name: "Carlos Ulberg", since: "2026-04-11",
    note: {
      fr: "KO au 1er round face à Jiří Procházka (UFC 327).",
      en: "First-round KO over Jiří Procházka (UFC 327).",
      es: "KO en el primer asalto ante Jiří Procházka (UFC 327).",
    },
  },
  {
    categorie: "Poids moyen", name: "Sean Strickland", since: "2026-05-09",
    note: {
      fr: "Décision partagée face à Khamzat Chimaev (UFC 328).",
      en: "Split decision over Khamzat Chimaev (UFC 328).",
      es: "Decisión dividida ante Khamzat Chimaev (UFC 328).",
    },
  },
  {
    categorie: "Poids welter", name: "Islam Makhachev", since: "2025-11-15",
    note: {
      fr: "Décision unanime face à Jack Della Maddalena (UFC 322). A défendu son titre face à Ian Machado Garry (UFC 330).",
      en: "Unanimous decision over Jack Della Maddalena (UFC 322). Defended his title against Ian Machado Garry (UFC 330).",
      es: "Decisión unánime ante Jack Della Maddalena (UFC 322). Defendió su título ante Ian Machado Garry (UFC 330).",
    },
  },
  {
    categorie: "Poids leger", name: "Justin Gaethje", since: "2026-06-14",
    note: {
      fr: "TKO au 4e round face à Ilia Topuria (UFC Freedom 250).",
      en: "Fourth-round TKO over Ilia Topuria (UFC Freedom 250).",
      es: "TKO en el cuarto asalto ante Ilia Topuria (UFC Freedom 250).",
    },
  },
  {
    categorie: "Poids plume", name: "Alexander Volkanovski", since: "2025-04-12",
    note: {
      fr: "Décision unanime face à Diego Lopes (UFC 314). A défendu son titre face à Movsar Evloev par TKO au 2e round (UFC 333).",
      en: "Unanimous decision over Diego Lopes (UFC 314). Defended his title against Movsar Evloev by second-round TKO (UFC 333).",
      es: "Decisión unánime ante Diego Lopes (UFC 314). Defendió su título ante Movsar Evloev por TKO en el segundo asalto (UFC 333).",
    },
  },
  {
    categorie: "Poids coq", name: "Petr Yan", since: "2025-12-06",
    note: {
      fr: "Décision unanime face à Merab Dvalishvili (UFC 323). L'a de nouveau battu par décision unanime (UFC 333).",
      en: "Unanimous decision over Merab Dvalishvili (UFC 323). Beat him again by unanimous decision (UFC 333).",
      es: "Decisión unánime ante Merab Dvalishvili (UFC 323). Volvió a vencerle por decisión unánime (UFC 333).",
    },
  },
  {
    categorie: "Poids mouche", name: "Joshua Van", since: "2025-12-06",
    note: {
      fr: "TKO au 1er round face à Alexandre Pantoja (UFC 323). L'a de nouveau battu par décision unanime (UFC 331).",
      en: "First-round TKO over Alexandre Pantoja (UFC 323). Beat him again by unanimous decision (UFC 331).",
      es: "TKO en el primer asalto ante Alexandre Pantoja (UFC 323). Volvió a vencerle por decisión unánime (UFC 331).",
    },
  },
  {
    categorie: "Poids coq feminin", name: "Kayla Harrison", since: "2025-06-07", female: true,
    note: {
      fr: "Soumission face à Julianna Peña (UFC 316). Son combat face à Amanda Nunes, prévu à l'UFC 324, a été reporté (blessure au cou) : il aura lieu le 14 nov. 2026 (UFC 334).",
      en: "Submission win over Julianna Peña (UFC 316). Her fight with Amanda Nunes, planned for UFC 324, was postponed (neck injury): it will take place on Nov. 14, 2026 (UFC 334).",
      es: "Victoria por sumisión ante Julianna Peña (UFC 316). Su combate ante Amanda Nunes, previsto en UFC 324, se aplazó (lesión en el cuello): será el 14 de nov. de 2026 (UFC 334).",
    },
  },
  {
    categorie: "Poids mouche feminin", name: "Natália Silva", since: "2026-10-03", female: true,
    note: {
      fr: "Titre vacant (Valentina Shevchenko blessée) remporté par décision unanime face à Wang Cong (UFC 332).",
      en: "Won the vacant title (Valentina Shevchenko injured) by unanimous decision over Wang Cong (UFC 332).",
      es: "Ganó el título vacante (Valentina Shevchenko lesionada) por decisión unánime ante Wang Cong (UFC 332).",
    },
  },
  {
    categorie: "Poids paille feminin", name: "Mackenzie Dern", since: "2025-10-25", female: true,
    note: {
      fr: "Titre vacant remporté face à Virna Jandiroba (UFC 321). A défendu son titre face à Gillian Robertson (UFC 330).",
      en: "Won the vacant title against Virna Jandiroba (UFC 321). Defended her title against Gillian Robertson (UFC 330).",
      es: "Ganó el título vacante ante Virna Jandiroba (UFC 321). Defendió su título ante Gillian Robertson (UFC 330).",
    },
  },
];


const METHOD_COLOR = {
  "KO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "TKO": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Soumission": "text-sky-400 border-sky-400/30 bg-sky-400/10",
  "Décision": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision unanime": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision partagée": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision majoritaire": "text-neutral-300 border-neutral-700 bg-neutral-800",
  "Décision technique": "text-neutral-300 border-neutral-700 bg-neutral-800",
};

const RESULT_STYLE = {
  V: "bg-emerald-400/15 text-emerald-400",
  D: "bg-rose-400/15 text-rose-400",
  N: "bg-neutral-700/60 text-neutral-300",
  NC: "bg-neutral-700/60 text-neutral-300",
};

const SITE_TITLE = "Octogone — Stats MMA";
const ABOUT_PATH = "/a-propos";
const ABOUT_TITLE = "Qu'est-ce qu'Octogone.space ? | Octogone";
const fighterTitle = (f) => `${f.nom} : bilan, stats et derniers combats | Octogone`;
// Combattant dont l'adresse est /combattant/<slug> (page arrivée depuis Google ou un lien partagé).
const fighterAt = (path) => {
  const slug = slugFromPath(path);
  return slug ? [...FIGHTERS, ...LEAGUE_FIGHTERS].find((f) => slugify(f.nom) === slug) || null : null;
};
const categoryOf = (f) => (f.ligue ? `league:${f.ligue}` : f.categorie);

export default function App() {
  const [linked] = useState(() => fighterAt(window.location.pathname));
  const [linkedEvent] = useState(() => eventSlugFromPath(window.location.pathname));
  const [view, setView] = useState(linked ? "combattants" : linkedEvent ? "evenement" : window.location.pathname === ABOUT_PATH ? "apropos" : "landing");
  // Duel déjà choisi pour le Simulateur (bouton « Simuler un duel » d'une fiche ou d'une page d'événement).
  const [simPreset, setSimPreset] = useState(null);
  const changeView = (v) => { setSimPreset(null); setView(v); };
  // Page d'événement ouverte (/evenement/<slug>) et page d'où l'on vient, pour le bouton retour.
  const [eventOpen, setEventOpen] = useState(linkedEvent);
  const eventFrom = useRef("media");
  // Changement de page animé (accueil → page de choix → section) : un voile noir et un octogone doré
  // couvrent l'écran, la page change dessous, puis le voile s'efface.
  const [veil, setVeil] = useState(null);
  const goTo = (v) => {
    if (veil) return;
    if (v !== "evenement") setSimPreset(null);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      if (v === "combattants") { setCategorie("champions"); setQuery(""); }
      return setView(v);
    }
    setVeil("in");
    setTimeout(() => {
      // On entre dans Combattants par l'onglet Champions.
      if (v === "combattants") { setCategorie("champions"); setQuery(""); }
      setView(v);
      setVeil("out");
    }, 420);
    setTimeout(() => setVeil(null), 900);
  };
  const veilEl = veil && (
    <div aria-hidden="true" className={`page-veil ${veil === "in" ? "veil-in" : "veil-out"}`}>
      <svg className="veil-oct" viewBox="0 0 100 100">
        <polygon points="32,6 68,6 94,32 94,68 68,94 32,94 6,68 6,32" fill="none" stroke="#fbbf24" strokeWidth="3" />
      </svg>
    </div>
  );
  const [lang, setLangState] = useState("fr");
  const t = T[lang];

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  // Appli installée (écran d'accueil) : sur iPhone elle n'a pas la mémoire de Safari, on y propose de saisir le code VIP.
  const isStandalone = typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);
  const askVipCode = async () => {
    const code = window.prompt(t.vipPrompt);
    if (!code) return;
    const ok = await activateVip(code);
    setVip(ok);
    setVipToast(ok ? "on" : "bad");
    setTimeout(() => setVipToast(null), 4000);
  };

  // Accès VIP vérifié dès l'arrivée sur le site (lien octogone.space/?vip=CODE), quelle que soit la page.
  const [vip, setVip] = useState(false);
  const [vipToast, setVipToast] = useState(null);
  useEffect(() => {
    initVip().then(({ vip, tried }) => {
      setVip(vip);
      // La couronne s'affiche à chaque arrivée d'un VIP ; « code incorrect » seulement si un code vient d'être tapé.
      if (vip || tried) {
        setVipToast(vip ? "on" : "bad");
        setTimeout(() => setVipToast(null), 4000);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    setStoredLang(l);
  };

  const [categorie, setCategorie] = useState(linked ? categoryOf(linked) : "champions");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(linked);
  const [closing, setClosing] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const installApp = useInstall();
  const [iosHelp, setIosHelp] = useState(false);

  // Une recherche porte sur toute la base (toutes catégories), sinon on affiche la catégorie choisie.
  const allFighters = useFighters();
  // Photos libres (Wikimedia Commons), chargées seulement sur l'onglet Combattants.
  const photos = usePhotos();
  const photoOf = (f) => (f.photo ? { url: f.photo } : photos[f.nom] || null);
  const categories = useMemo(() => CATEGORY_ORDER.filter((c) => allFighters.some((f) => f.categorie === c)), [allFighters]);
  const searching = query.trim().length >= 2;
  const fighters = useMemo(() => {
    if (searching) {
      const q = normName(query);
      return [...allFighters, ...LEAGUE_FIGHTERS].filter((f) => normName(f.nom).includes(q)).sort(byRank);
    }
    return allFighters.filter((f) => f.categorie === categorie).sort(byRank);
  }, [allFighters, categorie, query, searching]);

  // Onglet d'une autre ligue (PFL, KSW…) : "league:PFL".
  const league = !searching && categorie.startsWith("league:") ? categorie.slice(7) : null;
  const champion = !searching && fighters.find((f) => f.rang === 0);
  const listed = champion ? fighters.filter((f) => f !== champion) : fighters;
  const firstUnranked = searching || categorie === "Legendes" ? -1 : listed.findIndex((f) => f.rang == null);

  const hidePanel = () => {
    setClosing(true);
    setTimeout(() => { setSelected(null); setClosing(false); }, 260);
  };
  // Chaque fiche a sa propre adresse : le bouton retour du téléphone ou du navigateur la referme.
  const openFighter = (f) => {
    setSelected(f);
    if (window.location.pathname !== fighterPath(f)) window.history.pushState({ fighter: true }, "", fighterPath(f));
  };
  const closePanel = () => {
    if (window.history.state?.fighter) window.history.back();
    else {
      hidePanel();
      window.history.replaceState(null, "", view === "evenement" && eventOpen ? `/evenement/${eventOpen}` : "/");
    }
  };
  // Chaque événement a aussi sa propre adresse ; le retour ramène à la page d'où l'on vient.
  const openEvent = (e) => {
    if (view !== "evenement") eventFrom.current = view === "hub" ? "hub" : view === "landing" ? "landing" : view;
    if (selected) hidePanel();
    setEventOpen(eventSlug(e));
    if (window.location.pathname !== eventPath(e)) window.history.pushState({ event: true }, "", eventPath(e));
    if (view === "landing" || view === "hub") goTo("evenement");
    else setView("evenement");
  };
  // Page « Qu'est-ce qu'Octogone.space ? » : sa propre adresse, le retour ramène à la page d'avant.
  const aboutFrom = useRef("landing");
  const media = useMedia();
  const openAbout = () => {
    if (view === "apropos") return;
    aboutFrom.current = view === "mentions" ? "landing" : view;
    if (selected) hidePanel();
    window.history.pushState({ about: true }, "", ABOUT_PATH);
    if (view === "landing" || view === "hub") goTo("apropos");
    else changeView("apropos");
  };
  // Pop-up « Toi contre l'IA » : cartes passées (résultats) et prochain événement ouvert au vote.
  const recapCards = useMemo(() => media.filter((i) => i.type === "recap").map((i) => i.data), [media]);
  const voteEvent = useMemo(() => nextVoteEvent(upcomingEvents(media, Date.now()), Date.now()), [media]);
  const aboutGo = (id) => {
    const events = upcomingEvents(media, Date.now());
    const ev = id === "vote" ? nextVoteEvent(events, Date.now()) || events[0] : events[0];
    if (id === "evenement" || id === "vote") return ev && openEvent(ev);
    if (id === "combattants") { setCategorie("champions"); setQuery(""); }
    changeView(id);
  };
  const leaveEvent = () => {
    if (window.history.state?.event) window.history.back();
    else {
      window.history.replaceState(null, "", "/");
      setView(eventFrom.current);
    }
  };
  // Simulateur prérempli avec ce duel (b facultatif : le Simulateur choisit alors l'adversaire).
  const simulate = (a, b = null) => {
    if (selected) hidePanel();
    window.history.replaceState(null, "", "/");
    setSimPreset({ n: Date.now(), cat: a.categorie, a: a.id, b: b?.id });
    setView("simulateur");
  };
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      const f = fighterAt(path);
      const ev = eventSlugFromPath(path);
      if (f) {
        // Une fiche s'ouvre par-dessus la page en cours (événement, médias...), sinon dans Combattants.
        setView((v) => (v === "landing" || v === "hub" || v === "mentions" ? "combattants" : v));
        setSelected(f);
      } else if (path === ABOUT_PATH) {
        hidePanel();
        setView("apropos");
      } else if (ev) {
        hidePanel();
        setEventOpen(ev);
        setView("evenement");
      } else {
        hidePanel();
        setView((v) => (v === "evenement" ? eventFrom.current : v === "apropos" ? aboutFrom.current : v));
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // En quittant une page d'événement par les onglets, l'adresse revient à l'accueil du site.
  useEffect(() => {
    if (view !== "evenement" && eventSlugFromPath(window.location.pathname)) window.history.replaceState(null, "", "/");
    if (view !== "apropos" && window.location.pathname === ABOUT_PATH) window.history.replaceState(null, "", "/");
  }, [view]);
  useEffect(() => {
    if (selected) document.title = fighterTitle(selected);
    else if (view === "apropos") document.title = ABOUT_TITLE;
    else if (view !== "evenement") document.title = SITE_TITLE;
  }, [selected, view]);
  // Changement de page (« Explorer le site », onglets) : on repart du haut, pas de la position de défilement de l'accueil.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);
  // Données à jour (Supabase) pour la fiche ouverte.
  const shown = selected && (allFighters.find((f) => f.id === selected.id) || selected);

  const banner = (
    <>
    <ResultsPopup cards={recapCards} lang={lang} nextEvent={voteEvent} onNext={openEvent} paused={Boolean(veil) || view === "mentions"} />
    {vipToast && (
      <div role="status" className="fixed z-[60] bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg border bg-neutral-900 border-amber-400/60 text-amber-300 whitespace-nowrap">
        {vipToast === "on" ? t.vipOn : t.vipBad}
      </div>
    )}
    <ConsentBanner
      lang={lang}
      forceOpen={cookiesOpen}
      onClose={() => setCookiesOpen(false)}
      onLegal={() => setView("mentions")}
    />
    </>
  );

  if (view === "landing") {
    return (
      <>
        <Landing
          onEnter={() => goTo("combattants")}
          onExplore={() => goTo("hub")}
          onEnterSimulator={() => goTo("simulateur")}
          onEnterMedia={() => goTo("media")}
          onOpenEvent={openEvent}
          lang={lang}
          setLang={setLang}
          onLegal={() => changeView("mentions")}
          onCookies={() => setCookiesOpen(true)}
          onAbout={openAbout}
        />
        {banner}
        {veilEl}
      </>
    );
  }

  if (view === "hub") {
    return (
      <>
        <Hub onPick={goTo} onHome={() => goTo("landing")} lang={lang} setLang={setLang} onLegal={() => changeView("mentions")} onCookies={() => setCookiesOpen(true)} onAbout={openAbout} />
        {banner}
        {veilEl}
      </>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-neutral-950 text-neutral-50 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .disp { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
        .mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
        ::selection { background: #fbbf24; color: #0a0a0a; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes walkoutIn {
          0% { opacity: 0; transform: scale(1.25) rotate(-2deg); filter: blur(14px); }
          60% { filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes glowPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.15); } }
        @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes panelFlash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
        @keyframes panelShake {
          0%, 40% { transform: translateX(0); }
          48% { transform: translateX(-4px); }
          56% { transform: translateX(4px); }
          64% { transform: translateX(-2px); }
          72%, 100% { transform: translateX(0); }
        }
        .row-rise { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .sheet-enter { animation: sheetIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .sheet-exit { animation: sheetOut 0.26s cubic-bezier(0.4, 0, 1, 1) forwards; }
        .backdrop-enter { animation: backdropIn 0.3s ease forwards; }
        .backdrop-exit { animation: backdropOut 0.26s ease forwards; }
        .walkout { animation: walkoutIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both, panelShake 0.7s ease-out both; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
        .ring-spin { animation: ringSpin 12s linear infinite; }
        .panel-flash { animation: panelFlash 0.45s ease-out forwards; }
        .tap { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s; }
        .tap:active { transform: scale(0.97); }
      `}</style>

      {/* Appli installée sur iPhone : l'en-tête commence sous l'heure et la batterie (safe-area), fond compris. */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 overflow-x-hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          <button onClick={() => changeView("landing")} className="tap flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="disp text-lg tracking-tight">
              <span className="sm:hidden">O</span>
              <span className="hidden sm:inline">OCTOGONE</span>
              <span className="text-amber-400">.</span>
            </span>
          </button>

          <nav className="flex-1 flex items-center justify-center min-w-0">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-neutral-900 rounded-full p-1 border border-neutral-800 max-w-full">
              <button
                onClick={() => changeView("combattants")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "combattants" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navCombattants}
              </button>
              <button
                onClick={() => changeView("simulateur")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "simulateur" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navSimulateur}
              </button>
              <button
                onClick={() => changeView("media")}
                className={`tap text-[10px] sm:text-xs font-semibold px-2 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap ${
                  view === "media" ? "bg-amber-400 text-neutral-950" : "text-neutral-400"
                }`}
              >
                {t.navMedia}
              </button>
            </div>
          </nav>

          {/* Drapeaux : menu déroulant sur mobile, rangée de boutons à partir de sm */}
          <div className="shrink-0">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t.language}
              className="sm:hidden bg-neutral-900 border border-neutral-800 rounded-full text-sm px-2 py-1.5 text-neutral-200 outline-none appearance-none text-center"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag}</option>
              ))}
            </select>
            <div className="hidden sm:flex items-center gap-0.5 bg-neutral-900 rounded-full p-1 border border-neutral-800">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  aria-label={l.label}
                  className={`tap w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                    lang === l.code ? "bg-amber-400/20 ring-1 ring-amber-400/50" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {view === "simulateur" ? (
        <Simulator key={simPreset?.n} lang={lang} vip={vip} preset={simPreset} />
      ) : view === "evenement" ? (
        <EventPage slug={eventOpen} lang={lang} onBack={leaveEvent} onFighter={openFighter} onSimulate={simulate} />
      ) : view === "media" ? (
        <Media lang={lang} onEvent={openEvent} onFighter={openFighter} />
      ) : view === "apropos" ? (
        <About lang={lang} onGo={aboutGo} hasEvent={upcomingEvents(media, Date.now()).length > 0} />
      ) : view === "mentions" ? (
        <MentionsLegales lang={lang} />
      ) : (
        <>
          <main className="w-full max-w-5xl mx-auto px-5 py-8">
            <CategoryBar active={searching ? null : categorie}>
              <button
                data-cat="champions"
                onClick={() => { setCategorie("champions"); setQuery(""); }}
                className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border flex items-center gap-1.5 ${
                  categorie === "champions"
                    ? "bg-amber-400 text-neutral-950 border-amber-400"
                    : "bg-transparent text-amber-400 border-amber-400/40 hover:border-amber-400"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> {t.champions}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  data-cat={c}
                  onClick={() => { setCategorie(c); setQuery(""); }}
                  className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border ${
                    categorie === c && !searching
                      ? "bg-amber-400 text-neutral-950 border-amber-400"
                      : "bg-transparent text-neutral-400 border-neutral-800 hover:border-amber-400/50 hover:text-neutral-50"
                  }`}
                >
                  {translateCategory(c, lang)}
                </button>
              ))}
              <span aria-hidden="true" className="w-px shrink-0 bg-neutral-800 mx-1.5 my-1" />
              {LEAGUES.map((l) => (
                <button
                  key={l.id}
                  data-cat={`league:${l.id}`}
                  onClick={() => { setCategorie(`league:${l.id}`); setQuery(""); }}
                  className={`tap text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap border ${
                    league === l.id
                      ? "bg-neutral-50 text-neutral-950 border-neutral-50"
                      : "bg-transparent text-neutral-300 border-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </CategoryBar>

            {league ? (
              <div>
                <h2 className="disp text-2xl mb-1">{t.leagueChampions(LEAGUES.find((l) => l.id === league)?.name)}</h2>
                <p className="text-xs text-neutral-500 mb-5">
                  {t.otherLeaguesNote} {L(LEAGUES.find((l) => l.id === league)?.note, lang)}
                </p>
                <div key={league} className="grid gap-2 lg:grid-cols-2">
                  {LEAGUE_FIGHTERS.filter((f) => f.ligue === league).map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => openFighter(f)}
                      style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                      className="tap row-rise w-full min-w-0 text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-amber-400/40 px-4 py-3 flex items-center gap-3"
                    >
                      <FighterAvatar name={f.nom} photo={photoOf(f)?.url} size={48} gold />
                      <span className="flex-1 min-w-0 flex flex-col">
                        <span className="mono text-[10px] uppercase tracking-widest text-amber-400 truncate">{translateCategory(f.categorie, lang)}</span>
                        <span className="font-semibold text-[15px] leading-tight break-words">{f.nom}</span>
                        <span className="text-xs text-neutral-400 truncate">{L(f.pays, lang)}</span>
                      </span>
                      <span className="mono text-sm text-neutral-300 shrink-0 text-right">
                        {formatRecord(f.victoires, f.defaites, f.nuls)}
                        {f.nc > 0 && <span className="block text-[10px] text-neutral-500">{f.nc} NC</span>}
                      </span>
                    </button>
                  ))}
                  {VACANT.filter((v) => v.ligue === league).map((v) => (
                    <div key={v.categorie} className="row-rise rounded-2xl border border-dashed border-neutral-800 px-4 py-3 flex flex-col">
                      <span className="mono text-[10px] uppercase tracking-widest text-neutral-500">{translateCategory(v.categorie, lang)} · {t.vacantTitle}</span>
                      <span className="text-sm text-neutral-300 mt-0.5">{t.vacantFight(v.fight, v.event, formatDate(v.date, lang))}</span>
                    </div>
                  ))}
                </div>
                <SearchBox query={query} setQuery={setQuery} t={t} className="mt-6" />
              </div>
            ) : categorie === "champions" && !searching ? (
              <div className="space-y-2">
                {CHAMPIONS.map((c, i) => {
                  const f = allFighters.find((x) => x.nom === c.name);
                  return (
                  <div
                    key={i}
                    style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                    className="row-rise rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 flex items-center gap-4"
                  >
                    {f ? (
                      <FighterAvatar name={c.name} photo={photoOf(f)?.url} size={52} gold />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-amber-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-0.5">{translateCategory(c.categorie, lang)}</div>
                      <div className="disp text-lg truncate">{c.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {t.championSince(formatDate(c.since, lang), c.female)}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{L(c.note, lang)}</div>
                    </div>
                  </div>
                  );
                })}
                <SearchBox query={query} setQuery={setQuery} t={t} className="mt-6" />
              </div>
            ) : (
              <>
                {champion && (
                  <button
                    key={categorie + "-champ"}
                    onClick={() => openFighter(champion)}
                    className="tap row-rise relative overflow-hidden w-full h-56 sm:h-64 text-left mb-6 rounded-2xl border border-amber-400/35 hover:border-amber-400/70 bg-[radial-gradient(circle_at_75%_40%,rgba(251,191,36,0.35),#0a0a0a_65%)]"
                  >
                    {/* Portrait à droite : la photo détourée si on l'a, sinon les initiales en grand */}
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-center">
                      {photoOf(champion) ? (
                        <img src={photoOf(champion).url} alt={champion.nom} onError={(e) => { e.currentTarget.style.display = "none"; }} className="h-full w-full object-cover object-top [mask-image:linear-gradient(to_right,transparent,black_45%)]" />
                      ) : (
                        <span aria-hidden="true" className="disp text-[7rem] sm:text-[8rem] leading-none text-amber-400/25 self-center">{initialsOf(champion.nom)}</span>
                      )}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                    <div className="relative h-full p-5 sm:p-6 flex flex-col justify-center max-w-[65%]">
                      <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-1.5">
                        {t.champion} · {translateCategory(categorie, lang)}
                      </div>
                      <div className="disp text-3xl sm:text-4xl leading-[1.02]">{champion.nom}</div>
                      <div className="mono text-2xl text-amber-400 mt-3 tracking-tight">
                        {formatRecord(champion.victoires, champion.defaites, champion.nuls, champion.nc)}
                      </div>
                      {champion.ko > 0 && <div className="text-xs text-neutral-400 mt-1">{t.koShare(champion.ko)}</div>}
                    </div>
                  </button>
                )}

                <SearchBox query={query} setQuery={setQuery} t={t} className="mb-6" />

                {!searching && listed.some((f) => f.rang != null) && (
                  <p className="mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{t.officialRanking}</p>
                )}
                {searching && fighters.length > 0 && (
                  <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-3">{t.allCategories}</p>
                )}

                {/* Une colonne sur téléphone, deux à partir de l'écran d'ordinateur. */}
                <div key={categorie + query} className="grid gap-2 lg:grid-cols-2">
                  {listed.map((f, i) => (
                    <Fragment key={f.id}>
                      {i === firstUnranked && (
                        <p className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-amber-400/80 pt-5 pb-1 lg:col-span-2">
                          <span>{t.unranked}</span>
                          <span className="h-px flex-1 bg-neutral-800" />
                        </p>
                      )}
                      <button
                        onClick={() => openFighter(f)}
                        style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                        className="tap row-rise w-full min-w-0 text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-amber-400/40 px-4 py-2.5 flex items-center gap-3"
                      >
                        {/* Pas de colonne de classement chez les légendes (aucune n'est classée). */}
                        {(searching || categorie !== "Legendes") && (
                          <span className={`mono text-sm w-6 shrink-0 ${f.rang === 0 || f.rang === 1 ? "text-amber-400" : "text-neutral-500"}`}>
                            {f.rang === 0 ? "C" : f.rang != null ? f.rang : "–"}
                          </span>
                        )}
                        <FighterAvatar name={f.nom} photo={photoOf(f)?.url} size={44} gold={f.rang === 0 || f.rang === 1} />
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="font-semibold text-[15px] leading-tight break-words">{f.nom}</span>
                          <span className="text-xs text-neutral-400 truncate">
                            {searching ? [f.ligue, translateCategory(f.categorie, lang)].filter(Boolean).join(" · ") : formatStyle(f.style, lang)}
                          </span>
                        </span>
                        <span className="mono text-sm text-neutral-300 shrink-0">
                          {`${f.victoires}-${f.defaites}-${f.nuls}`}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>

                {fighters.length === 0 && (
                  <p className="text-sm text-neutral-400">{t.noResults(query)}</p>
                )}
              </>
            )}
          </main>
        </>
      )}

      {shown && view !== "mentions" && (
        <FighterPanel fighter={shown} photo={photoOf(shown)} closing={closing} onClose={closePanel} lang={lang} t={t} onSimulate={simulate} onEvent={openEvent} />
      )}

      <footer className="mt-auto w-full max-w-5xl mx-auto px-5 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-[11px] text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>{t.footer}</span>
        <button onClick={openAbout} className="tap underline hover:text-neutral-300">
          {t.about}
        </button>
        <button onClick={() => changeView("mentions")} className="tap underline hover:text-neutral-300">
          {t.legal}
        </button>
        <button onClick={() => setCookiesOpen(true)} className="tap underline hover:text-neutral-300">
          {t.cookies}
        </button>
        {installApp.mode && (
          <button
            onClick={() => (installApp.mode === "prompt" ? installApp.install() : setIosHelp((v) => !v))}
            className="tap underline text-amber-400/80 hover:text-amber-300"
          >
            {t.installApp}
          </button>
        )}
        {!vip && isStandalone && (
          <button onClick={askVipCode} className="tap underline hover:text-neutral-300">
            {t.vipEnter}
          </button>
        )}
        {iosHelp && installApp.mode === "ios" && <span className="basis-full text-neutral-400">{t.iosInstall}</span>}
      </footer>
      {banner}
    </div>
  );
}

function SearchBox({ query, setQuery, t, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors focus-within:border-amber-400/50 ${className}`}>
      <Search className="w-4 h-4 text-neutral-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-500"
      />
    </div>
  );
}

// Fiche combattant : tout vient de notre base vérifiée (fightersData.js). L'API Octagon ne sert
// plus qu'au lieu de naissance et à la salle d'entraînement, quand elle connaît le combattant.
function FighterPanel({ fighter, photo, onClose, closing, lang, t, onSimulate, onEvent }) {
  const [extra, setExtra] = useState(null);
  const [loading, setLoading] = useState(true);
  // Photo qui ne charge pas : on affiche le médaillon à la place d'un cadre vide.
  const [photoFailed, setPhotoFailed] = useState(null);
  const showPhoto = photo && photoFailed !== photo.url;

  // Autres ligues : pas d'appel à l'API Octagon (elle ne connaît que l'UFC).
  const ligue = fighter.ligue;

  useEffect(() => {
    if (ligue) { setExtra(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setExtra(null);
    fetch(`/api/fighter/${toSlug(fighter.nom)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) { setExtra(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fighter.nom, ligue]);

  const recent = fighter.recent || RECENT_FIGHTS[fighter.id];
  // Prochain combat inscrit sur une carte à venir (fil Média), avec lien vers la page de l'événement.
  const media = useMedia();
  const next = useMemo(() => nextFightOf(fighter.nom, upcomingEvents(media, Date.now())), [fighter.nom, media]);
  // Adversaire du prochain combat, s'il est dans la même catégorie : le Simulateur ouvre directement ce duel.
  const fighters = useFighters();
  const sameCatOpponent = (name) => {
    const o = findFighter(fighters, name);
    return o && o.categorie === fighter.categorie ? o : null;
  };
  const legend = fighter.categorie === "Legendes" ? LEGENDS[fighter.nom] : null;
  const age = ageFrom(fighter.naissance);
  const rankLabel = fighter.rang === 0 ? t.champion : fighter.rang != null ? `#${fighter.rang}` : null;
  const heroRank = ligue ? t.leagueChampion(ligue, fighter.female) : fighter.rang === 0 ? t.champion : fighter.rang != null ? `${lang === "fr" ? "N°" : "#"}${fighter.rang}` : null;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 ${closing ? "backdrop-exit" : "backdrop-enter"}`} onClick={onClose}>
      <div
        className={`bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm lg:max-w-4xl max-h-[85vh] [@media(max-height:500px)]:max-h-[94vh] relative overflow-y-auto lg:overflow-hidden lg:flex ${closing ? "sheet-exit" : "sheet-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sur PC (lg) : portrait à gauche sur toute la hauteur, informations à droite. */}
        <div className="relative h-80 [@media(max-height:500px)]:h-52 lg:h-auto lg:min-h-[560px] lg:w-[42%] lg:shrink-0 overflow-hidden bg-neutral-950 flex items-center justify-center">
          <div className="panel-flash absolute inset-0 bg-white z-10 pointer-events-none" />
          {showPhoto ? (
            <div className="walkout absolute inset-0">
              <img src={photo.url} alt={fighter.nom} onError={() => setPhotoFailed(photo.url)} className="photo-fade w-full h-full object-cover object-top" />
            </div>
          ) : (
            <>
              <div className="glow-pulse absolute w-64 h-64 rounded-full bg-amber-400/30 blur-2xl -translate-y-12 [@media(max-height:500px)]:-translate-y-8 [@media(max-height:500px)]:scale-75" />
              <div className="ring-spin absolute w-44 h-44 rounded-full border-2 border-dashed border-amber-400/25 -translate-y-12 [@media(max-height:500px)]:-translate-y-8 [@media(max-height:500px)]:scale-75" />
              <div className="walkout relative w-32 h-32 -translate-y-12 [@media(max-height:500px)]:-translate-y-8 [@media(max-height:500px)]:scale-75 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                <span className="disp text-5xl text-neutral-950">{initialsOf(fighter.nom)}</span>
              </div>
            </>
          )}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent" />
          <button onClick={onClose} aria-label="Fermer" className="tap lg:hidden absolute top-4 right-4 bg-neutral-950/60 backdrop-blur rounded-full p-1.5 text-neutral-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute left-5 right-5 bottom-4">
            <div className="mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
              {[heroRank, translateCategory(fighter.categorie, lang)].filter(Boolean).join(" · ")}
            </div>
            <div className="flex items-center gap-2">
              <span className="disp text-3xl leading-tight">{fighter.nom}</span>
              {getInstagram(fighter.nom) && (
                <a
                  href={`https://instagram.com/${getInstagram(fighter.nom)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="tap w-7 h-7 rounded-full bg-neutral-800 hover:bg-amber-400/20 flex items-center justify-center shrink-0"
                  aria-label={t.instagramOf(fighter.nom)}
                >
                  <Instagram className="w-3.5 h-3.5 text-neutral-300" />
                </a>
              )}
            </div>
          </div>
        </div>

        <button onClick={onClose} aria-label="Fermer" className="tap hidden lg:flex absolute top-4 right-4 z-20 bg-neutral-800 rounded-full p-1.5 text-neutral-200 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="lg:flex-1 lg:min-w-0 lg:overflow-y-auto lg:max-h-[85vh] lg:pt-12">
        {showPhoto && photo.page && (
          <a href={photo.page} target="_blank" rel="noopener noreferrer" className="block px-5 pt-2 text-[10px] text-neutral-500 hover:text-neutral-300 truncate">
            {t.photoBy} {creditOf(photo)}
          </a>
        )}
        <div className="p-5 space-y-4">
          {next && (
            <button
              onClick={() => onEvent(next.event)}
              className="tap row-rise w-full text-left rounded-xl border border-amber-400/50 bg-amber-400/[0.08] hover:bg-amber-400/15 px-3.5 py-2.5 flex items-center gap-3"
            >
              <CalendarDays className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block mono text-[10px] uppercase tracking-widest text-amber-400">{t.nextFight} · {formatDate(next.event.iso, lang, { day: "numeric", month: "short" })}</span>
                <span className="block text-sm font-semibold text-neutral-100 truncate">{t.nextFightVs(next.opponent)}</span>
                <span className="block text-[11px] text-neutral-400 truncate">{eventName(next.event.name, lang)}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
            </button>
          )}
          <div className={`row-rise grid gap-2 ${ligue ? "grid-cols-2" : "grid-cols-3"}`}>
            <Tile value={formatRecord(fighter.victoires, fighter.defaites, fighter.nuls)} sub={fighter.nc > 0 ? `${fighter.nc} NC` : null} label={t.proRecord} gold />
            {ligue ? (
              <Tile value={age != null ? t.years(age) : null} label={t.age} />
            ) : (
              <>
                <Tile value={formatHeight(fighter.taille, lang)} label={t.height} />
                <Tile value={formatHeight(fighter.allonge, lang)} label={t.reach} />
              </>
            )}
          </div>
          {!ligue && onSimulate && (
            <button
              onClick={() => onSimulate(fighter, next && sameCatOpponent(next.opponent))}
              className="tap row-rise w-full rounded-xl bg-amber-400 text-neutral-950 text-sm font-semibold py-2.5 hover:bg-amber-300 flex items-center justify-center gap-2"
              style={{ animationDelay: "5ms" }}
            >
              <Swords className="w-4 h-4" /> {t.simulateDuel}
            </button>
          )}
          {legend && (
            <div className="row-rise space-y-3" style={{ animationDelay: "10ms" }}>
              <p className="text-sm text-neutral-300 leading-relaxed">{L(legend.bio, lang)}</p>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs uppercase tracking-widest text-neutral-400">{t.palmares}</span>
                </div>
                <ul className="space-y-1.5">
                  {legend.titles.map((x, i) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-200">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{L(x, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-widest text-amber-400 mb-0.5">{t.retirement}</div>
                <div className="text-sm text-neutral-100">{legend.retired ? L(legend.retired, lang) : t.stillActive}</div>
              </div>
            </div>
          )}
          {fighter.victoires > 0 && fighter.ko + fighter.sub + fighter.dec > 0 && (
            <div className="row-rise" style={{ animationDelay: "20ms" }}>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{t.winsBy}</div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-neutral-800">
                <div style={{ width: `${fighter.ko}%` }} className="bg-amber-400" />
                <div style={{ width: `${fighter.sub}%` }} className="bg-amber-700" />
                <div style={{ width: `${fighter.dec}%` }} className="bg-neutral-500" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-neutral-300">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />{translateMethod("KO", lang)} {fighter.ko} %</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-700" />{translateMethod("Soumission", lang)} {fighter.sub} %</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neutral-500" />{translateMethod("Décision", lang)} {fighter.dec} %</span>
              </div>
            </div>
          )}
          <Stat icon={Users} label={t.division} value={translateCategory(fighter.categorie, lang)} delay={40} />
          {fighter.note && <p className="row-rise text-xs text-neutral-400" style={{ animationDelay: "50ms" }}>{L(fighter.note, lang)}</p>}
          <Stat icon={Medal} label={t.ranking} value={ligue ? null : rankLabel} delay={60} />
          <Stat icon={MapPin} label={t.country} value={ligue ? L(fighter.pays, lang) : null} delay={70} />
          <Stat icon={Swords} label={t.ufcRecord} value={fighter.ufcV != null ? formatRecord(fighter.ufcV, fighter.ufcD, fighter.ufcN, fighter.ufcNc) : null} delay={80} />
          <Stat label={t.style} value={formatStyle(fighter.style, lang)} delay={120} />
          <Stat icon={Cake} label={t.age} value={!ligue && age != null ? t.years(age) : null} delay={160} />
          <Stat icon={MapPin} label={t.birthplace} value={extra?.placeOfBirth} delay={200} />
          <Stat icon={Dumbbell} label={t.trainsAt} value={extra?.trainsAt} delay={240} />
          {loading && <p className="text-xs text-neutral-500">{t.loading}</p>}

          {recent && (
            <div className="row-rise pt-2" style={{ animationDelay: "280ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs uppercase tracking-widest text-neutral-400">{t.recentFights}</span>
              </div>
              <div className="space-y-2">
                {recent.map((fight, i) => (
                  <div key={i} style={{ animationDelay: `${320 + i * 40}ms` }} className="row-rise flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <span className={`mono text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${RESULT_STYLE[fight.result]}`}>
                      {{ V: t.win, D: t.loss, N: t.draw, NC: t.noContest }[fight.result]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{fight.opponent}</div>
                      <div className="text-[11px] text-neutral-500">
                        {lang === "fr" ? fight.event : fight.event.replace(" : ", ": ")}
                        {fight.date && ` · ${formatDate(fight.date, lang)}`}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border shrink-0 ${METHOD_COLOR[fight.method] || "text-neutral-300 border-neutral-700"}`}>
                      {translateMethod(fight.method, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

// sub : précision ajoutée à la légende (ex. « 1 NC » sous le bilan), pour ne pas couper la valeur sur téléphone.
function Tile({ value, label, gold = false, sub = null }) {
  return (
    <div className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2.5 min-w-0">
      <div className={`mono tracking-tight truncate ${String(value || "").length > 8 ? "text-sm sm:text-base" : "text-base sm:text-lg"} ${gold ? "text-amber-400" : "text-neutral-100"}`}>
        {value || "–"}
      </div>
      <div className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{sub ? `${label} · ${sub}` : label}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delay = 0 }) {
  if (!value) return null;
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="row-rise flex items-center justify-between gap-4 py-2.5 border-b border-neutral-800 last:border-0">
      <span className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
