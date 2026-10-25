import { useState, useEffect } from "react";
import { FIGHTERS } from "./fightersData.js";
import { supabaseEnabled, fetchTable } from "./supabase.js";

// Ligne Supabase (snake_case) -> objet combattant utilisé par le Simulateur.
const fromRow = ({ td_acc, td_def, ufc_v, ufc_d, ufc_n, ufc_nc, actif, updated_at, ...rest }) => ({
  ...rest, tdAcc: td_acc, tdDef: td_def, ufcV: ufc_v, ufcD: ufc_d, ufcN: ufc_n, ufcNc: ufc_nc,
});

// Affiche tout de suite les données locales (fightersData.js), puis les remplace
// par celles de Supabase si la base répond. En cas de panne, le site reste fonctionnel.
export function useFighters() {
  const [fighters, setFighters] = useState(FIGHTERS);

  useEffect(() => {
    if (!supabaseEnabled) return;
    let cancelled = false;
    fetchTable("fighters", "select=*&order=id")
      .then((rows) => {
        if (!cancelled && rows.length) setFighters(rows.map(fromRow));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return fighters;
}
