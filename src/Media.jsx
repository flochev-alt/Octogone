import { useState, useMemo } from "react";
import { Newspaper, Calendar, MapPin, CheckCircle2, Search } from "lucide-react";

// Données vérifiées manuellement (recherches web) — à mettre à jour au fil des events.
// Chaque élément a une vraie date ISO : le tri chronologique est automatique (plus de risque d'erreur manuelle).
export const UPCOMING = [
  {
    iso: "2026-09-05",
    date: "5 septembre 2026",
    name: "UFC Paris",
    location: "Accor Arena, Paris, France",
    main: "Salahdine Parnasse vs. Dan Hooker (poids léger) — main event",
    note: "Grosse nouvelle : signature officielle de Salahdine Parnasse à l'UFC, annoncée le 24 juillet 2026. Double champion KSW (poids plume et poids léger), il fait ses débuts directement en main event, devant son public.",
    fighters: ["Salahdine Parnasse", "Dan Hooker"],
    highlight: true,
    badge: "Grande signature",
  },
  {
    iso: "2026-08-29",
    date: "29 août 2026",
    name: "UFC Fight Night : Nurmagomedov vs. Song",
    location: "Oriental Sports Center, Shanghai, Chine",
    main: "Umar Nurmagomedov vs. Song Yadong (poids coq)",
    fighters: ["Umar Nurmagomedov", "Song Yadong"],
  },
  {
    iso: "2026-08-22",
    date: "22 août 2026",
    name: "UFC Fight Night : Hernandez vs. Rodrigues",
    location: "À confirmer",
    main: "Carte complète en cours d'officialisation",
    fighters: ["Hernandez", "Rodrigues"],
  },
  {
    iso: "2026-08-15",
    date: "15 août 2026",
    name: "UFC 330",
    location: "Xfinity Mobile Arena, Philadelphie",
    main: "Islam Makhachev vs. Ian Machado Garry — titre des poids welters",
    note: "Co-main event : Mackenzie Dern vs. Gillian Robertson, titre des poids paille féminins. Retour de l'UFC à Philadelphie pour la première fois en 15 ans.",
    fighters: ["Islam Makhachev", "Ian Machado Garry"],
    highlight: true,
  },
  {
    iso: "2026-08-08",
    date: "8 août 2026",
    name: "UFC Fight Night : Gamrot vs. Salkilld",
    location: "À confirmer",
    main: "Mateusz Gamrot vs. Quillan Salkilld",
    fighters: ["Mateusz Gamrot", "Quillan Salkilld"],
  },
  {
    iso: "2026-08-01",
    date: "1 août 2026",
    name: "UFC Fight Night : Medić vs. Rodriguez",
    location: "Belgrade Arena, Serbie",
    main: "Uroš Medić vs. Danny Rodriguez (poids welter)",
    note: "Premier événement UFC de l'histoire organisé en Serbie.",
    fighters: ["Uroš Medić", "Danny Rodriguez"],
  },
];

const RECENT_CARDS = [
  {
    iso: "2026-07-25",
    date: "25 juillet 2026",
    name: "UFC Fight Night : Ankalaev vs. Guskov",
    location: "Etihad Arena, Abu Dhabi",
    results: [
      { fight: "Magomed Ankalaev def. Bogdan Guskov", method: "TKO", note: "Main event · R5, 2:41" },
      { fight: "Ramazan Temirov def. Steve Erceg", method: "KO", note: "Co-main event · R1, 4:21" },
      { fight: "Valter Walker def. Thomas Petersen", method: "Soumission", note: "R1, 1:32 — calf slicer" },
      { fight: "Muhammad Saidov def. Dustin Jacoby", method: "TKO", note: "R2, 4:49" },
    ],
    note: "Main event jugé très terne par la critique (4 rounds peu actifs avant la finition) — Ankalaev en a depuis rejeté la responsabilité sur le manque d'engagement de Guskov.",
    youtubeId: "MuzKpJzL_TY",
  },
  {
    iso: "2026-07-18",
    date: "18 juillet 2026",
    name: "UFC Fight Night 281 : Du Plessis vs. Usman",
    location: "Paycom Center, Oklahoma City",
    results: [
      { fight: "Dricus Du Plessis def. Kamaru Usman", method: "Décision unanime", note: "Main event" },
      { fight: "Christian Leroy Duncan def. Jared Cannonier", method: "Décision unanime", note: "Co-main event" },
      { fight: "Chase Hooper def. Mitch Ramirez", method: "Soumission", note: "R1, 2:15" },
      { fight: "RJ Harris def. Alvin Hines", method: "TKO", note: "R1, 1:40" },
    ],
  },
];

const REACTIONS = [
  {
    iso: "2026-07-19",
    author: "Kelvin Gastelum",
    handle: "@KelvinGastelum",
    date: "19 juil. 2026",
    text: "\"I got USMAN by tko in the 3rd rd.\"",
    context: "Pronostic lancé avant le combat principal — qui ne s'est pas réalisé.",
  },
  {
    iso: "2026-07-19",
    author: "Communauté MMA",
    handle: null,
    date: "19 juil. 2026",
    text: null,
    summary: "De nombreux fans et combattants ont salué la démonstration de Du Plessis, certains y voyant déjà un argument pour un troisième affrontement face au champion Sean Strickland, qu'il a déjà battu deux fois.",
  },
  {
    iso: "2026-07-27",
    author: "Dan Hooker",
    handle: "@thehangmanmma",
    date: "27 juil. 2026",
    text: null,
    summary: "Hooker affirme avoir reçu une vague de menaces de mort de la part de fans de Parnasse depuis l'annonce du combat, qu'il juge disproportionnée par rapport à ce qu'il avait connu face à d'autres adversaires français. Il assume pleinement son rôle de trouble-fête pour cette affiche, expliquant vouloir gâcher les débuts UFC très attendus de Parnasse devant son public.",
    context: "Interview accordée à Submission Radio, à l'approche de leur combat du 5 septembre à l'UFC Paris.",
  },
];

// Non daté par nature (échanges repris sans date précise assignée) — toujours affiché en fin de fil.
const TRASH_TALK = [
  {
    a: "Khamzat Chimaev",
    b: "Sean Strickland",
    date: "Avant UFC 312",
    summary: "Chimaev a publiquement accusé Strickland d'\"avoir peur\" de lui, en réponse à des propos jugés méprisants de l'Américain à son sujet. Strickland avait qualifié la réaction d'un autre combattant de \"lâche\" sur le même sujet.",
  },
  {
    a: "Islam Makhachev",
    b: "Justin Gaethje",
    date: "Sur X",
    summary: "Gaethje avait publiquement défié Makhachev à coups de pied à la tête, comparant leurs styles. Le champion avait répondu avec calme qu'il savait faire \"bien plus que donner des coups de pied\", tout en conseillant à Gaethje de rester prudent.",
  },
];

// Carte complète du jour (Ankalaev vs Guskov), pour recréer l'affiche façon UFC avec nos propres badges.
const TONIGHT_POSTER = {
  title: "UFC FIGHT NIGHT",
  date: "25 JUILLET · SAMEDI",
  mainCard: [
    { a: "Magomed Ankalaev", flagA: "🇷🇺", b: "Bogdan Guskov", flagB: "🇺🇿", weight: "Poids mi-lourd" },
    { a: "Robert Erceg", flagA: "🇦🇺", b: "Shamil Temirov", flagB: "🇺🇿", weight: "Poids mouche" },
    { a: "Ruslan Dulatov", flagA: "🇹🇷", b: "Chris Turman", flagB: "🇧🇷", weight: "Poids welter" },
    { a: "Said Zaynukov", flagA: "🇷🇺", b: "Filip Rzepecki", flagB: "🇵🇱", weight: "Poids léger" },
    { a: "Rustam Kuniev", flagA: "🇷🇺", b: "Chris Fortune", flagB: "🇺🇸", weight: "Poids lourd" },
    { a: "Rizvan Vagaev", flagA: "🇷🇺", b: "Muslim Izagakhmaev", flagB: "🇷🇺", weight: "Poids welter" },
  ],
  prelims: [
    { a: "Justin Walker", flagA: "🇧🇷", b: "Jamal Petersen", flagB: "🇺🇸", weight: "Poids lourd" },
    { a: "Sedriques Jacoby", flagA: "🇺🇸", b: "Said Saidov", flagB: "🇷🇺", weight: "Poids mi-lourd" },
    { a: "Santiago Ponzinibbio", flagA: "🇦🇷", b: "Nathaniel Patterson", flagB: "🏴", weight: "Poids welter" },
    { a: "Elves Brener Bonfim", flagA: "🇧🇷", b: "Fares Sola", flagB: "🇫🇷", weight: "Poids léger" },
    { a: "Ibragim Tuchalov", flagA: "🇷🇺", b: "Robert Ribeiro", flagB: "🇧🇷", weight: "Poids mi-lourd" },
    { a: "Muhammadjon Aliev", flagA: "🇹🇯", b: "Trey Davis", flagB: "🇺🇸", weight: "Poids léger" },
    { a: "Nathan Gibson", flagA: "🇺🇸", b: "Ali Hussein", flagB: "🇫🇮", weight: "Poids coq" },
  ],
};

// Fil unique, trié automatiquement par date décroissante (le plus lointain/récent en haut).
const FEED = [
  ...UPCOMING.map((c) => ({ type: "upcoming", iso: c.iso, data: c })),
  ...RECENT_CARDS.map((c) => ({ type: "recap", iso: c.iso, data: c })),
  ...REACTIONS.map((r) => ({ type: "reaction", iso: r.iso, data: r })),
].sort((a, b) => (a.iso < b.iso ? 1 : -1));

function FighterSlot({ name, flag, align }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(-2).toUpperCase();
  return (
    <div className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 font-bold text-[10px] text-neutral-300">
        {initials}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-neutral-200 truncate">{name}</div>
      </div>
      <span className="text-xs shrink-0">{flag}</span>
    </div>
  );
}

function FightRow({ f, n }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="mono text-[9px] text-neutral-600 w-4 shrink-0">{n}</span>
      <div className="flex-1 min-w-0"><FighterSlot name={f.a} flag={f.flagA} /></div>
      <div className="text-center shrink-0 w-9">
        <div className="text-amber-400 text-[9px] font-bold">VS</div>
      </div>
      <div className="flex-1 min-w-0"><FighterSlot name={f.b} flag={f.flagB} align="right" /></div>
    </div>
  );
}

function FightPoster({ data }) {
  return (
    <div className="mt-3 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-4 py-3">
      <div className="text-center mb-2">
        <div className="disp text-base">
          {data.title.split(" ")[0]} <span className="text-amber-400">{data.title.split(" ").slice(1).join(" ")}</span>
        </div>
        <div className="text-[9px] uppercase tracking-widest text-neutral-500">Main Card</div>
      </div>
      <div className="divide-y divide-neutral-800/60">
        {data.mainCard.map((f, i) => <FightRow key={i} f={f} n={i + 1} />)}
      </div>
      <div className="text-center text-[9px] font-bold tracking-widest bg-neutral-800 text-neutral-300 rounded-full py-1 my-3">
        PRELIMS
      </div>
      <div className="divide-y divide-neutral-800/60">
        {data.prelims.map((f, i) => <FightRow key={i} f={f} n={data.mainCard.length + i + 1} />)}
      </div>
      <div className="text-center text-xs font-bold tracking-widest bg-amber-400 text-neutral-950 rounded-full py-1.5 mt-3">
        {data.date}
      </div>
    </div>
  );
}

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
  const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex -space-x-2 shrink-0">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[10px] border-2 border-neutral-950 ${
        highlight ? "bg-amber-400 text-neutral-950" : "bg-neutral-800 text-neutral-300"
      }`}>
        {initials(fighters[0])}
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[10px] border-2 border-neutral-950 ${
        highlight ? "bg-amber-300 text-neutral-950" : "bg-neutral-700 text-neutral-300"
      }`}>
        {initials(fighters[1])}
      </div>
    </div>
  );
}

function Post({ children }) {
  return (
    <div className="border-b border-neutral-800 px-5 py-4 hover:bg-neutral-900/40 transition-colors">
      {children}
    </div>
  );
}

function UpcomingPost({ c }) {
  return (
    <div className="flex gap-3">
      <FightersBadges fighters={c.fighters} highlight={c.highlight} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">UFC</span>
          <span className="text-neutral-500 text-xs">@ufc</span>
          <span className="text-neutral-600 text-xs">· {c.date}</span>
          {c.highlight && (
            <span className="ml-1 text-[10px] font-semibold text-amber-400 border border-amber-400/40 rounded-full px-2 py-0.5">{c.badge || "Combat pour le titre"}</span>
          )}
        </div>
        <div className="disp text-base mt-1">{c.name}</div>
        <div className="text-sm text-neutral-200 mt-1">{c.main}</div>
        {c.note && <div className="text-xs text-neutral-500 mt-1">{c.note}</div>}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2">
          <MapPin className="w-3 h-3" /> {c.location}
          <CheckCircle2 className="w-3 h-3 text-amber-400 ml-2" /> Officiel
        </div>
        {c.showPoster && <FightPoster data={TONIGHT_POSTER} />}
      </div>
    </div>
  );
}

function RecapPost({ card }) {
  return (
    <div className="flex gap-3">
      <Avatar label="UFC" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">UFC</span>
          <span className="text-neutral-500 text-xs">@ufc</span>
          <span className="text-neutral-600 text-xs">· {card.date}</span>
        </div>
        <div className="disp text-base mt-1">{card.name}</div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 mb-3">
          <MapPin className="w-3 h-3" /> {card.location}
        </div>
        <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3">
          {card.results.map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-xs border-t border-neutral-800 pt-2 first:border-0 first:pt-0">
              <div>
                <div className="text-neutral-200">{r.fight}</div>
                <div className="text-neutral-500">{r.note}</div>
              </div>
              <span className="font-semibold text-amber-400 shrink-0 whitespace-nowrap">{r.method}</span>
            </div>
          ))}
        </div>
        {card.note && <div className="text-xs text-neutral-500 mt-2">{card.note}</div>}
        {card.youtubeId && (
          <div className="mt-3 rounded-xl overflow-hidden border border-neutral-800 aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${card.youtubeId}`}
              title={`${card.name} — highlights`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ReactionPost({ r }) {
  return (
    <div className="flex gap-3">
      <Avatar label={r.author.split(" ").map((w) => w[0]).join("").slice(0, 2)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-neutral-100">{r.author}</span>
          {r.handle && <span className="text-neutral-500 text-xs">{r.handle}</span>}
          <span className="text-neutral-600 text-xs">· {r.date}</span>
        </div>
        {r.text && <p className="text-sm text-neutral-200 mt-1">{r.text}</p>}
        {r.summary && <p className="text-sm text-neutral-300 mt-1">{r.summary}</p>}
        <div className="text-xs text-neutral-500 mt-1.5">{r.context}</div>
      </div>
    </div>
  );
}

// Fonction de recherche : concatène tous les champs texte pertinents d'un item pour le filtrage.
function searchTextFor(item) {
  if (item.type === "upcoming") {
    const c = item.data;
    return [c.name, c.main, c.note, c.location, ...(c.fighters || [])].filter(Boolean).join(" ").toLowerCase();
  }
  if (item.type === "recap") {
    const c = item.data;
    return [c.name, c.location, ...c.results.map((r) => `${r.fight} ${r.method} ${r.note}`)].filter(Boolean).join(" ").toLowerCase();
  }
  if (item.type === "reaction") {
    const r = item.data;
    return [r.author, r.text, r.summary, r.context].filter(Boolean).join(" ").toLowerCase();
  }
  return "";
}

export default function Media() {
  const [query, setQuery] = useState("");

  const filteredFeed = useMemo(() => {
    if (!query.trim()) return FEED;
    const q = query.toLowerCase();
    return FEED.filter((item) => searchTextFor(item).includes(q));
  }, [query]);

  const filteredTrashTalk = useMemo(() => {
    if (!query.trim()) return TRASH_TALK;
    const q = query.toLowerCase();
    return TRASH_TALK.filter((tt) =>
      [tt.a, tt.b, tt.summary].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const noResults = filteredFeed.length === 0 && filteredTrashTalk.length === 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="row-rise flex items-center gap-2 px-5 py-6">
        <Newspaper className="w-4 h-4 text-amber-400" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">Média — fil d'actualité</span>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors focus-within:border-amber-400/50">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par mot-clé (combattant, événement, ville...)"
            className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="border-t border-neutral-800">
        {filteredFeed.map((item, i) => (
          <Post key={`${item.type}-${i}`}>
            {item.type === "upcoming" && <UpcomingPost c={item.data} />}
            {item.type === "recap" && <RecapPost card={item.data} />}
            {item.type === "reaction" && <ReactionPost r={item.data} />}
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
                  <span className="text-neutral-600 text-xs">· {tt.date}</span>
                </div>
                <p className="text-sm text-neutral-300 mt-1.5 leading-relaxed">{tt.summary}</p>
              </div>
            </div>
          </Post>
        ))}

        {noResults && (
          <p className="text-sm text-neutral-400 px-5 py-6">Aucun résultat pour « {query} ».</p>
        )}
      </div>

      <p className="text-[11px] text-neutral-600 px-5 py-6">
        Contenu reformulé à partir de sources publiques (UFC.com, réseaux sociaux des combattants) — pas de citation intégrale de tweets.
      </p>
    </div>
  );
}
