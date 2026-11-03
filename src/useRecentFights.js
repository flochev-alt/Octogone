import { useState, useEffect } from "react";

// Les 5 derniers combats de chaque combattant (gros fichier) : chargés à part, après l'accueil.
let data = null;
let request = null;
const listeners = new Set();

export const loadRecentFights = () =>
  (request ??= import("./recentFights.js")
    .then((m) => {
      data = m.RECENT_FIGHTS;
      listeners.forEach((f) => f(data));
    })
    .catch(() => { request = null; }));

export function useRecentFights() {
  const [list, setList] = useState(data);
  useEffect(() => {
    listeners.add(setList);
    if (data) setList(data);
    else loadRecentFights();
    return () => listeners.delete(setList);
  }, []);
  return list;
}
