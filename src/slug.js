// Adresse d'une fiche combattant : /combattant/<slug> (« Benoît Saint Denis » → « benoit-saint-denis »).
export const slugify = (nom) =>
  nom.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const fighterPath = (f) => `/combattant/${slugify(f.nom)}`;

// Slug lu dans l'adresse actuelle, ou null hors d'une fiche.
export const slugFromPath = (path) => path.match(/^\/combattant\/([a-z0-9-]+)\/?$/)?.[1] || null;
