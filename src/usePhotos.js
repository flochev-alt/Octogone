import { useEffect, useState } from "react";

// Photos libres de droits (Wikimedia Commons) trouvées par /api/photos, partagées entre les pages.
// Chargées par lots de 20 noms. Un nom sans photo reste à null : on garde alors les initiales.
const cache = {};
const listeners = new Set();
const pending = new Set();

async function load(names) {
  const todo = names.filter((n) => !(n in cache) && !pending.has(n));
  if (!todo.length) return;
  todo.forEach((n) => pending.add(n));
  const chunks = [];
  for (let i = 0; i < todo.length; i += 20) chunks.push(todo.slice(i, i + 20));
  // Les lots partent en parallèle ; chaque lot met la page à jour dès qu'il arrive.
  await Promise.all(chunks.map(async (chunk) => {
    try {
      const r = await fetch(`/api/photos?names=${encodeURIComponent(chunk.join("|"))}`);
      const data = r.ok ? await r.json() : {};
      for (const n of chunk) cache[n] = data[n] || null;
    } catch {
      for (const n of chunk) cache[n] = null;
    }
    chunk.forEach((n) => pending.delete(n));
    listeners.forEach((fn) => fn());
  }));
}

// Renvoie { nom: { url, author, license, page } | null } pour les noms demandés.
export function usePhotos(names) {
  const [, refresh] = useState(0);
  const key = names.join("|");

  useEffect(() => {
    const fn = () => refresh((x) => x + 1);
    listeners.add(fn);
    load(key ? key.split("|") : []);
    return () => listeners.delete(fn);
  }, [key]);

  return cache;
}

// Ligne de crédit : « Photo : Auteur · CC BY-SA 4.0 · Wikimedia Commons ».
export const creditOf = (p) => [p.author, p.license, "Wikimedia Commons"].filter(Boolean).join(" · ");
