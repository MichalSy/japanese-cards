-- Remove the superseded category-collection model from fresh rebuilds and old environments.
-- The current top-level structure is language_cards_tracks + language_cards_track_categories.
-- Safe on live DBs where these tables/columns/functions are already absent.

begin;

alter table if exists language_cards_categories
  drop column if exists collection_id;

alter table if exists language_cards_categories
  drop column if exists collection_sort_order;

drop table if exists language_cards_category_collection_translations cascade;
drop table if exists language_cards_category_collections cascade;

-- Deprecated JA-only compatibility wrapper. Code uses get_language_category_card_counts(p_language_id).
drop function if exists public.get_category_card_counts();

notify pgrst, 'reload schema';

commit;
