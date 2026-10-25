// Lecture des données Supabase via l'API REST (pas de dépendance supplémentaire).
// Seule la clé PUBLIQUE (anon / publishable) est utilisée ici : la sécurité repose
// sur les policies RLS de supabase/schema.sql (lecture seule).
// Ne jamais mettre la clé secrète / service_role dans une variable VITE_*.
// Tolère une URL saisie avec "/" ou "/rest/v1" à la fin.
const URL = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(URL && KEY);

export async function fetchTable(table, query = "select=*") {
  if (!supabaseEnabled) throw new Error("Supabase non configuré");
  const r = await fetch(`${URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!r.ok) throw new Error(`Supabase ${table} : ${r.status}`);
  return r.json();
}
