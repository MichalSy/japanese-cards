-- Repair Hiragana handakuten practice group membership.
-- The hiragana group dakuten-3 (Halbstimmhaft · Pa) was active but had no
-- practice card links, making it visible as an empty exercise group.
-- Keep this idempotent so fresh rebuilds and already-migrated live DBs converge.

begin;

with target_group as (
  select pg.id
  from language_cards_practice_groups pg
  join language_cards_categories c on c.id = pg.category_id
  where c.language_id = 'ja'
    and c.slug = 'hiragana'
    and pg.slug = 'dakuten-3'
), target_cards(slug, sort_order) as (
  values
    ('h-pa', 1),
    ('h-pi', 2),
    ('h-pu', 3),
    ('h-pe', 4),
    ('h-po', 5)
), matched as (
  select tg.id as practice_group_id, card.id as card_id, tc.sort_order
  from target_group tg
  join target_cards tc on true
  join language_cards_cards card on card.slug = tc.slug
)
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
select practice_group_id, card_id, sort_order
from matched
on conflict (practice_group_id, card_id) do update set
  sort_order = excluded.sort_order;

commit;
