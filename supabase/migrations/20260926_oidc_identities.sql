-- Preserve the existing UUIDs and progress while moving authentication to Authentik.
begin;

create table if not exists public.language_cards_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

insert into public.language_cards_users (id)
select id from auth.users
on conflict do nothing;

insert into public.language_cards_users (id)
select user_id from public.language_cards_user_settings
union select user_id from public.language_cards_user_card_progress
union select user_id from public.language_cards_user_sessions
union select user_id from public.language_cards_category_snapshots
on conflict do nothing;

alter table public.language_cards_user_settings
  drop constraint user_settings_user_id_fkey,
  add constraint user_settings_user_id_fkey foreign key (user_id)
    references public.language_cards_users(id) on delete cascade;
alter table public.language_cards_user_card_progress
  drop constraint user_card_progress_user_id_fkey,
  add constraint user_card_progress_user_id_fkey foreign key (user_id)
    references public.language_cards_users(id) on delete cascade;
alter table public.language_cards_user_sessions
  drop constraint user_sessions_user_id_fkey,
  add constraint user_sessions_user_id_fkey foreign key (user_id)
    references public.language_cards_users(id) on delete cascade;
alter table public.language_cards_category_snapshots
  drop constraint language_cards_category_snapshots_user_id_fkey,
  add constraint language_cards_category_snapshots_user_id_fkey foreign key (user_id)
    references public.language_cards_users(id) on delete cascade;

create table public.language_cards_oidc_identities (
  issuer text not null,
  subject text not null,
  user_id uuid not null references public.language_cards_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issuer, subject)
);
create index language_cards_oidc_identities_user_idx
  on public.language_cards_oidc_identities (user_id);

create or replace function public.language_cards_resolve_identity(
  p_issuer text, p_subject text, p_google_subject text default null
) returns uuid
language plpgsql security definer set search_path = pg_catalog, public, auth as $$
declare
  result uuid;
begin
  if p_issuer <> 'https://auth.sytko.de/application/o/japanese-cards/'
     or p_subject is null or length(p_subject) < 8 or length(p_subject) > 320 then
    raise exception 'Invalid OAuth identity';
  end if;
  if p_google_subject is not null and p_google_subject !~ '^[0-9]+$' then
    raise exception 'Invalid Google subject';
  end if;

  select user_id into result from public.language_cards_oidc_identities
    where issuer = p_issuer and subject = p_subject;
  if result is not null then return result; end if;

  if p_google_subject is not null then
    select i.user_id into result from auth.identities i
      where i.provider = 'google' and i.provider_id = p_google_subject;
  end if;
  if result is null then result := gen_random_uuid(); end if;
  insert into public.language_cards_users (id) values (result) on conflict do nothing;
  insert into public.language_cards_oidc_identities (issuer, subject, user_id)
    values (p_issuer, p_subject, result) on conflict do nothing;
  select user_id into result from public.language_cards_oidc_identities
    where issuer = p_issuer and subject = p_subject;
  return result;
end;
$$;

revoke all on function public.language_cards_resolve_identity(text,text,text) from public;
grant execute on function public.language_cards_resolve_identity(text,text,text) to service_role;

alter table public.language_cards_users enable row level security;
alter table public.language_cards_oidc_identities enable row level security;

select pg_notify('pgrst', 'reload schema');

commit;
