-- « Les fans contre l'IA » : votes des visiteurs sur les combats des cartes à venir.
-- Appliqué automatiquement par le workflow « Synchro Supabase ». Lu et écrit seulement par api/vote.js
-- avec la clé secrète (variable Vercel SUPABASE_SECRET_KEY) ; aucune lecture ni écriture avec la clé publique.
-- Aucune donnée personnelle en clair : l'appareil et l'adresse IP ne sont gardés que sous forme d'empreinte (hash).

-- Un combat : les deux noms (triés), la date de l'événement, le nombre de votes de chaque côté
-- et le favori de l'IA, figé avant le combat.
create table if not exists public.fan_combats (
  cle        text primary key,           -- « date|nom1|nom2 » (noms simplifiés et triés)
  evenement  text not null,              -- adresse de la page d'événement (slug)
  iso        date not null,
  nom1       text not null,
  nom2       text not null,
  votes1     integer not null default 0,
  votes2     integer not null default 0,
  ia_favori  text,
  created_at timestamptz not null default now()
);

-- Un vote par appareil et par combat ; au plus quelques votes par adresse IP (foyer, réseau mobile partagé).
create table if not exists public.fan_votes (
  cle        text not null references public.fan_combats(cle) on delete cascade,
  votant     text not null,
  ip         text not null,
  choix      smallint not null check (choix in (1, 2)),
  created_at timestamptz not null default now(),
  primary key (cle, votant)
);
create index if not exists fan_votes_ip on public.fan_votes (cle, ip);

alter table public.fan_combats enable row level security;
alter table public.fan_votes enable row level security;

-- Enregistre un vote et renvoie les compteurs du combat ; « deja » = cet appareil (ou cette IP, au-delà
-- de la limite) avait déjà voté : le vote n'est alors pas compté.
create or replace function public.fan_voter(
  p_cle text, p_evenement text, p_iso date, p_nom1 text, p_nom2 text,
  p_votant text, p_ip text, p_choix smallint, p_max_ip integer default 4
) returns table (v1 integer, v2 integer, deja boolean, mon_choix smallint)
language plpgsql security definer set search_path = public as $$
declare
  v_deja boolean := false;
  v_choix smallint := p_choix;
begin
  insert into fan_combats (cle, evenement, iso, nom1, nom2)
  values (p_cle, p_evenement, p_iso, p_nom1, p_nom2)
  on conflict (cle) do nothing;

  select fv.choix into v_choix from fan_votes fv where fv.cle = p_cle and fv.votant = p_votant;
  if found then
    v_deja := true;
  elsif (select count(*) from fan_votes fv where fv.cle = p_cle and fv.ip = p_ip) >= p_max_ip then
    v_deja := true;
    v_choix := p_choix;
  else
    v_choix := p_choix;
    insert into fan_votes (cle, votant, ip, choix) values (p_cle, p_votant, p_ip, p_choix);
    update fan_combats fc set
      votes1 = fc.votes1 + (p_choix = 1)::int,
      votes2 = fc.votes2 + (p_choix = 2)::int
    where fc.cle = p_cle;
  end if;

  return query select fc.votes1, fc.votes2, v_deja, v_choix from fan_combats fc where fc.cle = p_cle;
end;
$$;

revoke all on function public.fan_voter from public, anon, authenticated;
