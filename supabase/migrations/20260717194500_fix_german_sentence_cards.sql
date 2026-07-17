-- Correct the sentence lesson without changing any pre-existing card family.
begin;

alter table language_cards_cards drop constraint if exists language_cards_cards_card_type_check;
alter table language_cards_cards add constraint language_cards_cards_card_type_check
  check (card_type in ('character', 'vocabulary', 'info', 'quiz_4_option', 'sentence', 'sentence_quiz'));

update language_cards_cards
set card_type = 'sentence'
where context = 'de-a1-simple-sentences' and card_type = 'vocabulary';

update language_cards_cards
set card_type = 'sentence_quiz'
where context = 'de-a1-simple-sentences' and card_type = 'quiz_4_option';

with hints(card_id, english_hint) as (
  values
  ('29599913-324b-53b0-ac60-b5491f5234e8'::uuid, 'Review: I + verb + object. You already know Wasser and trinken.'),
  ('d801b121-d2d4-5569-9a40-39f330426e4c'::uuid, 'Review: article + noun + ist + color.'),
  ('25ab5666-031c-572f-92f0-669c0ee96d6a'::uuid, 'Review sentence: Die Katze + verb.'),
  ('880d8699-f072-54fe-b989-1381d5f59925'::uuid, 'Review sentence using die and ist.'),
  ('c8dcc459-3c3f-5bb1-b992-1e30458bec59'::uuid, 'New: wohnen means to live. Places often follow in.'),
  ('852e6cff-a99f-51ee-9624-3d02bcc1e0b6'::uuid, 'New: lernen means to learn. With du, the verb often ends in -st: du lernst.'),
  ('c8e23a87-0830-5c9e-9ef8-12b7d501e521'::uuid, 'New: arbeiten means to work. You already know heute.'),
  ('36959e87-88af-56a0-ae9e-b08ce95dbeb0'::uuid, 'New: aus + country tells where someone comes from.'),
  ('8ee704c9-c7be-502c-b97b-6bb28abebca3'::uuid, 'New: gehen means to go. zur Schule means to school.'),
  ('1f937f7d-25c3-5ab9-9779-a1fb5123379c'::uuid, 'New: kaufen means to buy. You already know Brot.'),
  ('c7d981df-e7ea-5016-8480-da53bfb0c2a2'::uuid, 'New: essen changes to du isst. Die Suppe becomes eine Suppe here.'),
  ('20ca7a1c-9005-519e-869d-0f7b7ecf0b1c'::uuid, 'New: im means in dem. You already know Kind and Park.'),
  ('3dab99bf-3477-5b51-84db-322bc382e911'::uuid, 'New: laufen means to run. Er/der Hund uses läuft.'),
  ('62dffd73-7531-5297-afda-d0dd63fda403'::uuid, 'New: lesen changes to sie liest. Buch is ein Buch here.'),
  ('486df682-05b1-50e6-b4ea-d5d93769baad'::uuid, 'New: mit dem Auto means by car. fahren changes to er fährt.'),
  ('79b11d86-b239-5391-b89e-5387c99275c8'::uuid, 'New: meine means my. Sie hat matches the familiar du hast.'),
  ('65701f18-eafc-5706-b1d1-a97e9a827e95'::uuid, 'A new sentence made from familiar words: das Zimmer + ist + sauber.'),
  ('36ad0f3f-3515-594f-8bac-8d13f2edc876'::uuid, 'A new sentence: you know Kaffee, and heiß from Tee and Suppe.'),
  ('e265c091-6721-5189-8997-7739e517b347'::uuid, 'New: when morgen comes first, the verb still stays in position two.'),
  ('2675d78b-41dc-58af-a3f0-ed57332903cf'::uuid, 'New: am + weekday. The verb again stays in position two.')
)
update language_cards_card_translations tr
set hint = hints.english_hint
from hints
where tr.card_id = hints.card_id and tr.lang_code = 'en';

with hints(card_id, english_hint) as (
  values
  ('29599913-324b-53b0-ac60-b5491f5234e8'::uuid, 'Review: I + verb + object. You already know Wasser and trinken.'),
  ('d801b121-d2d4-5569-9a40-39f330426e4c'::uuid, 'Review: article + noun + ist + color.'),
  ('25ab5666-031c-572f-92f0-669c0ee96d6a'::uuid, 'Review sentence: Die Katze + verb.'),
  ('880d8699-f072-54fe-b989-1381d5f59925'::uuid, 'Review sentence using die and ist.'),
  ('c8dcc459-3c3f-5bb1-b992-1e30458bec59'::uuid, 'New: wohnen means to live. Places often follow in.'),
  ('852e6cff-a99f-51ee-9624-3d02bcc1e0b6'::uuid, 'New: lernen means to learn. With du, the verb often ends in -st: du lernst.'),
  ('c8e23a87-0830-5c9e-9ef8-12b7d501e521'::uuid, 'New: arbeiten means to work. You already know heute.'),
  ('36959e87-88af-56a0-ae9e-b08ce95dbeb0'::uuid, 'New: aus + country tells where someone comes from.'),
  ('8ee704c9-c7be-502c-b97b-6bb28abebca3'::uuid, 'New: gehen means to go. zur Schule means to school.'),
  ('1f937f7d-25c3-5ab9-9779-a1fb5123379c'::uuid, 'New: kaufen means to buy. You already know Brot.'),
  ('c7d981df-e7ea-5016-8480-da53bfb0c2a2'::uuid, 'New: essen changes to du isst. Die Suppe becomes eine Suppe here.'),
  ('20ca7a1c-9005-519e-869d-0f7b7ecf0b1c'::uuid, 'New: im means in dem. You already know Kind and Park.'),
  ('3dab99bf-3477-5b51-84db-322bc382e911'::uuid, 'New: laufen means to run. Er/der Hund uses läuft.'),
  ('62dffd73-7531-5297-afda-d0dd63fda403'::uuid, 'New: lesen changes to sie liest. Buch is ein Buch here.'),
  ('486df682-05b1-50e6-b4ea-d5d93769baad'::uuid, 'New: mit dem Auto means by car. fahren changes to er fährt.'),
  ('79b11d86-b239-5391-b89e-5387c99275c8'::uuid, 'New: meine means my. Sie hat matches the familiar du hast.'),
  ('65701f18-eafc-5706-b1d1-a97e9a827e95'::uuid, 'A new sentence made from familiar words: das Zimmer + ist + sauber.'),
  ('36ad0f3f-3515-594f-8bac-8d13f2edc876'::uuid, 'A new sentence: you know Kaffee, and heiß from Tee and Suppe.'),
  ('e265c091-6721-5189-8997-7739e517b347'::uuid, 'New: when morgen comes first, the verb still stays in position two.'),
  ('2675d78b-41dc-58af-a3f0-ed57332903cf'::uuid, 'New: am + weekday. The verb again stays in position two.')
)
update language_cards_cards c
set data = jsonb_set(c.data, '{hint,en}', to_jsonb(hints.english_hint), true)
from hints
where c.id = hints.card_id;

commit;
