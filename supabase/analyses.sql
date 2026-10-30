-- Analyses IA du Simulateur gardées en mémoire : une par duel (et par langue), pour que tout le monde
-- voie le même pronostic. Une nouvelle analyse est faite dès que les stats d'un des deux combattants changent.
-- Appliqué automatiquement par le workflow « Synchro Supabase ». Écrit seulement par api/analyze.js
-- avec la clé secrète (variable Vercel SUPABASE_SECRET_KEY) ; aucune lecture ni écriture avec la clé publique.
create table if not exists public.analyses (
  cle        text primary key,
  combat     text not null,
  langue     text not null,
  analyse    jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;
