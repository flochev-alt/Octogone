// Adresse d'une fiche combattant : /combattant/<slug> (« Benoît Saint Denis » → « benoit-saint-denis »).
export const slugify = (nom) =>
  nom.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const fighterPath = (f) => `/combattant/${slugify(f.nom)}`;

// Slug lu dans l'adresse actuelle, ou null hors d'une fiche.
export const slugFromPath = (path) => path.match(/^\/combattant\/([a-z0-9-]+)\/?$/)?.[1] || null;

// Adresse d'un duel du Simulateur : /comparer/<slugA>-vs-<slugB> (lien partageable, ex. /comparer/ciryl-gane-vs-josh-hokit).
export const duelPath = (a, b) => `/comparer/${slugify(a.nom)}-vs-${slugify(b.nom)}`;
export function duelFromPath(path, fighters) {
  const m = path.match(/^\/comparer\/([a-z0-9-]+)-vs-([a-z0-9-]+)\/?$/);
  if (!m) return null;
  const find = (s) => fighters.find((f) => slugify(f.nom) === s) || null;
  const a = find(m[1]), b = find(m[2]);
  return a ? { a, b: b && b !== a ? b : null } : null;
}
