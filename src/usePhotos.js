import { useEffect, useState } from "react";

// Photos libres de droits des combattants, lues une seule fois dans /photos.json
// (fichier généré par scripts/fetch-photos.mjs). Un nom sans photo garde ses initiales.
let cache = {};
let request = null;
const listeners = new Set();

function load() {
  request ??= fetch("/photos.json")
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((data) => {
      cache = data;
      listeners.forEach((fn) => fn());
    });
}

// Renvoie { nom: { url, author, license, page, source } } ; les noms absents n'ont pas de photo.
export function usePhotos() {
  const [, refresh] = useState(0);

  useEffect(() => {
    const fn = () => refresh((x) => x + 1);
    listeners.add(fn);
    load();
    return () => listeners.delete(fn);
  }, []);

  return cache;
}

// Ligne de crédit : « Photo : Auteur · CC BY-SA 4.0 · Wikimedia Commons ».
export const creditOf = (p) => [p.author, p.license, p.source || "Wikimedia Commons"].filter(Boolean).join(" · ");
