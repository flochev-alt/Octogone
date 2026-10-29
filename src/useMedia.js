import { useState, useEffect } from "react";
import { UPCOMING, RECENT_CARDS, REACTIONS, TWEETS, TRASH_TALK } from "./mediaData.js";
import { supabaseEnabled, fetchTable } from "./supabase.js";

// Même forme que les lignes de la table media_posts : { type, iso, data }.
export const LOCAL_MEDIA = [
  ...UPCOMING.map((d) => ({ type: "upcoming", iso: d.iso, data: d })),
  ...RECENT_CARDS.map((d) => ({ type: "recap", iso: d.iso, data: d })),
  ...REACTIONS.map((d) => ({ type: "reaction", iso: d.iso, data: d })),
  ...TWEETS.map((d) => ({ type: "tweet", iso: d.iso, data: d })),
  ...TRASH_TALK.map((d) => ({ type: "trash_talk", iso: null, data: d })),
];

// Affiche tout de suite les données locales (mediaData.js), puis les remplace
// par les posts publiés de Supabase si la base répond. En cas de panne, le fil reste affiché.
export function useMedia() {
  const [items, setItems] = useState(LOCAL_MEDIA);

  useEffect(() => {
    if (!supabaseEnabled) return;
    let cancelled = false;
    fetchTable("media_posts", "select=type,iso,data&order=iso.desc.nullslast,id")
      .then((rows) => {
        if (!cancelled && rows.length) setItems(rows);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return items;
}
