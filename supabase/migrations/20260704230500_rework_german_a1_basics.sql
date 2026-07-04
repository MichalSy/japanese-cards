-- Rework German A1 into one clear Basic group and attach complete media.

begin;

-- Hide the fragmented active groups from the A1 track. Their cards stay reused below.
delete from language_cards_track_categories tc using language_cards_tracks t, language_cards_categories c
where tc.track_id = t.id and tc.category_id = c.id
  and t.language_id = 'de' and t.slug = 'de-a1'
  and c.slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors');

update language_cards_categories set is_active = false, status = 'planned'
where language_id = 'de' and slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors');
update language_cards_learning_courses set is_active = false, status = 'planned'
where category_id in (select id from language_cards_categories where language_id = 'de' and slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors'));
update language_cards_learning_lessons set is_active = false, status = 'planned'
where course_id in (select id from language_cards_learning_courses where category_id in (select id from language_cards_categories where language_id = 'de' and slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors')));
update language_cards_practice_groups set is_active = false, status = 'planned'
where category_id in (select id from language_cards_categories where language_id = 'de' and slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors'));

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de', 'de-a1-basics', 'A1 Basics', '🌱', '#22c55e', 'vocabulary', array['swipe']::text[], false, 1, true, 'active')
on conflict (id) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ('8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de', 'A1 Basics', 'Der aufgeräumte Einstieg: Begrüßen, erste Sätze, Menschen, Familie, Zahlen, Zeit und Farben.'),
  ('8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'en', 'A1 Basics', 'A clean beginner start: greetings, first sentences, people, family, numbers, time, and colors.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 1)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

update language_cards_track_translations set description = case lang_code
  when 'de' then 'Ein ruhiger A1-Einstieg mit vier Basic-Lektionen.'
  when 'en' then 'A clean A1 start with four basic lessons.'
  else description end
where track_id = (select id from language_cards_tracks where language_id='de' and slug='de-a1') and lang_code in ('de','en');

update language_cards_categories set sort_order = case slug
  when 'de-a1-basics' then 1
  when 'de-a1-home-city' then 2
  when 'de-a1-food-shopping' then 3
  when 'de-a1-daily-life' then 4
  when 'de-a1-grammar' then 5
  when 'de-a1-dialogues' then 6
  else sort_order end
where language_id='de' and slug in ('de-a1-basics','de-a1-home-city','de-a1-food-shopping','de-a1-daily-life','de-a1-grammar','de-a1-dialogues');
update language_cards_track_categories tc set sort_order = case c.slug
  when 'de-a1-basics' then 1
  when 'de-a1-home-city' then 2
  when 'de-a1-food-shopping' then 3
  when 'de-a1-daily-life' then 4
  when 'de-a1-grammar' then 5
  when 'de-a1-dialogues' then 6
  else tc.sort_order end
from language_cards_categories c, language_cards_tracks t
where tc.category_id = c.id and tc.track_id = t.id and t.language_id='de' and t.slug='de-a1'
  and c.slug in ('de-a1-basics','de-a1-home-city','de-a1-food-shopping','de-a1-daily-life','de-a1-grammar','de-a1-dialogues');

insert into language_cards_learning_courses (id, category_id, slug, level, sort_order, is_active, status)
values ('e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-course', 'A1', 1, true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, level=excluded.level, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_course_translations (course_id, lang_code, title, description) values
  ('e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de', 'Deutsch A1 Basics', 'Alles Wichtige für den ersten Einstieg, sauber gruppiert.'),
  ('e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'en', 'German A1 Basics', 'The essential first steps, grouped clearly.')
on conflict (course_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('79e917b8-65c5-49ef-a13d-e988b52f22fb', 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de-a1-basics-first-words', 1, true, 'active')
on conflict (id) do update set course_id=excluded.course_id, slug=excluded.slug, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', 'de', 'Erste Worte und Sätze', '16 Lernkarten, 16 Quizkarten.'),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', 'en', 'First words and sentences', '16 learning cards, 16 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;
insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('95d1098b-b418-43c2-8e4f-4ad43468c54c', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-first-words', 1, array['swipe']::text[], true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', 'de', 'Erste Worte und Sätze'),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', 'en', 'First words and sentences')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;
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
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-tschuess'), 12),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ja'), 13),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-nein'), 14),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ich-heisse'), 15),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du'), 16),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-hallo-quiz'), 17),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-morgen-quiz'), 18),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-tag-quiz'), 19),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-guten-abend-quiz'), 20),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-tschuess-greet-quiz'), 21),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-auf-wiedersehen-quiz'), 22),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bis-spaeter-quiz'), 23),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-gute-nacht-quiz'), 24),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-bitte-quiz'), 25),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-danke-quiz'), 26),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-entschuldigung-quiz'), 27),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-tschuess-quiz'), 28),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ja-quiz'), 29),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-nein-quiz'), 30),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-ich-heisse-quiz'), 31),
  ('79e917b8-65c5-49ef-a13d-e988b52f22fb', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du-quiz'), 32);
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
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-tschuess'), 12),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-ja'), 13),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-nein'), 14),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-ich-heisse'), 15),
  ('95d1098b-b418-43c2-8e4f-4ad43468c54c', (select id from language_cards_cards where slug='de-a1-start-wie-heisst-du'), 16);

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('c729e014-3ea2-4ccc-92e5-6d67c4729747', 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de-a1-basics-people-family', 2, true, 'active')
on conflict (id) do update set course_id=excluded.course_id, slug=excluded.slug, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', 'de', 'Menschen und Familie', '15 Lernkarten, 15 Quizkarten.'),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', 'en', 'People and family', '15 learning cards, 15 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;
insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('24261491-226a-4f8b-8d6e-792906125afb', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-people-family', 2, array['swipe']::text[], true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ('24261491-226a-4f8b-8d6e-792906125afb', 'de', 'Menschen und Familie'),
  ('24261491-226a-4f8b-8d6e-792906125afb', 'en', 'People and family')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;
delete from language_cards_learning_lesson_cards where lesson_id = 'c729e014-3ea2-4ccc-92e5-6d67c4729747';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order)
values
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich'), 1),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du'), 2),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-er'), 3),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie'), 4),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-wir'), 5),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie-formal'), 6),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-bin'), 7),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-bist'), 8),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-habe'), 9),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-hast'), 10),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-mutter'), 11),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-vater'), 12),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-kind'), 13),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freund'), 14),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freundin'), 15),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-quiz'), 16),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-quiz'), 17),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-er-quiz'), 18),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie-quiz'), 19),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-wir-quiz'), 20),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-sie-formal-quiz'), 21),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-bin-quiz'), 22),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-bist-quiz'), 23),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-ich-habe-quiz'), 24),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-du-hast-quiz'), 25),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-mutter-quiz'), 26),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-vater-quiz'), 27),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-kind-quiz'), 28),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freund-quiz'), 29),
  ('c729e014-3ea2-4ccc-92e5-6d67c4729747', (select id from language_cards_cards where slug='de-a1-people-freundin-quiz'), 30);
delete from language_cards_practice_group_cards where practice_group_id = '24261491-226a-4f8b-8d6e-792906125afb';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
values
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich'), 1),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du'), 2),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-er'), 3),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-sie'), 4),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-wir'), 5),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-sie-formal'), 6),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich-bin'), 7),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du-bist'), 8),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-ich-habe'), 9),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-du-hast'), 10),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-mutter'), 11),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-vater'), 12),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-kind'), 13),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-freund'), 14),
  ('24261491-226a-4f8b-8d6e-792906125afb', (select id from language_cards_cards where slug='de-a1-people-freundin'), 15);

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de-a1-basics-numbers-time', 3, true, 'active')
on conflict (id) do update set course_id=excluded.course_id, slug=excluded.slug, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', 'de', 'Zahlen und Zeit', '23 Lernkarten, 23 Quizkarten.'),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', 'en', 'Numbers and time', '23 learning cards, 23 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;
insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('ba8051ad-ef84-4607-9e76-af2ae5a14677', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-numbers-time', 3, array['swipe']::text[], true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', 'de', 'Zahlen und Zeit'),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', 'en', 'Numbers and time')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;
delete from language_cards_learning_lesson_cards where lesson_id = '7cb16972-017f-45d9-9c0d-2d1842fe8b02';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order)
values
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-null'), 1),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-eins'), 2),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-zwei'), 3),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-drei'), 4),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-vier'), 5),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-fuenf'), 6),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sechs'), 7),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sieben'), 8),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-acht'), 9),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-neun'), 10),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-zehn'), 11),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-heute'), 12),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-morgen'), 13),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-gestern'), 14),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-tag'), 15),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-woche'), 16),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-montag'), 17),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-dienstag'), 18),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-mittwoch'), 19),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-donnerstag'), 20),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-freitag'), 21),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-samstag'), 22),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sonntag'), 23),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-null-quiz'), 24),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-eins-quiz'), 25),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-zwei-quiz'), 26),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-drei-quiz'), 27),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-vier-quiz'), 28),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-fuenf-quiz'), 29),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sechs-quiz'), 30),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sieben-quiz'), 31),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-acht-quiz'), 32),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-neun-quiz'), 33),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-zehn-quiz'), 34),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-heute-quiz'), 35),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-morgen-quiz'), 36),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-gestern-quiz'), 37),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-tag-quiz'), 38),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-woche-quiz'), 39),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-montag-quiz'), 40),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-dienstag-quiz'), 41),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-mittwoch-quiz'), 42),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-donnerstag-quiz'), 43),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-freitag-quiz'), 44),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-samstag-quiz'), 45),
  ('7cb16972-017f-45d9-9c0d-2d1842fe8b02', (select id from language_cards_cards where slug='de-a1-numbers-time-sonntag-quiz'), 46);
delete from language_cards_practice_group_cards where practice_group_id = 'ba8051ad-ef84-4607-9e76-af2ae5a14677';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
values
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-null'), 1),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-eins'), 2),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-zwei'), 3),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-drei'), 4),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-vier'), 5),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-fuenf'), 6),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-sechs'), 7),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-sieben'), 8),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-acht'), 9),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-neun'), 10),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-zehn'), 11),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-heute'), 12),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-morgen'), 13),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-gestern'), 14),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-tag'), 15),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-woche'), 16),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-montag'), 17),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-dienstag'), 18),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-mittwoch'), 19),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-donnerstag'), 20),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-freitag'), 21),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-samstag'), 22),
  ('ba8051ad-ef84-4607-9e76-af2ae5a14677', (select id from language_cards_cards where slug='de-a1-numbers-time-sonntag'), 23);

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('e348e900-2a49-4f38-ae65-56d655a3bcf4', 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de-a1-basics-colors', 4, true, 'active')
on conflict (id) do update set course_id=excluded.course_id, slug=excluded.slug, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', 'de', 'Farben', '10 Lernkarten, 10 Quizkarten.'),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', 'en', 'Colors', '10 learning cards, 10 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;
insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('8da4d89c-8aac-4a23-b863-bb85998ba84c', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-colors', 4, array['swipe']::text[], true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', 'de', 'Farben'),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', 'en', 'Colors')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;
delete from language_cards_learning_lesson_cards where lesson_id = 'e348e900-2a49-4f38-ae65-56d655a3bcf4';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order)
values
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-rot'), 1),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-blau'), 2),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-gelb'), 3),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-gruen'), 4),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-schwarz'), 5),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-weiss'), 6),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-orange'), 7),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-lila'), 8),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-rosa'), 9),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-braun'), 10),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-rot-quiz'), 11),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-blau-quiz'), 12),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-gelb-quiz'), 13),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-gruen-quiz'), 14),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-schwarz-quiz'), 15),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-weiss-quiz'), 16),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-orange-quiz'), 17),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-lila-quiz'), 18),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-rosa-quiz'), 19),
  ('e348e900-2a49-4f38-ae65-56d655a3bcf4', (select id from language_cards_cards where slug='de-a1-colors-braun-quiz'), 20);
delete from language_cards_practice_group_cards where practice_group_id = '8da4d89c-8aac-4a23-b863-bb85998ba84c';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order)
values
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-rot'), 1),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-blau'), 2),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-gelb'), 3),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-gruen'), 4),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-schwarz'), 5),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-weiss'), 6),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-orange'), 7),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-lila'), 8),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-rosa'), 9),
  ('8da4d89c-8aac-4a23-b863-bb85998ba84c', (select id from language_cards_cards where slug='de-a1-colors-braun'), 10);

update language_cards_cards set
  image_id = case slug
    when 'de-a1-start-hallo' then 'fc46bfec-66c4-4366-bfb0-3af143876ac8'
    when 'de-a1-start-guten-morgen' then '81bc9ce5-4436-4b16-8768-62f823547927'
    when 'de-a1-start-guten-tag' then '6f2bbaf4-7c33-4f1f-b8a3-aa41f09ee8d8'
    when 'de-a1-start-guten-abend' then '91c2290b-eb5c-43f8-a203-d864c4cd9341'
    when 'de-a1-start-tschuess-greet' then '367412f7-31eb-4b6e-ad1e-d0af65b9528b'
    when 'de-a1-start-auf-wiedersehen' then 'b1579d23-990d-4513-a068-5c7dc88a3146'
    when 'de-a1-start-bis-spaeter' then 'bcb98c98-aa99-494b-80f3-a0d8a0683f2a'
    when 'de-a1-start-gute-nacht' then 'b4885d0c-9e73-467c-acd5-a34e328c054b'
    when 'de-a1-start-bitte' then '963f8bf7-05e8-45d4-a9f0-026c492bd150'
    when 'de-a1-start-danke' then '00495714-5a75-430b-bc71-8b749d1231be'
    when 'de-a1-start-entschuldigung' then '66edc288-40bf-4f5b-96df-857997a9c372'
    when 'de-a1-start-tschuess' then 'b8e56f83-918e-46a3-bbfb-c9c6543eb243'
    when 'de-a1-start-ja' then '3badf3b0-cecf-420c-a56a-155ddf562bc8'
    when 'de-a1-start-nein' then 'af241498-062b-4d9a-996e-79b7c8212c2e'
    when 'de-a1-start-ich-heisse' then '590a82a5-73b3-472d-a2b5-8b804f55401d'
    when 'de-a1-start-wie-heisst-du' then '815c5570-482d-46c5-baff-d84f8e0092db'
    when 'de-a1-people-ich' then '1e537b42-840d-4a46-91b6-b4af31933b77'
    when 'de-a1-people-du' then 'd991b8cc-7ebe-4fe9-9e4b-9486361cbd96'
    when 'de-a1-people-er' then '6497cd01-c119-45a3-83c5-5858cafad206'
    when 'de-a1-people-sie' then 'c958194b-6c5c-4c1a-9e6a-340c1bdd3c3e'
    when 'de-a1-people-wir' then 'b65d1a7b-1934-4a36-be72-5795275ffafa'
    when 'de-a1-people-sie-formal' then 'b811166e-b2eb-4dda-87da-bc82c2db4f47'
    when 'de-a1-people-ich-bin' then 'cb8abbaf-8b44-45ad-bd13-35cdd2f2dec9'
    when 'de-a1-people-du-bist' then '56900450-e8d9-41b7-bec6-8ce5ff923728'
    when 'de-a1-people-ich-habe' then '7a908723-7654-4e79-bfaf-f2c0bf0beebe'
    when 'de-a1-people-du-hast' then '5bd51038-27f9-450a-8649-10389b7651ff'
    when 'de-a1-people-mutter' then '190b673a-1c4d-4578-b66c-abbb67281cbf'
    when 'de-a1-people-vater' then '85d085ab-c953-43a9-870b-74e5e10aa01d'
    when 'de-a1-people-kind' then 'fc6a056c-5226-4fa0-9b58-708ebe53c89b'
    when 'de-a1-people-freund' then 'a381b12a-f428-4220-947b-1710ed50f24a'
    when 'de-a1-people-freundin' then 'e309f830-4302-4d58-adca-a47729a86ef7'
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
    when 'de-a1-numbers-time-heute' then '2eb18f2c-cad2-4fea-a0bc-c449fb10043f'
    when 'de-a1-numbers-time-morgen' then 'e1d764ec-f4fd-41d5-b3c4-a954a4b2d04f'
    when 'de-a1-numbers-time-gestern' then 'f615952e-ce77-48cf-9a9d-42d6f928907a'
    when 'de-a1-numbers-time-tag' then '2e6a9e36-bea7-41da-9d5d-ce234c196956'
    when 'de-a1-numbers-time-woche' then '07daceca-30a9-485e-a957-bfeebb404ea5'
    when 'de-a1-numbers-time-montag' then '40bad50c-06cb-4ff4-aaef-b9456aee02c9'
    when 'de-a1-numbers-time-dienstag' then '7dcd9e1b-612e-43d4-ad01-673a3e03ea2d'
    when 'de-a1-numbers-time-mittwoch' then '4f8f2c74-b35c-4a01-a5ea-1f28c66f610e'
    when 'de-a1-numbers-time-donnerstag' then 'c82b8313-9d16-4701-8035-afd440762191'
    when 'de-a1-numbers-time-freitag' then 'ae3e4e08-d1e0-4eb1-b590-962603c7d01f'
    when 'de-a1-numbers-time-samstag' then 'bab5bb29-5306-4cee-b932-426c4d0f8fd6'
    when 'de-a1-numbers-time-sonntag' then '44f6ab09-fb31-4541-983e-133caf5de2f7'
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
    when 'de-a1-start-tschuess' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-politeness-20260704184900/de-a1-start-tschuess.mp3'
    when 'de-a1-start-ja' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-ja.mp3'
    when 'de-a1-start-nein' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-nein.mp3'
    when 'de-a1-start-ich-heisse' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-ich-heisse.mp3'
    when 'de-a1-start-wie-heisst-du' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-mini-sentences-20260704184900/de-a1-start-wie-heisst-du.mp3'
    when 'de-a1-people-ich' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-ich.mp3'
    when 'de-a1-people-du' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-du.mp3'
    when 'de-a1-people-er' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-er.mp3'
    when 'de-a1-people-sie' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-sie.mp3'
    when 'de-a1-people-wir' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-wir.mp3'
    when 'de-a1-people-sie-formal' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/people-pronouns-20260704184900/de-a1-people-sie-formal.mp3'
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
where slug in ('de-a1-start-hallo', 'de-a1-start-guten-morgen', 'de-a1-start-guten-tag', 'de-a1-start-guten-abend', 'de-a1-start-tschuess-greet', 'de-a1-start-auf-wiedersehen', 'de-a1-start-bis-spaeter', 'de-a1-start-gute-nacht', 'de-a1-start-bitte', 'de-a1-start-danke', 'de-a1-start-entschuldigung', 'de-a1-start-tschuess', 'de-a1-start-ja', 'de-a1-start-nein', 'de-a1-start-ich-heisse', 'de-a1-start-wie-heisst-du', 'de-a1-people-ich', 'de-a1-people-du', 'de-a1-people-er', 'de-a1-people-sie', 'de-a1-people-wir', 'de-a1-people-sie-formal', 'de-a1-people-ich-bin', 'de-a1-people-du-bist', 'de-a1-people-ich-habe', 'de-a1-people-du-hast', 'de-a1-people-mutter', 'de-a1-people-vater', 'de-a1-people-kind', 'de-a1-people-freund', 'de-a1-people-freundin', 'de-a1-numbers-time-null', 'de-a1-numbers-time-eins', 'de-a1-numbers-time-zwei', 'de-a1-numbers-time-drei', 'de-a1-numbers-time-vier', 'de-a1-numbers-time-fuenf', 'de-a1-numbers-time-sechs', 'de-a1-numbers-time-sieben', 'de-a1-numbers-time-acht', 'de-a1-numbers-time-neun', 'de-a1-numbers-time-zehn', 'de-a1-numbers-time-heute', 'de-a1-numbers-time-morgen', 'de-a1-numbers-time-gestern', 'de-a1-numbers-time-tag', 'de-a1-numbers-time-woche', 'de-a1-numbers-time-montag', 'de-a1-numbers-time-dienstag', 'de-a1-numbers-time-mittwoch', 'de-a1-numbers-time-donnerstag', 'de-a1-numbers-time-freitag', 'de-a1-numbers-time-samstag', 'de-a1-numbers-time-sonntag', 'de-a1-colors-rot', 'de-a1-colors-blau', 'de-a1-colors-gelb', 'de-a1-colors-gruen', 'de-a1-colors-schwarz', 'de-a1-colors-weiss', 'de-a1-colors-orange', 'de-a1-colors-lila', 'de-a1-colors-rosa', 'de-a1-colors-braun');

commit;
