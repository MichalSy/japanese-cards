-- Remove obsolete hints from German sentence learning cards.
begin;

update language_cards_cards
set data = data - 'hint'
where context = 'de-a1-simple-sentences'
  and card_type = 'sentence';

update language_cards_card_translations translation
set hint = null
from language_cards_cards card
where translation.card_id = card.id
  and card.context = 'de-a1-simple-sentences'
  and card.card_type = 'sentence';

commit;
