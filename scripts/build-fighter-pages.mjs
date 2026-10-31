// Après « vite build » : une page HTML par combattant (dist/combattant/<slug>.html) et par événement
// (dist/evenement/<slug>.html), lisibles par Google sans JavaScript (titre, description, bilan, stats,
// 5 derniers combats / carte complète ou résultats), puis sitemap.xml et robots.txt.
// Le site React se charge ensuite par-dessus et ouvre la fiche du combattant.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";
import { LEAGUE_FIGHTERS, LEAGUES } from "../src/otherLeagues.js";
import { RECENT_FIGHTS } from "../src/recentFights.js";
import { LEGENDS } from "../src/legends.js";
import { translateCategory, translateMethod, formatDate, ageFrom, formatStyle, L } from "../src/i18n.js";
import { slugify } from "../src/slug.js";
import { UPCOMING, RECENT_CARDS } from "../src/mediaData.js";
import { eventSlug, cardOf, findFighter, resultSides, nextFightOf } from "../src/events.js";

const SITE = "https://octogone.space";
const template = readFileSync("dist/index.html", "utf8");
const photos = JSON.parse(readFileSync("public/photos.json", "utf8"));
const all = [...FIGHTERS, ...LEAGUE_FIGHTERS];
const now = new Date().toISOString().slice(0, 10);
const upcoming = UPCOMING.filter((e) => e.iso >= now).sort((a, b) => a.iso.localeCompare(b.iso));
const events = [...UPCOMING, ...RECENT_CARDS];

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const record = (f) => `${f.victoires}-${f.defaites}-${f.nuls}${f.nc ? ` (${f.nc} NC)` : ""}`;
const leagueName = (f) => (f.ligue ? LEAGUES.find((l) => l.id === f.ligue)?.name || f.ligue : "UFC");
const category = (f) => translateCategory(f.categorie, "fr");
const female = (f) => f.female || f.categorie.endsWith("feminin");

function status(f) {
  if (f.categorie === "Legendes") return "Légende du MMA";
  if (f.rang === 0) return `Champion${female(f) ? "ne" : ""} ${leagueName(f)} des ${category(f).toLowerCase()}`;
  if (f.rang) return `N°${f.rang} du classement UFC des ${category(f).toLowerCase()}`;
  return `${category(f)} (${leagueName(f)})`;
}

function description(f) {
  const parts = [`${f.nom} : ${status(f)}`, `bilan ${record(f)}`];
  if (f.ko != null) parts.push(`${f.ko} % de victoires par KO, ${f.sub} % par soumission`);
  return `${parts.join(", ")}. Stats, âge et 5 derniers combats sur Octogone.`;
}

function body(f) {
  const recent = f.recent || RECENT_FIGHTS[f.id] || [];
  const legend = f.categorie === "Legendes" ? LEGENDS[f.nom] : null;
  const age = ageFrom(f.naissance);
  const facts = [
    ["Bilan", record(f)],
    f.ufcV != null && ["Bilan UFC", `${f.ufcV}-${f.ufcD}-${f.ufcN}`],
    age && ["Âge", `${age} ans`],
    f.naissance && ["Date de naissance", formatDate(f.naissance, "fr")],
    f.pays && ["Pays", L(f.pays, "fr")],
    f.taille && ["Taille", `${f.taille} cm`],
    f.allonge && ["Allonge", `${f.allonge} cm`],
    f.style?.length && ["Style", formatStyle(f.style, "fr")],
    f.ko != null && ["Victoires par KO", `${f.ko} %`],
    f.sub != null && ["Victoires par soumission", `${f.sub} %`],
    f.dec != null && ["Victoires à la décision", `${f.dec} %`],
    f.striking != null && ["Précision des frappes", `${f.striking} %`],
    f.tdDef != null && ["Défense de lutte", `${f.tdDef} %`],
  ].filter(Boolean);
  const next = nextFightOf(f.nom, upcoming);
  const peers = all.filter((p) => p !== f && p.categorie === f.categorie && (p.ligue || "UFC") === (f.ligue || "UFC")).slice(0, 15);
  return `<main style="max-width:720px;margin:0 auto;padding:24px 16px;color:#f5f5f5;font-family:Inter,system-ui,sans-serif;line-height:1.5">
<p><a href="/" style="color:#fbbf24">Octogone</a> › ${esc(category(f))}</p>
<h1 style="font-size:2rem;margin:8px 0">${esc(f.nom)}</h1>
<p style="color:#fbbf24">${esc(status(f))}</p>
${f.note ? `<p>${esc(L(f.note, "fr"))}</p>` : ""}
${legend ? `<p>${esc(L(legend.bio, "fr"))}</p>` : ""}
<dl>${facts.map(([k, v]) => `<dt style="color:#a3a3a3">${esc(k)}</dt><dd style="margin:0 0 8px">${esc(v)}</dd>`).join("")}</dl>
${next ? `<p>Prochain combat : contre ${esc(next.opponent)}, <a href="/evenement/${eventSlug(next.event)}" style="color:#fbbf24">${esc(next.event.name)}</a> (${formatDate(next.event.iso, "fr")})</p>` : ""}
${legend?.titles?.length ? `<h2>Palmarès</h2><ul>${legend.titles.map((t) => `<li>${esc(L(t, "fr"))}</li>`).join("")}</ul>` : ""}
${legend ? `<h2>Retraite</h2><p>${esc(legend.retired ? L(legend.retired, "fr") : "Toujours en activité")}</p>` : ""}
${recent.length ? `<h2>5 derniers combats</h2><ol>${recent.map((r) => `<li>${{ V: "Victoire", D: "Défaite", N: "Match nul", NC: "Sans décision" }[r.result] || esc(r.result)} contre ${esc(r.opponent)}, ${esc(translateMethod(r.method, "fr"))}${r.event ? ` (${esc(r.event)}${r.date ? `, ${formatDate(r.date, "fr")}` : ""})` : ""}</li>`).join("")}</ol>` : ""}
${peers.length ? `<h2>Autres combattants : ${esc(category(f))}</h2><ul>${peers.map((p) => `<li><a href="/combattant/${slugify(p.nom)}" style="color:#fbbf24">${esc(p.nom)}</a></li>`).join("")}</ul>` : ""}
</main>`;
}

function fill(head, html) {
  return template
    .replace(/<meta name="description"[^>]*>\s*/, "")
    .replace(/<link rel="canonical"[^>]*>\s*/, "")
    // On retire l'aperçu de la page d'accueil (og:/twitter:) avant de mettre celui de la page.
    .replace(/<!-- Aperçu du lien[^>]*-->\s*/, "")
    .replace(/<meta (?:property="og:|name="twitter:)[^>]*>\s*/g, "")
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

function page(f) {
  const url = `${SITE}/combattant/${slugify(f.nom)}`;
  const title = `${f.nom} : bilan, stats et derniers combats | Octogone`;
  const desc = description(f);
  const img = photos[f.nom]?.url;
  const ld = {
    "@context": "https://schema.org", "@type": "Person", name: f.nom, url, description: desc,
    ...(f.naissance && { birthDate: f.naissance }), ...(f.pays && { nationality: L(f.pays, "fr") }),
    ...(f.taille && { height: `${f.taille} cm` }), ...(img && { image: img }),
  };
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="Octogone" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    // Avec photo : petite vignette carrée ; sans photo : la grande image du site.
    `<meta property="og:image" content="${esc(img || `${SITE}/og-image.jpg`)}" />`,
    `<meta name="twitter:card" content="${img ? "summary" : "summary_large_image"}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(img || `${SITE}/og-image.jpg`)}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
  return fill(head, body(f));
}

// --- Pages d'événement ---
const fighterLink = (name) => {
  const f = findFighter(all, name);
  return f ? `<a href="/combattant/${slugify(f.nom)}" style="color:#fbbf24">${esc(name)}</a>` : esc(name);
};
const PARTS = { main: "Carte principale", prelims: "Préliminaires", early: "Early prelims" };

function eventBody(e, past) {
  const card = past ? [] : cardOf(e);
  const sections = Object.entries(PARTS).map(([part, label]) => {
    const fights = card.filter((x) => (x.part || "main") === part);
    return fights.length
      ? `<h2>${label}</h2><ul>${fights.map((x) => `<li>${fighterLink(x.a)} contre ${fighterLink(x.b)}${x.cat ? ` (${esc(translateCategory(x.cat, "fr"))}${x.belt ? `, ${esc(L(x.belt, "fr"))}` : ""})` : ""}</li>`).join("")}</ul>`
      : "";
  }).join("");
  const results = past && e.results?.length
    ? `<h2>Résultats</h2><ul>${e.results.map((r) => {
        const s = resultSides(r.fight);
        const fight = s?.winner ? `${fighterLink(s.winner)} bat ${fighterLink(s.loser)}` : esc(r.fight);
        return `<li>${fight}, ${esc(translateMethod(r.method, "fr"))}${r.note ? ` (${esc(L(r.note, "fr"))})` : ""}</li>`;
      }).join("")}</ul>`
    : "";
  return `<main style="max-width:720px;margin:0 auto;padding:24px 16px;color:#f5f5f5;font-family:Inter,system-ui,sans-serif;line-height:1.5">
<p><a href="/" style="color:#fbbf24">Octogone</a> › Événements</p>
<h1 style="font-size:2rem;margin:8px 0">${esc(e.name)}</h1>
<p style="color:#fbbf24">${esc(formatDate(e.iso, "fr"))} · ${esc(L(e.location, "fr"))}</p>
${e.main ? `<p>${esc(L(e.main, "fr"))}</p>` : ""}
${e.note ? `<p>${esc(L(e.note, "fr"))}</p>` : ""}
${sections}${results}
</main>`;
}

function eventPage(e, past) {
  const slug = eventSlug(e);
  const url = `${SITE}/evenement/${slug}`;
  const title = past ? `${e.name} : résultats | Octogone` : `${e.name} : carte complète, pronostics et compte à rebours | Octogone`;
  const card = cardOf(e);
  const desc = past
    ? `Résultats de ${e.name} (${formatDate(e.iso, "fr")}, ${L(e.location, "fr")}) : ${(e.results || []).slice(0, 3).map((r) => r.fight).join(", ")}.`
    : `${e.name}, le ${formatDate(e.iso, "fr")} (${L(e.location, "fr")}) : ${card.length > 1 ? `les ${card.length} combats de la carte` : L(e.main, "fr")}, pronostics de l'IA et compte à rebours.`;
  const ld = {
    "@context": "https://schema.org", "@type": "SportsEvent", name: e.name, url, description: desc,
    startDate: e.start || e.iso, location: { "@type": "Place", name: L(e.location, "fr") },
    ...(card.length && { competitor: card.flatMap((x) => [x.a, x.b]).map((name) => ({ "@type": "Person", name })) }),
  };
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Octogone" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${SITE}/og-image.jpg" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  return fill(head, eventBody(e, past));
}

// combattant/<slug>.html, servi à l'adresse /combattant/<slug> grâce à « cleanUrls » (vercel.json).
mkdirSync("dist/combattant", { recursive: true });
for (const f of all) writeFileSync(`dist/combattant/${slugify(f.nom)}.html`, page(f));
mkdirSync("dist/evenement", { recursive: true });
for (const e of UPCOMING) writeFileSync(`dist/evenement/${eventSlug(e)}.html`, eventPage(e, false));
for (const e of RECENT_CARDS) writeFileSync(`dist/evenement/${eventSlug(e)}.html`, eventPage(e, true));

// a-propos.html : la page « Qu'est-ce qu'Octogone.space ? », lisible sans JavaScript.
{
  const url = `${SITE}/a-propos`;
  const title = "Qu'est-ce qu'Octogone.space ? | Octogone";
  const desc = "Octogone.space, le site des fans de MMA : fiches des combattants vérifiées sur 2 sources, Simulateur avec analyse IA, pages d'événement et vote « Les fans contre l'IA ». Gratuit et sans compte.";
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Octogone" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${SITE}/og-image.jpg" />`,
  ].join("\n    ");
  writeFileSync("dist/a-propos.html", fill(head, `<main><h1>Qu'est-ce qu'Octogone.space ?</h1><p>${esc(desc)}</p></main>`));
}

// mentions-legales.html et contact.html : leurs propres adresses (le bandeau cookies de Google demande
// l'adresse de la politique de confidentialité).
for (const [file, title, desc] of [
  ["mentions-legales", "Mentions légales et confidentialité | Octogone", "Mentions légales, données personnelles et cookies du site Octogone.space."],
  ["contact", "Contact | Octogone", "Contacter Octogone.space : signaler une erreur, proposer une idée, une photo ou un partenariat."],
]) {
  const url = `${SITE}/${file}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
  ].join("\n    ");
  writeFileSync(`dist/${file}.html`, fill(head, `<main><h1>${esc(title.split(" | ")[0])}</h1><p>${esc(desc)}</p></main>`));
}

const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, `${SITE}/a-propos`, `${SITE}/contact`, `${SITE}/mentions-legales`, ...events.map((e) => `${SITE}/evenement/${eventSlug(e)}`), ...all.map((f) => `${SITE}/combattant/${slugify(f.nom)}`)];
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`${all.length} pages combattants, ${events.length} pages événements, sitemap.xml et robots.txt écrits.`);
