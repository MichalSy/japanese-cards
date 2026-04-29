-- Cards are now attached to practice groups through language_cards_practice_group_cards.
-- The legacy group_id remains for old copied data only and must be nullable for new cards.

alter table if exists language_cards_cards
  alter column group_id drop not null;
