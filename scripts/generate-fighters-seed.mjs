// Génère supabase/seed_fighters.sql à partir de src/fightersData.js.
// Usage : node scripts/generate-fighters-seed.mjs
// Le SQL produit est ré-exécutable : il met à jour les combattants existants (upsert)
// et supprime ceux qui ne sont plus dans fightersData.js (la base reflète exactement le fichier).
import { writeFileSync } from "node:fs";
import { FIGHTERS } from "../src/fightersData.js";

const COLS = ["id", "nom", "categorie", "taille", "allonge", "victoires", "defaites", "nuls", "ko", "sub", "dec", "striking", "td_acc", "td_def", "nc", "ufc_v", "ufc_d", "ufc_n", "ufc_nc", "rang", "naissance", "style"];
const val = (v) =>
  v === null || v === undefined ? "null"
  : Array.isArray(v) ? `array[${v.map(val).join(", ")}]::text[]`
  : typeof v === "number" ? v
  : `'${String(v).replace(/'/g, "''")}'`;

const rows = FIGHTERS.map((f) =>
  `  (${[f.id, f.nom, f.categorie, f.taille, f.allonge, f.victoires, f.defaites, f.nuls, f.ko, f.sub, f.dec, f.striking, f.tdAcc, f.tdDef, f.nc ?? 0, f.ufcV, f.ufcD, f.ufcN, f.ufcNc, f.rang, f.naissance, f.style].map(val).join(", ")})`
);

const sql = `-- Généré par scripts/generate-fighters-seed.mjs — ${FIGHTERS.length} combattants.
-- À exécuter dans Supabase > SQL Editor APRÈS schema.sql.
insert into public.fighters (${COLS.join(", ")}) values
${rows.join(",\n")}
on conflict (id) do update set
${COLS.slice(1).map((c) => `  ${c} = excluded.${c}`).join(",\n")};

delete from public.fighters where id not in (${FIGHTERS.map((f) => val(f.id)).join(", ")});
`;

writeFileSync(new URL("../supabase/seed_fighters.sql", import.meta.url), sql);
console.log(`supabase/seed_fighters.sql : ${FIGHTERS.length} combattants`);
