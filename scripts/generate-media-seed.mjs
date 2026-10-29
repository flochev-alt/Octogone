// Génère supabase/seed_media.sql à partir de src/mediaData.js.
// Usage : node scripts/generate-media-seed.mjs
// Le SQL produit est ré-exécutable : chaque post a un slug stable (upsert), les posts retirés
// de mediaData.js sont supprimés, et ceux ajoutés à la main dans Supabase (slug vide) sont conservés.
// La colonne "publie" n'est jamais écrasée : un post masqué dans Supabase le reste.
import { writeFileSync } from "node:fs";
import { UPCOMING, RECENT_CARDS, REACTIONS, TWEETS, TRASH_TALK } from "../src/mediaData.js";

const slugify = (s) =>
  String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (v) => (v && typeof v === "object" ? v.fr ?? v.en : v);

const posts = [
  ...UPCOMING.map((d) => ({ type: "upcoming", iso: d.iso, data: d, key: d.name })),
  ...RECENT_CARDS.map((d) => ({ type: "recap", iso: d.iso, data: d, key: d.name })),
  ...REACTIONS.map((d) => ({ type: "reaction", iso: d.iso, data: d, key: `${d.iso} ${text(d.author)}` })),
  ...TWEETS.map((d) => ({ type: "tweet", iso: d.iso, data: d, key: d.url.split("/").pop() })),
  ...TRASH_TALK.map((d) => ({ type: "trash_talk", iso: null, data: d, key: `${d.a} ${d.b}` })),
].map((p) => ({ ...p, slug: `${p.type}-${slugify(p.key)}` }));

const dupes = posts.map((p) => p.slug).filter((s, i, all) => all.indexOf(s) !== i);
if (dupes.length) throw new Error(`Slugs en double : ${dupes.join(", ")}`);

const str = (v) => (v === null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const rows = posts.map((p) => `  (${str(p.slug)}, ${str(p.type)}, ${str(p.iso)}, ${str(JSON.stringify(p.data))}::jsonb)`);

const sql = `-- Généré par scripts/generate-media-seed.mjs — ${posts.length} posts.
-- À exécuter dans Supabase > SQL Editor APRÈS schema.sql.
insert into public.media_posts (slug, type, iso, data) values
${rows.join(",\n")}
on conflict (slug) do update set
  type = excluded.type,
  iso = excluded.iso,
  data = excluded.data;

delete from public.media_posts where slug is not null and slug not in (${posts.map((p) => str(p.slug)).join(", ")});
`;

writeFileSync(new URL("../supabase/seed_media.sql", import.meta.url), sql);
console.log(`supabase/seed_media.sql : ${posts.length} posts`);
