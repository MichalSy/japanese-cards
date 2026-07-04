-- Add German A1 colors as a complete 10-card learning and practice group.

begin;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status) values ('5d9aa311-57b2-5e39-852f-01d9752edd41', 'de', 'de-a1-colors', 'Farben', '🎨', '#f97316', 'vocabulary', array['swipe']::text[], false, 4, true, 'active') on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values ('5d9aa311-57b2-5e39-852f-01d9752edd41', 'de', 'Farben', 'Farben erkennen und einfache Beschreibungen.'), ('5d9aa311-57b2-5e39-852f-01d9752edd41', 'en', 'Colors', 'Recognize colors and simple descriptions.') on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_track_categories (track_id, category_id, sort_order) values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), '5d9aa311-57b2-5e39-852f-01d9752edd41', 4) on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_courses (id, category_id, slug, level, sort_order, is_active, status) values ('276485e5-fbe9-52ac-bcd7-bd05bd5ff18d', '5d9aa311-57b2-5e39-852f-01d9752edd41', 'de-a1-colors-basics', 'A1', 1, true, 'active') on conflict (category_id, slug) do update set level=excluded.level, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_course_translations (course_id, lang_code, title, description) values ('276485e5-fbe9-52ac-bcd7-bd05bd5ff18d', 'de', 'Deutsch A1: Farben', 'Die wichtigsten Farben für den Anfang.'), ('276485e5-fbe9-52ac-bcd7-bd05bd5ff18d', 'en', 'German A1: Colors', 'The most important colors for the beginning.') on conflict (course_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status) values ('7d1686af-29d1-5787-9586-a816276a7a41', '276485e5-fbe9-52ac-bcd7-bd05bd5ff18d', 'de-a1-colors-basic-colors', 1, true, 'active') on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values ('7d1686af-29d1-5787-9586-a816276a7a41', 'de', 'Grundfarben', '10 Farbkarten, 10 Quizkarten.'), ('7d1686af-29d1-5787-9586-a816276a7a41', 'en', 'Basic colors', '10 color cards, 10 quiz cards.') on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status) values ('360e8029-10b9-576d-ab0b-ec15af4fff39', '5d9aa311-57b2-5e39-852f-01d9752edd41', 'de-a1-colors-basic-colors', 1, array['swipe']::text[], true, 'active') on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values ('360e8029-10b9-576d-ab0b-ec15af4fff39', 'de', 'Grundfarben'), ('360e8029-10b9-576d-ab0b-ec15af4fff39', 'en', 'Basic colors') on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data) values
('5d3b5bb9-017b-5227-96b9-4388c548f660', 'de-a1-colors-rot', 'vocabulary', 'rot', 'rot', 'adjective', 'Das ist rot.', null, 'de-a1-colors', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('1eec76d9-6a3b-5369-8de8-422a1fb79234', 'de-a1-colors-blau', 'vocabulary', 'blau', 'blau', 'adjective', 'Der Himmel ist blau.', null, 'de-a1-colors', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('a9e27601-98c7-56e1-ac99-ecee6a8007e6', 'de-a1-colors-gelb', 'vocabulary', 'gelb', 'gelp', 'adjective', 'Die Sonne ist gelb.', null, 'de-a1-colors', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('97ea5b89-f20c-5cf4-a217-d6c185140805', 'de-a1-colors-gruen', 'vocabulary', 'grün', 'grün', 'adjective', 'Das Blatt ist grün.', null, 'de-a1-colors', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('14c897b2-7729-5e83-807f-204fa5d64b70', 'de-a1-colors-schwarz', 'vocabulary', 'schwarz', 'schwarz', 'adjective', 'Die Katze ist schwarz.', null, 'de-a1-colors', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('a75e57bf-f593-5505-938f-f7ecce0f2334', 'de-a1-colors-weiss', 'vocabulary', 'weiß', 'weiß', 'adjective', 'Der Schnee ist weiß.', null, 'de-a1-colors', 'beginner', null, null, null, null, 6, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('292da31f-1fcd-5767-8b41-ef39fe55f249', 'de-a1-colors-orange', 'vocabulary', 'orange', 'o-RANG-sch', 'adjective', 'Die Orange ist orange.', null, 'de-a1-colors', 'beginner', null, null, null, null, 7, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('12e30b71-5daa-5c1f-900f-29dceb62013e', 'de-a1-colors-lila', 'vocabulary', 'lila', 'LI-la', 'adjective', 'Die Trauben sind lila.', null, 'de-a1-colors', 'beginner', null, null, null, null, 8, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('238113bd-e888-5d98-9095-a5296c9057c0', 'de-a1-colors-rosa', 'vocabulary', 'rosa', 'RO-za', 'adjective', 'Die Blume ist rosa.', null, 'de-a1-colors', 'beginner', null, null, null, null, 9, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb),
('a8d3b3b0-874e-518e-a8d8-42b2a8bf123c', 'de-a1-colors-braun', 'vocabulary', 'braun', 'braun', 'adjective', 'Der Teddy ist braun.', null, 'de-a1-colors', 'beginner', null, null, null, null, 10, true, '{"lesson_slug":"de-a1-colors-basic-colors","kind":"color","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
('5d3b5bb9-017b-5227-96b9-4388c548f660', 'de', 'rot', 'Das ist rot.', null),
('5d3b5bb9-017b-5227-96b9-4388c548f660', 'en', 'red', 'Das ist rot.', null),
('1eec76d9-6a3b-5369-8de8-422a1fb79234', 'de', 'blau', 'Der Himmel ist blau.', null),
('1eec76d9-6a3b-5369-8de8-422a1fb79234', 'en', 'blue', 'Der Himmel ist blau.', null),
('a9e27601-98c7-56e1-ac99-ecee6a8007e6', 'de', 'gelb', 'Die Sonne ist gelb.', null),
('a9e27601-98c7-56e1-ac99-ecee6a8007e6', 'en', 'yellow', 'Die Sonne ist gelb.', null),
('97ea5b89-f20c-5cf4-a217-d6c185140805', 'de', 'grün', 'Das Blatt ist grün.', null),
('97ea5b89-f20c-5cf4-a217-d6c185140805', 'en', 'green', 'Das Blatt ist grün.', null),
('14c897b2-7729-5e83-807f-204fa5d64b70', 'de', 'schwarz', 'Die Katze ist schwarz.', null),
('14c897b2-7729-5e83-807f-204fa5d64b70', 'en', 'black', 'Die Katze ist schwarz.', null),
('a75e57bf-f593-5505-938f-f7ecce0f2334', 'de', 'weiß', 'Der Schnee ist weiß.', null),
('a75e57bf-f593-5505-938f-f7ecce0f2334', 'en', 'white', 'Der Schnee ist weiß.', null),
('292da31f-1fcd-5767-8b41-ef39fe55f249', 'de', 'orange', 'Die Orange ist orange.', null),
('292da31f-1fcd-5767-8b41-ef39fe55f249', 'en', 'orange', 'Die Orange ist orange.', null),
('12e30b71-5daa-5c1f-900f-29dceb62013e', 'de', 'lila', 'Die Trauben sind lila.', null),
('12e30b71-5daa-5c1f-900f-29dceb62013e', 'en', 'purple', 'Die Trauben sind lila.', null),
('238113bd-e888-5d98-9095-a5296c9057c0', 'de', 'rosa', 'Die Blume ist rosa.', null),
('238113bd-e888-5d98-9095-a5296c9057c0', 'en', 'pink', 'Die Blume ist rosa.', null),
('a8d3b3b0-874e-518e-a8d8-42b2a8bf123c', 'de', 'braun', 'Der Teddy ist braun.', null),
('a8d3b3b0-874e-518e-a8d8-42b2a8bf123c', 'en', 'brown', 'Der Teddy ist braun.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data) values
('dda51782-1ec9-5600-a6b2-32246c7a0fb4', 'de-a1-colors-rot-quiz', 'quiz_4_option', 'rot', 'rot', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 11, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-rot","question":{"de":"Was bedeutet rot?","en":"What does rot mean?"},"options":[{"default_text":"color","translations":{"de":"rot","en":"red"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"grün","en":"green"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"orange","en":"orange"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"braun","en":"brown"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('e2e2d29a-1388-50bf-8d03-652b2034a31e', 'de-a1-colors-blau-quiz', 'quiz_4_option', 'blau', 'blau', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 12, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-blau","question":{"de":"Was bedeutet blau?","en":"What does blau mean?"},"options":[{"default_text":"color","translations":{"de":"blau","en":"blue"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"schwarz","en":"black"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"lila","en":"purple"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"rot","en":"red"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('bab71f18-4035-5937-88d3-f6ccf03a12ff', 'de-a1-colors-gelb-quiz', 'quiz_4_option', 'gelb', 'gelp', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 13, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-gelb","question":{"de":"Was bedeutet gelb?","en":"What does gelb mean?"},"options":[{"default_text":"color","translations":{"de":"gelb","en":"yellow"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"weiß","en":"white"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"rosa","en":"pink"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"blau","en":"blue"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('7701df6e-58d0-5165-9794-8416652f0fe5', 'de-a1-colors-gruen-quiz', 'quiz_4_option', 'grün', 'grün', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 14, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-gruen","question":{"de":"Was bedeutet grün?","en":"What does grün mean?"},"options":[{"default_text":"color","translations":{"de":"grün","en":"green"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"orange","en":"orange"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"braun","en":"brown"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"gelb","en":"yellow"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('0ff08e1f-b3d3-5ea8-8f23-ebeeb14173cc', 'de-a1-colors-schwarz-quiz', 'quiz_4_option', 'schwarz', 'schwarz', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 15, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-schwarz","question":{"de":"Was bedeutet schwarz?","en":"What does schwarz mean?"},"options":[{"default_text":"color","translations":{"de":"schwarz","en":"black"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"lila","en":"purple"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"rot","en":"red"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"grün","en":"green"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('421f0a3b-565a-5920-a89d-1aeeaf34ebcf', 'de-a1-colors-weiss-quiz', 'quiz_4_option', 'weiß', 'weiß', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 16, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-weiss","question":{"de":"Was bedeutet weiß?","en":"What does weiß mean?"},"options":[{"default_text":"color","translations":{"de":"weiß","en":"white"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"rosa","en":"pink"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"blau","en":"blue"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"schwarz","en":"black"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('cae30873-a908-569d-823d-c9ea044a8929', 'de-a1-colors-orange-quiz', 'quiz_4_option', 'orange', 'o-RANG-sch', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 17, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-orange","question":{"de":"Was bedeutet orange?","en":"What does orange mean?"},"options":[{"default_text":"color","translations":{"de":"orange","en":"orange"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"braun","en":"brown"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"gelb","en":"yellow"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"weiß","en":"white"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('92eb1e3e-b765-5305-946d-19451e54c703', 'de-a1-colors-lila-quiz', 'quiz_4_option', 'lila', 'LI-la', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 18, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-lila","question":{"de":"Was bedeutet lila?","en":"What does lila mean?"},"options":[{"default_text":"color","translations":{"de":"lila","en":"purple"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"rot","en":"red"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"grün","en":"green"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"orange","en":"orange"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('0ba0e61a-95de-5a7c-bc9c-20ad25b3cce3', 'de-a1-colors-rosa-quiz', 'quiz_4_option', 'rosa', 'RO-za', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 19, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-rosa","question":{"de":"Was bedeutet rosa?","en":"What does rosa mean?"},"options":[{"default_text":"color","translations":{"de":"rosa","en":"pink"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"blau","en":"blue"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"schwarz","en":"black"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"lila","en":"purple"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
('ec02ff9e-c41c-5278-9f71-025e6cd88beb', 'de-a1-colors-braun-quiz', 'quiz_4_option', 'braun', 'braun', null, null, null, 'de-a1-colors', 'beginner', null, null, null, null, 20, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-colors-braun","question":{"de":"Was bedeutet braun?","en":"What does braun mean?"},"options":[{"default_text":"color","translations":{"de":"braun","en":"brown"},"is_correct":true,"sort_order":1},{"default_text":"color","translations":{"de":"gelb","en":"yellow"},"is_correct":false,"sort_order":2},{"default_text":"color","translations":{"de":"weiß","en":"white"},"is_correct":false,"sort_order":3},{"default_text":"color","translations":{"de":"rosa","en":"pink"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values
('7d1686af-29d1-5787-9586-a816276a7a41', '5d3b5bb9-017b-5227-96b9-4388c548f660', 1),
('7d1686af-29d1-5787-9586-a816276a7a41', 'dda51782-1ec9-5600-a6b2-32246c7a0fb4', 11),
('7d1686af-29d1-5787-9586-a816276a7a41', '1eec76d9-6a3b-5369-8de8-422a1fb79234', 2),
('7d1686af-29d1-5787-9586-a816276a7a41', 'e2e2d29a-1388-50bf-8d03-652b2034a31e', 12),
('7d1686af-29d1-5787-9586-a816276a7a41', 'a9e27601-98c7-56e1-ac99-ecee6a8007e6', 3),
('7d1686af-29d1-5787-9586-a816276a7a41', 'bab71f18-4035-5937-88d3-f6ccf03a12ff', 13),
('7d1686af-29d1-5787-9586-a816276a7a41', '97ea5b89-f20c-5cf4-a217-d6c185140805', 4),
('7d1686af-29d1-5787-9586-a816276a7a41', '7701df6e-58d0-5165-9794-8416652f0fe5', 14),
('7d1686af-29d1-5787-9586-a816276a7a41', '14c897b2-7729-5e83-807f-204fa5d64b70', 5),
('7d1686af-29d1-5787-9586-a816276a7a41', '0ff08e1f-b3d3-5ea8-8f23-ebeeb14173cc', 15),
('7d1686af-29d1-5787-9586-a816276a7a41', 'a75e57bf-f593-5505-938f-f7ecce0f2334', 6),
('7d1686af-29d1-5787-9586-a816276a7a41', '421f0a3b-565a-5920-a89d-1aeeaf34ebcf', 16),
('7d1686af-29d1-5787-9586-a816276a7a41', '292da31f-1fcd-5767-8b41-ef39fe55f249', 7),
('7d1686af-29d1-5787-9586-a816276a7a41', 'cae30873-a908-569d-823d-c9ea044a8929', 17),
('7d1686af-29d1-5787-9586-a816276a7a41', '12e30b71-5daa-5c1f-900f-29dceb62013e', 8),
('7d1686af-29d1-5787-9586-a816276a7a41', '92eb1e3e-b765-5305-946d-19451e54c703', 18),
('7d1686af-29d1-5787-9586-a816276a7a41', '238113bd-e888-5d98-9095-a5296c9057c0', 9),
('7d1686af-29d1-5787-9586-a816276a7a41', '0ba0e61a-95de-5a7c-bc9c-20ad25b3cce3', 19),
('7d1686af-29d1-5787-9586-a816276a7a41', 'a8d3b3b0-874e-518e-a8d8-42b2a8bf123c', 10),
('7d1686af-29d1-5787-9586-a816276a7a41', 'ec02ff9e-c41c-5278-9f71-025e6cd88beb', 20)
on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values
('360e8029-10b9-576d-ab0b-ec15af4fff39', '5d3b5bb9-017b-5227-96b9-4388c548f660', 1),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '1eec76d9-6a3b-5369-8de8-422a1fb79234', 2),
('360e8029-10b9-576d-ab0b-ec15af4fff39', 'a9e27601-98c7-56e1-ac99-ecee6a8007e6', 3),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '97ea5b89-f20c-5cf4-a217-d6c185140805', 4),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '14c897b2-7729-5e83-807f-204fa5d64b70', 5),
('360e8029-10b9-576d-ab0b-ec15af4fff39', 'a75e57bf-f593-5505-938f-f7ecce0f2334', 6),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '292da31f-1fcd-5767-8b41-ef39fe55f249', 7),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '12e30b71-5daa-5c1f-900f-29dceb62013e', 8),
('360e8029-10b9-576d-ab0b-ec15af4fff39', '238113bd-e888-5d98-9095-a5296c9057c0', 9),
('360e8029-10b9-576d-ab0b-ec15af4fff39', 'a8d3b3b0-874e-518e-a8d8-42b2a8bf123c', 10)
on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

update language_cards_cards set
  image_id = case slug
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
    else image_id
  end,
  audio_url = case slug
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
    else audio_url
  end
where slug in ('de-a1-colors-rot', 'de-a1-colors-blau', 'de-a1-colors-gelb', 'de-a1-colors-gruen', 'de-a1-colors-schwarz', 'de-a1-colors-weiss', 'de-a1-colors-orange', 'de-a1-colors-lila', 'de-a1-colors-rosa', 'de-a1-colors-braun');

update language_cards_track_translations
set description = case lang_code
  when 'de' then 'Der aktive Einstieg: Begrüßen, erste Sätze, Menschen, Familie, Zahlen, Zeit und Farben.'
  when 'en' then 'The active beginner path: greetings, first sentences, people, family, numbers, time, and colors.'
  else description
end
where track_id = (select id from language_cards_tracks where language_id='de' and slug='de-a1')
  and lang_code in ('de', 'en');

update language_cards_categories
set sort_order = case slug
  when 'de-a1-start' then 1
  when 'de-a1-people' then 2
  when 'de-a1-numbers-time' then 3
  when 'de-a1-colors' then 4
  when 'de-a1-home-city' then 5
  when 'de-a1-food-shopping' then 6
  when 'de-a1-daily-life' then 7
  when 'de-a1-grammar' then 8
  when 'de-a1-dialogues' then 9
  else sort_order
end
where language_id = 'de'
  and slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors','de-a1-home-city','de-a1-food-shopping','de-a1-daily-life','de-a1-grammar','de-a1-dialogues');

update language_cards_track_categories tc
set sort_order = case c.slug
  when 'de-a1-start' then 1
  when 'de-a1-people' then 2
  when 'de-a1-numbers-time' then 3
  when 'de-a1-colors' then 4
  when 'de-a1-home-city' then 5
  when 'de-a1-food-shopping' then 6
  when 'de-a1-daily-life' then 7
  when 'de-a1-grammar' then 8
  when 'de-a1-dialogues' then 9
  else tc.sort_order
end
from language_cards_categories c, language_cards_tracks t
where tc.category_id = c.id
  and tc.track_id = t.id
  and t.language_id = 'de'
  and t.slug = 'de-a1'
  and c.slug in ('de-a1-start','de-a1-people','de-a1-numbers-time','de-a1-colors','de-a1-home-city','de-a1-food-shopping','de-a1-daily-life','de-a1-grammar','de-a1-dialogues');

commit;
