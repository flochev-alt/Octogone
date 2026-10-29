-- Octogone — schéma Supabase
-- À exécuter une seule fois dans Supabase > SQL Editor > New query > Run.
-- Le site ne fait que LIRE ces tables avec la clé publique (anon / publishable) :
-- les écritures se font depuis le dashboard Supabase (Table Editor) ou le SQL Editor.

-- ─────────────────────────────────────────────
-- Compatibilité avec la première version (juillet 2026)
-- ─────────────────────────────────────────────
-- Si l'ancienne table media_posts (colonne "payload") existe et est vide, on la recrée au nouveau format.
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'media_posts' and column_name = 'payload') then
    if exists (select 1 from public.media_posts) then
      raise exception 'media_posts (ancien format) contient des données : à migrer à la main';
    end if;
    drop table public.media_posts;
  end if;
end $$;

-- ─────────────────────────────────────────────
-- Combattants (Simulateur)
-- ─────────────────────────────────────────────
create table if not exists public.fighters (
  id          text primary key,              -- ex. "f001"
  nom         text not null,
  categorie   text not null,                 -- ex. "Poids leger" (mêmes libellés que fightersData.js)
  taille      smallint,                      -- cm
  allonge     smallint,                      -- cm
  victoires   smallint not null default 0,
  defaites    smallint not null default 0,
  nuls        smallint not null default 0,
  ko          smallint,                      -- % des victoires
  sub         smallint,
  dec         smallint,
  striking    smallint,                      -- précision de frappe %
  td_acc      smallint,                      -- précision takedown %
  td_def      smallint,                      -- défense takedown %
  nc          smallint not null default 0,   -- no contests (bilan pro)
  ufc_v       smallint,                      -- bilan à l'UFC uniquement
  ufc_d       smallint,
  ufc_n       smallint,
  ufc_nc      smallint,
  rang        smallint,                      -- classement UFC : 0 = champion, null = non classé
  naissance   date,
  style       text[],                        -- clés de style, ex. {sambo,lutte}
  actif       boolean not null default true, -- false = masqué du site sans supprimer la ligne
  updated_at  timestamptz not null default now()
);

-- Colonnes ajoutées après la première version : sans effet si elles existent déjà.
alter table public.fighters add column if not exists actif  boolean not null default true;
alter table public.fighters add column if not exists nc     smallint not null default 0;
alter table public.fighters add column if not exists ufc_v  smallint;
alter table public.fighters add column if not exists ufc_d  smallint;
alter table public.fighters add column if not exists ufc_n  smallint;
alter table public.fighters add column if not exists ufc_nc smallint;
alter table public.fighters add column if not exists rang      smallint;
alter table public.fighters add column if not exists naissance date;
alter table public.fighters add column if not exists style     text[];

create index if not exists fighters_categorie_idx on public.fighters (categorie);

-- ─────────────────────────────────────────────
-- Fil Média (cartes à venir, résultats, réactions, posts X, trash talk)
-- ─────────────────────────────────────────────
create table if not exists public.media_posts (
  id          bigint generated always as identity primary key,
  slug        text unique,                   -- clé stable des posts venant de mediaData.js (null = ajouté à la main)
  type        text not null check (type in ('upcoming', 'recap', 'reaction', 'tweet', 'trash_talk')),
  iso         date,                          -- date de l'événement / du post, sert au tri
  data        jsonb not null,                -- même forme que les objets de Media.jsx
  publie      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Ajouts après la première version : sans effet s'ils existent déjà.
alter table public.media_posts add column if not exists slug text unique;
alter table public.media_posts drop constraint if exists media_posts_type_check;
alter table public.media_posts add constraint media_posts_type_check
  check (type in ('upcoming', 'recap', 'reaction', 'tweet', 'trash_talk'));

create index if not exists media_posts_type_iso_idx on public.media_posts (type, iso desc);

-- ─────────────────────────────────────────────
-- updated_at automatique
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fighters_updated_at on public.fighters;
create trigger fighters_updated_at before update on public.fighters
  for each row execute function public.set_updated_at();

drop trigger if exists media_posts_updated_at on public.media_posts;
create trigger media_posts_updated_at before update on public.media_posts
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- Sécurité (RLS) : lecture publique, aucune écriture via la clé publique
-- ─────────────────────────────────────────────
alter table public.fighters    enable row level security;
alter table public.media_posts enable row level security;

drop policy if exists "Lecture publique combattants" on public.fighters;  -- ancienne policy (juillet)
drop policy if exists "Lecture publique des combattants actifs" on public.fighters;
create policy "Lecture publique des combattants actifs" on public.fighters
  for select to anon, authenticated using (actif);

drop policy if exists "Lecture publique des posts publiés" on public.media_posts;
create policy "Lecture publique des posts publiés" on public.media_posts
  for select to anon, authenticated using (publie);
-- Pas de policy insert/update/delete : impossible d'écrire avec la clé publique.
