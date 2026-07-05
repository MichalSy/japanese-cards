-- Fix German A1 Basic lessons: remove duplicates and attach true 1:1 media.

begin;

update language_cards_learning_lesson_translations set description = case lang_code when 'de' then '15 Lernkarten, 15 Quizkarten.' when 'en' then '15 learning cards, 15 quiz cards.' else description end where lesson_id = '79e917b8-65c5-49ef-a13d-e988b52f22fb' and lang_code in ('de','en');
delete from language_cards_learning_lesson_cards where lesson_id = '79e917b8-65c5-49ef-a13d-e988b52f22fb';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order)
values
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-hallo'), 1),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-morgen'), 2),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-tag'), 3),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-abend'), 4),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-tschuess-greet'), 5),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-auf-wiedersehen'), 6),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bis-spaeter'), 7),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-gute-nacht'), 8),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bitte'), 9),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-danke'), 10),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-entschuldigung'), 11),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ja'), 12),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-nein'), 13),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ich-heisse'), 14),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du'), 15),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-hallo-quiz'), 16),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-morgen-quiz'), 17),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-tag-quiz'), 18),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-abend-quiz'), 19),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-tschuess-greet-quiz'), 20),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-auf-wiedersehen-quiz'), 21),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bis-spaeter-quiz'), 22),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-gute-nacht-quiz'), 23),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bitte-quiz'), 24),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-danke-quiz'), 25),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-entschuldigung-quiz'), 26),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ja-quiz'), 27),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-nein-quiz'), 28),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ich-heisse-quiz'), 29),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du-quiz'), 30);
delete from language_cards_practice_group_cards where practice_group_id = '95d1098b-b418-43c2-8e4f-4ad43468c54c';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
values
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-hallo'), 1),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-guten-morgen'), 2),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-guten-tag'), 3),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-guten-abend'), 4),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-tschuess-greet'), 5),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-auf-wiedersehen'), 6),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-bis-spaeter'), 7),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-gute-nacht'), 8),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-bitte'), 9),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-danke'), 10),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-entschuldigung'), 11),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-ja'), 12),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-nein'), 13),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-ich-heisse'), 14),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du'), 15);

update language_cards_learning_lesson_translations set description = case lang_code when 'de' then '14 Lernkarten, 14 Quizkarten.' when 'en' then '14 learning cards, 14 quiz cards.' else description end where lesson_id = 'c729e014-3ea2-4ccc-92e5-6d67c4729747' and lang_code in ('de','en');
delete from language_cards_learning_lesson_cards where lesson_id = 'c729e014-3ea2-4ccc-92e5-6d67c4729747';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order)
values
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich'), 1),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du'), 2),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-er'), 3),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie'), 4),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-wir'), 5),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-bin'), 6),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-bist'), 7),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-habe'), 8),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-hast'), 9),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-mutter'), 10),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-vater'), 11),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-kind'), 12),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freund'), 13),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freundin'), 14),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-quiz'), 15),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-quiz'), 16),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-er-quiz'), 17),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie-quiz'), 18),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-wir-quiz'), 19),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-bin-quiz'), 20),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-bist-quiz'), 21),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-habe-quiz'), 22),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-hast-quiz'), 23),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-mutter-quiz'), 24),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-vater-quiz'), 25),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-kind-quiz'), 26),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freund-quiz'), 27),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freundin-quiz'), 28);
delete from language_cards_practice_group_cards where practice_group_id = '24261491-226a-4f8b-8d6e-792906125afb';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
values
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich'), 1),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du'), 2),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-er'), 3),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-sie'), 4),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-wir'), 5),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich-bin'), 6),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du-bist'), 7),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich-habe'), 8),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du-hast'), 9),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-mutter'), 10),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-vater'), 11),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-kind'), 12),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-freund'), 13),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-freundin'), 14);

update language_cards_cards set
  image_id = case slug
    when 'de-a1-start-hallo' then 'fc46bfec-66c4-4366-bfb0-3af143876ac8'
    when 'de-a1-start-guten-morgen' then '81bc9ce5-4436-4b16-8768-62f823547927'
    when 'de-a1-start-guten-tag' then '6f2bbaf4-7c33-4f1f-b8a3-aa41f09ee8d8'
    when 'de-a1-start-guten-abend' then '91c2290b-eb5c-43f8-a203-d864c4cd9341'
    when 'de-a1-start-tschuess-greet' then '97e2a403-f3df-4eef-be6c-3b36cca954ae'
    when 'de-a1-start-auf-wiedersehen' then '1f9ecd64-d814-4773-9838-0213c8e943df'
    when 'de-a1-start-bis-spaeter' then '4c8ec5a8-2a5d-4610-b79e-a2f62b2950aa'
    when 'de-a1-start-gute-nacht' then '3385e2dd-2d7e-4883-9ca2-366289cf6622'
    when 'de-a1-start-bitte' then 'b4588abe-3e29-474e-8faf-a70665b78b2b'
    when 'de-a1-start-danke' then '15690a99-6a40-4a98-be14-d6897668c8ba'
    when 'de-a1-start-entschuldigung' then 'da539cb9-868c-4c45-844b-b3f5200b0f46'
    when 'de-a1-start-ja' then '2bbfa62c-43f8-4063-83bb-aaeed01503d9'
    when 'de-a1-start-nein' then '30420a5e-c46f-436d-8311-bb0234d7fd84'
    when 'de-a1-start-ich-heisse' then 'fb1ce7a5-3a5d-46f7-9c0c-ed4303ad6289'
    when 'de-a1-start-wie-heisst-du' then '221910fe-5d97-4750-b7e6-e849d116a72b'
    when 'de-a1-people-ich' then 'c13247b6-b7a8-43d9-ad0d-24540691398d'
    when 'de-a1-people-du' then '655eb687-1b8b-44cf-b839-c96058990a87'
    when 'de-a1-people-er' then 'd282f156-c42b-4430-8068-04f611ad4224'
    when 'de-a1-people-sie' then '15af8e91-4c48-4004-abf2-4779c8b62bfa'
    when 'de-a1-people-wir' then '9cccbb19-6463-4984-aaef-a4c6b83516ed'
    when 'de-a1-people-ich-bin' then '55efa16f-88ac-4307-9c34-983524506945'
    when 'de-a1-people-du-bist' then '856d1b66-7ea3-4494-8fd5-52977935fa03'
    when 'de-a1-people-ich-habe' then 'a4e50e8d-9bd5-4d6f-a220-3aa77229b95b'
    when 'de-a1-people-du-hast' then 'd741ca99-ff1c-490c-a998-d4b379ac2229'
    when 'de-a1-people-mutter' then '2fd72127-f1e4-410b-a5bf-976e4a3d9ca4'
    when 'de-a1-people-vater' then '9c99f332-4d88-4798-a817-d528c41a6522'
    when 'de-a1-people-kind' then '21b49764-06ca-4b1e-9a4e-23c6d8ce17fc'
    when 'de-a1-people-freund' then '5a48360a-5f42-4750-b243-e3596e2320f7'
    when 'de-a1-people-freundin' then 'd2d31575-0662-4c3e-8d76-5c0eb6e2b369'
    when 'de-a1-numbers-time-null' then 'e073971a-54f9-40d0-bfec-54642ba9b0fa'
    when 'de-a1-numbers-time-eins' then 'fe241acb-7abf-4672-ba2d-12f91d7c749e'
    when 'de-a1-numbers-time-zwei' then 'aa04fb77-40b9-4399-8f19-ab5cbac6cffc'
    when 'de-a1-numbers-time-drei' then '18582dd5-87af-4e8b-acad-e259554d9125'
    when 'de-a1-numbers-time-vier' then 'f34129b1-82de-4f46-b688-a74d85788c48'
    when 'de-a1-numbers-time-fuenf' then '178f439f-6c6e-4971-a6b5-6150122d321f'
    when 'de-a1-numbers-time-sechs' then 'b68f6870-b10d-4394-a67a-889f78455dab'
    when 'de-a1-numbers-time-sieben' then 'ab884ec3-f9c6-4ccc-af6e-37ec4de662a1'
    when 'de-a1-numbers-time-acht' then '7cb98408-5a37-4006-a2c2-7ca307e1e337'
    when 'de-a1-numbers-time-neun' then 'a762e911-c8b5-44b3-84ce-f02fa0d10c87'
    when 'de-a1-numbers-time-zehn' then '006f6830-c696-440a-8375-13b657adced1'
    when 'de-a1-numbers-time-heute' then '2346ee0b-5384-476f-80d0-a2d27da339a0'
    when 'de-a1-numbers-time-morgen' then '32715426-7413-4a36-828c-a2bbb62c565f'
    when 'de-a1-numbers-time-gestern' then '942e1f7f-6d15-4408-9d69-8c0d6064b3ba'
    when 'de-a1-numbers-time-tag' then '93882985-08b4-4a52-9f06-7c573c326b7e'
    when 'de-a1-numbers-time-woche' then '5c7ae1d1-8761-42bc-bcdb-eff1fc57bc2c'
    when 'de-a1-numbers-time-montag' then 'c0eb786e-caee-4770-a169-ecd36f272f41'
    when 'de-a1-numbers-time-dienstag' then '803cd274-808d-4ded-b95c-1378d25fcfa3'
    when 'de-a1-numbers-time-mittwoch' then '5bf2beaa-ffb6-408e-8a75-06f6ad766484'
    when 'de-a1-numbers-time-donnerstag' then 'e46b339c-5b3e-4a58-80a6-b1763889e016'
    when 'de-a1-numbers-time-freitag' then 'b5d4cb5a-90b7-4cfc-9f96-0b7b3326b6b1'
    when 'de-a1-numbers-time-samstag' then '48a7652d-c081-4bc5-aadd-f5be195c5022'
    when 'de-a1-numbers-time-sonntag' then '6a66cea0-9be1-4fcf-8a60-53807cd76a60'
    when 'de-a1-colors-rot' then '3b35ab01-e94a-4b35-940b-72778f5a102e'
    when 'de-a1-colors-blau' then 'cdca0d6d-f006-416f-98d1-304f593976c0'
    when 'de-a1-colors-gelb' then '1c672ee0-9429-42c9-9c85-246432c5f252'
    when 'de-a1-colors-gruen' then 'dbdafe4c-679e-43d0-8401-207c91465b4b'
    when 'de-a1-colors-schwarz' then '94f1e34c-f7dd-49b0-bbbe-7b6d1d0c083d'
    when 'de-a1-colors-weiss' then '211ed013-b1a8-4b11-bdbf-c48e66cc86fc'
    when 'de-a1-colors-orange' then 'eb8abf87-e993-4759-9a49-0a6114dcf782'
    when 'de-a1-colors-lila' then 'a7d51e17-22e8-4e21-8e20-9f2c0dfd658d'
    when 'de-a1-colors-rosa' then '6dda3752-5bf0-4e87-9d69-7a5628f2912e'
    when 'de-a1-colors-braun' then 'f4e7e49a-9aa7-49f0-972c-0072d8087a13'
    else image_id end,
  audio_url = case slug
    when 'de-a1-start-hallo' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704184900/de-a1-start-hallo.mp3'
    when 'de-a1-start-guten-morgen' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704184900/de-a1-start-guten-morgen.mp3'
    when 'de-a1-start-guten-tag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704184900/de-a1-start-guten-tag.mp3'
    when 'de-a1-start-guten-abend' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704184900/de-a1-start-guten-abend.mp3'
    when 'de-a1-start-tschuess-greet' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-tschuess-greet.mp3'
    when 'de-a1-start-auf-wiedersehen' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-auf-wiedersehen.mp3'
    when 'de-a1-start-bis-spaeter' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-bis-spaeter.mp3'
    when 'de-a1-start-gute-nacht' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-gute-nacht.mp3'
    when 'de-a1-start-bitte' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-politeness-20260704184900/de-a1-start-bitte.mp3'
    when 'de-a1-start-danke' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-politeness-20260704184900/de-a1-start-danke.mp3'
    when 'de-a1-start-entschuldigung' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-politeness-20260704184900/de-a1-start-entschuldigung.mp3'
    when 'de-a1-start-ja' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-ja.mp3'
    when 'de-a1-start-nein' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-nein.mp3'
    when 'de-a1-start-ich-heisse' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-ich-heisse.mp3'
    when 'de-a1-start-wie-heisst-du' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-wie-heisst-du.mp3'
    when 'de-a1-people-ich' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-ich.mp3'
    when 'de-a1-people-du' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-du.mp3'
    when 'de-a1-people-er' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-er.mp3'
    when 'de-a1-people-sie' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-sie.mp3'
    when 'de-a1-people-wir' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-wir.mp3'
    when 'de-a1-people-ich-bin' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-sein-haben-20260704184900/de-a1-people-ich-bin.mp3'
    when 'de-a1-people-du-bist' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-sein-haben-20260704184900/de-a1-people-du-bist.mp3'
    when 'de-a1-people-ich-habe' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-sein-haben-20260704184900/de-a1-people-ich-habe.mp3'
    when 'de-a1-people-du-hast' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-sein-haben-20260704184900/de-a1-people-du-hast.mp3'
    when 'de-a1-people-mutter' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-family-20260704184900/de-a1-people-mutter.mp3'
    when 'de-a1-people-vater' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-family-20260704184900/de-a1-people-vater.mp3'
    when 'de-a1-people-kind' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-family-20260704184900/de-a1-people-kind.mp3'
    when 'de-a1-people-freund' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-family-20260704184900/de-a1-people-freund.mp3'
    when 'de-a1-people-freundin' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-family-20260704184900/de-a1-people-freundin.mp3'
    when 'de-a1-numbers-time-null' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-null.mp3'
    when 'de-a1-numbers-time-eins' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-eins.mp3'
    when 'de-a1-numbers-time-zwei' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-zwei.mp3'
    when 'de-a1-numbers-time-drei' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-drei.mp3'
    when 'de-a1-numbers-time-vier' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-vier.mp3'
    when 'de-a1-numbers-time-fuenf' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-fuenf.mp3'
    when 'de-a1-numbers-time-sechs' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-sechs.mp3'
    when 'de-a1-numbers-time-sieben' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-sieben.mp3'
    when 'de-a1-numbers-time-acht' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-acht.mp3'
    when 'de-a1-numbers-time-neun' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-neun.mp3'
    when 'de-a1-numbers-time-zehn' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/numbers-zero-ten-20260704184900/de-a1-numbers-time-zehn.mp3'
    when 'de-a1-numbers-time-heute' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/time-words-20260704184900/de-a1-numbers-time-heute.mp3'
    when 'de-a1-numbers-time-morgen' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/time-words-20260704184900/de-a1-numbers-time-morgen.mp3'
    when 'de-a1-numbers-time-gestern' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/time-words-20260704184900/de-a1-numbers-time-gestern.mp3'
    when 'de-a1-numbers-time-tag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/time-words-20260704184900/de-a1-numbers-time-tag.mp3'
    when 'de-a1-numbers-time-woche' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/time-words-20260704184900/de-a1-numbers-time-woche.mp3'
    when 'de-a1-numbers-time-montag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-montag.mp3'
    when 'de-a1-numbers-time-dienstag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-dienstag.mp3'
    when 'de-a1-numbers-time-mittwoch' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-mittwoch.mp3'
    when 'de-a1-numbers-time-donnerstag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-donnerstag.mp3'
    when 'de-a1-numbers-time-freitag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-freitag.mp3'
    when 'de-a1-numbers-time-samstag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-samstag.mp3'
    when 'de-a1-numbers-time-sonntag' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/weekdays-20260704184900/de-a1-numbers-time-sonntag.mp3'
    when 'de-a1-colors-rot' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-rot.mp3'
    when 'de-a1-colors-blau' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-blau.mp3'
    when 'de-a1-colors-gelb' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-gelb.mp3'
    when 'de-a1-colors-gruen' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-gruen.mp3'
    when 'de-a1-colors-schwarz' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-schwarz.mp3'
    when 'de-a1-colors-weiss' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-weiss.mp3'
    when 'de-a1-colors-orange' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-orange.mp3'
    when 'de-a1-colors-lila' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-lila.mp3'
    when 'de-a1-colors-rosa' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-rosa.mp3'
    when 'de-a1-colors-braun' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/colors-basic-colors-20260704201349/de-a1-colors-braun.mp3'
    else audio_url end
where slug in ('de-a1-start-hallo', 'de-a1-start-guten-morgen', 'de-a1-start-guten-tag', 'de-a1-start-guten-abend', 'de-a1-start-tschuess-greet', 'de-a1-start-auf-wiedersehen', 'de-a1-start-bis-spaeter', 'de-a1-start-gute-nacht', 'de-a1-start-bitte', 'de-a1-start-danke', 'de-a1-start-entschuldigung', 'de-a1-start-ja', 'de-a1-start-nein', 'de-a1-start-ich-heisse', 'de-a1-start-wie-heisst-du', 'de-a1-people-ich', 'de-a1-people-du', 'de-a1-people-er', 'de-a1-people-sie', 'de-a1-people-wir', 'de-a1-people-ich-bin', 'de-a1-people-du-bist', 'de-a1-people-ich-habe', 'de-a1-people-du-hast', 'de-a1-people-mutter', 'de-a1-people-vater', 'de-a1-people-kind', 'de-a1-people-freund', 'de-a1-people-freundin', 'de-a1-numbers-time-null', 'de-a1-numbers-time-eins', 'de-a1-numbers-time-zwei', 'de-a1-numbers-time-drei', 'de-a1-numbers-time-vier', 'de-a1-numbers-time-fuenf', 'de-a1-numbers-time-sechs', 'de-a1-numbers-time-sieben', 'de-a1-numbers-time-acht', 'de-a1-numbers-time-neun', 'de-a1-numbers-time-zehn', 'de-a1-numbers-time-heute', 'de-a1-numbers-time-morgen', 'de-a1-numbers-time-gestern', 'de-a1-numbers-time-tag', 'de-a1-numbers-time-woche', 'de-a1-numbers-time-montag', 'de-a1-numbers-time-dienstag', 'de-a1-numbers-time-mittwoch', 'de-a1-numbers-time-donnerstag', 'de-a1-numbers-time-freitag', 'de-a1-numbers-time-samstag', 'de-a1-numbers-time-sonntag', 'de-a1-colors-rot', 'de-a1-colors-blau', 'de-a1-colors-gelb', 'de-a1-colors-gruen', 'de-a1-colors-schwarz', 'de-a1-colors-weiss', 'de-a1-colors-orange', 'de-a1-colors-lila', 'de-a1-colors-rosa', 'de-a1-colors-braun');

commit;
