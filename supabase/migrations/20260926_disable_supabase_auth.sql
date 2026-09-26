-- Apply after the Authentik version is live and verified.
begin;

drop policy if exists "own" on public.language_cards_category_snapshots;
drop policy if exists "own delete" on public.language_cards_user_card_progress;
drop policy if exists "own insert" on public.language_cards_user_card_progress;
drop policy if exists "own read" on public.language_cards_user_card_progress;
drop policy if exists "own update" on public.language_cards_user_card_progress;
drop policy if exists "own delete" on public.language_cards_user_sessions;
drop policy if exists "own insert" on public.language_cards_user_sessions;
drop policy if exists "own read" on public.language_cards_user_sessions;
drop policy if exists "own update" on public.language_cards_user_sessions;
drop policy if exists "own insert" on public.language_cards_user_settings;
drop policy if exists "own read" on public.language_cards_user_settings;
drop policy if exists "own update" on public.language_cards_user_settings;

revoke all on function public.update_category_snapshot(uuid,uuid) from public;
grant execute on function public.update_category_snapshot(uuid,uuid) to service_role;

select pg_notify('pgrst', 'reload schema');
commit;
