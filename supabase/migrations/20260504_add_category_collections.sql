-- Historical no-op.
-- This file used to introduce an experimental "category collection" layer.
-- The product model was clarified later as:
--   learning language -> track/level -> category -> learn/practice
-- The canonical DB tables are now:
--   language_cards_tracks
--   language_cards_track_translations
--   language_cards_track_categories
--
-- Do not reintroduce a separate category-collection model here.
-- 20260704_cleanup_superseded_collections.sql removes the old experimental
-- tables/columns/functions from environments where they existed.

begin;
commit;
