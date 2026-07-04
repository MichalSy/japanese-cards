-- Seed German as a learnable language and add an active CEFR A1 starter curriculum.
-- No images or audio are required; cards are text-only.

begin;

update language_cards_languages
set is_learn_language = true, is_active = true, app_icon = '🇩🇪', name_de = 'Deutsch', name_en = 'German', name_native = 'Deutsch', flag_emoji = '🇩🇪'
where id = 'de';

insert into language_cards_tracks (id, language_id, slug, level_system, level_code, emoji, status, sort_order, updated_at)
values ('62eeb738-082e-54b2-a9a8-b17b9c91c520', 'de', 'de-a1', 'cefr', 'A1', '🇩🇪', 'active', 1, now())
on conflict (language_id, slug) do update set status = excluded.status, emoji = excluded.emoji, sort_order = excluded.sort_order, updated_at = now();

update language_cards_tracks set status = 'planned', updated_at = now() where language_id = 'de' and slug <> 'de-a1';

insert into language_cards_track_translations (track_id, lang_code, name, description) values
  ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), 'de', 'Deutsch A1', 'Der aktive Einstieg: Begrüßen, erste Sätze, Menschen, Familie, Zahlen und Zeit.'),
  ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), 'en', 'German A1', 'The active beginner path: greetings, first sentences, people, family, numbers, and time.')
on conflict (track_id, lang_code) do update set name = excluded.name, description = excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('abfa6d90-0230-598c-87c4-7dfbe4a6712d', 'de', 'de-a1-start', 'Erste Schritte', '👋', '#f59e0b', 'vocabulary', array['swipe']::text[], false, 1, true, 'active')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'de', 'Erste Schritte', 'Begrüßen, höflich sein und die ersten Mini-Sätze.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'en', 'First steps', 'Greetings, politeness, and the first mini sentences.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('4abf96b4-acc4-520e-a6a0-9e5ce8579134', 'de', 'de-a1-people', 'Menschen & Familie', '👥', '#3b82f6', 'vocabulary', array['swipe']::text[], false, 2, true, 'active')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'de', 'Menschen & Familie', 'Ich, du, Familie und einfache Angaben zur Person.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'en', 'People & family', 'I, you, family, and simple personal information.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('3e265bfe-2cbc-5109-bd10-6cd187ce1fd6', 'de', 'de-a1-numbers-time', 'Zahlen & Zeit', '🔢', '#10b981', 'vocabulary', array['swipe']::text[], false, 3, true, 'active')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'de', 'Zahlen & Zeit', 'Zahlen, Tage und einfache Zeitwörter.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'en', 'Numbers & time', 'Numbers, days, and simple time words.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('00b86c14-a217-5dce-8163-187ca48b51ed', 'de', 'de-a1-home-city', 'Zuhause & Stadt', '🏠', '#8b5cf6', 'vocabulary', array[]::text[], false, 4, false, 'planned')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-home-city'), 'de', 'Zuhause & Stadt', 'Wohnung, Stadt, Wege und wichtige Orte.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-home-city'), 'en', 'Home & city', 'Home, city, directions, and important places.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('a25728da-cbee-5288-ae7c-b8f7622189e4', 'de', 'de-a1-food-shopping', 'Essen & Einkaufen', '🛒', '#ef4444', 'vocabulary', array[]::text[], false, 5, false, 'planned')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-food-shopping'), 'de', 'Essen & Einkaufen', 'Lebensmittel, Preise, Bestellen und Einkaufen.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-food-shopping'), 'en', 'Food & shopping', 'Food, prices, ordering, and shopping.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('4833acee-c385-53f1-9069-637f65b70986', 'de', 'de-a1-daily-life', 'Alltag & Routinen', '☕', '#06b6d4', 'vocabulary', array[]::text[], false, 6, false, 'planned')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-daily-life'), 'de', 'Alltag & Routinen', 'Tagesablauf, Freizeit, Schule, Arbeit und Termine.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-daily-life'), 'en', 'Daily life & routines', 'Daily routines, free time, school, work, and appointments.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('d2e133da-b1fc-594f-8cf4-cd54a1fbe9e8', 'de', 'de-a1-grammar', 'Grammatik A1', '🧩', '#ec4899', 'grammar', array[]::text[], false, 7, false, 'planned')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-grammar'), 'de', 'Grammatik A1', 'Artikel, Verbposition, Fragen, Negation und einfache Fälle.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-grammar'), 'en', 'A1 grammar', 'Articles, verb position, questions, negation, and simple cases.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_categories (id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option, sort_order, is_active, status)
values ('3c0e2196-d35b-5c96-9c5b-3d6b71ec9e03', 'de', 'de-a1-dialogues', 'Mini-Dialoge', '💬', '#a855f7', 'phrase', array[]::text[], false, 8, false, 'planned')
on conflict (language_id, slug) do update set native_name=excluded.native_name, emoji=excluded.emoji, color=excluded.color, card_type=excluded.card_type, game_modes=excluded.game_modes, show_all_option=excluded.show_all_option, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_category_translations (category_id, lang_code, name, description) values
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-dialogues'), 'de', 'Mini-Dialoge', 'Kurze Dialoge für echte Alltagssituationen.'),
  ((select id from language_cards_categories where language_id='de' and slug='de-a1-dialogues'), 'en', 'Mini dialogues', 'Short dialogues for real everyday situations.')
on conflict (category_id, lang_code) do update set name=excluded.name, description=excluded.description;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 1)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 2)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 3)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-home-city'), 4)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-food-shopping'), 5)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-daily-life'), 6)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-grammar'), 7)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_track_categories (track_id, category_id, sort_order)
values ((select id from language_cards_tracks where language_id='de' and slug='de-a1'), (select id from language_cards_categories where language_id='de' and slug='de-a1-dialogues'), 8)
on conflict (track_id, category_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_courses (id, category_id, slug, level, sort_order, is_active, status)
values ('c2faa067-03f1-5bea-9709-ed728af89d3c', (select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'de-a1-start-basics', 'A1', 1, true, 'active')
on conflict (category_id, slug) do update set level=excluded.level, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_course_translations (course_id, lang_code, title, description) values
  ((select id from language_cards_learning_courses where slug='de-a1-start-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de', 'Deutsch A1: Erste Schritte', 'Die wichtigsten Wörter und Sätze für den Anfang.'),
  ((select id from language_cards_learning_courses where slug='de-a1-start-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'en', 'German A1: First steps', 'The most important words and sentences for the beginning.')
on conflict (course_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_learning_courses (id, category_id, slug, level, sort_order, is_active, status)
values ('6b5cd929-f8e0-5e57-91d4-2cb2eb3de61b', (select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'de-a1-people-basics', 'A1', 1, true, 'active')
on conflict (category_id, slug) do update set level=excluded.level, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_course_translations (course_id, lang_code, title, description) values
  ((select id from language_cards_learning_courses where slug='de-a1-people-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de', 'Deutsch A1: Menschen & Familie', 'Personen, Pronomen und Familie.'),
  ((select id from language_cards_learning_courses where slug='de-a1-people-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'en', 'German A1: People & family', 'People, pronouns, and family.')
on conflict (course_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_learning_courses (id, category_id, slug, level, sort_order, is_active, status)
values ('c534a218-c970-5186-a15b-c15f249e96b7', (select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'de-a1-numbers-time-basics', 'A1', 1, true, 'active')
on conflict (category_id, slug) do update set level=excluded.level, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_course_translations (course_id, lang_code, title, description) values
  ((select id from language_cards_learning_courses where slug='de-a1-numbers-time-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de', 'Deutsch A1: Zahlen & Zeit', 'Zählen, Tage und einfache Zeitangaben.'),
  ((select id from language_cards_learning_courses where slug='de-a1-numbers-time-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'en', 'German A1: Numbers & time', 'Counting, days, and simple time expressions.')
on conflict (course_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('f8d547e9-684c-5f38-9baf-d31fbc6d9c8f', (select id from language_cards_learning_courses where slug='de-a1-start-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de-a1-start-greetings', 1, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'de', 'Begrüßen', '4 Sätze, 4 Quizkarten.'),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'en', 'Greetings', '4 phrase cards, 4 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('eb33d786-05e7-5b92-80d5-c7ffe3fe2a6d', 'de-a1-info-greetings', 'info', null, null, null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 1, true, '{"content_md":{"de":"# Begrüßen\n\nDeutsch hat kurze informelle Grüße und etwas formellere Tagesgrüße.\n\n| Hallo | Guten Morgen | Guten Tag | Guten Abend |\n|:---:|:---:|:---:|:---:|\n| neutral | morgens | tagsüber | abends |","en":"# Greetings\n\nGerman has short informal greetings and slightly more formal time-of-day greetings.\n\n| Hallo | Guten Morgen | Guten Tag | Guten Abend |\n|:---:|:---:|:---:|:---:|\n| neutral | morning | daytime | evening |"}}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'eb33d786-05e7-5b92-80d5-c7ffe3fe2a6d', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('bd208b65-1f6e-5e26-9a60-21f2de493dec', 'de-a1-start-hallo', 'vocabulary', 'Hallo', 'hallo', 'interjection', 'Hallo!', null, 'de-a1-start', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-start-greetings","kind":"interjection","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('bd208b65-1f6e-5e26-9a60-21f2de493dec', 'de', 'Begrüßung: Hallo', 'Hallo!', null),
  ('bd208b65-1f6e-5e26-9a60-21f2de493dec', 'en', 'Hello', 'Hello!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'bd208b65-1f6e-5e26-9a60-21f2de493dec', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('2981c182-a666-50f4-901b-f66f6e323c5b', 'de-a1-start-guten-morgen', 'vocabulary', 'Guten Morgen', 'GU-ten MOR-gen', 'phrase', 'Guten Morgen, Hanna!', null, 'de-a1-start', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('2981c182-a666-50f4-901b-f66f6e323c5b', 'de', 'Begrüßung am Morgen', 'Guten Morgen, Hanna!', null),
  ('2981c182-a666-50f4-901b-f66f6e323c5b', 'en', 'Good morning', 'Good morning, Hanna!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '2981c182-a666-50f4-901b-f66f6e323c5b', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('fea0692a-7bf6-5fbe-b0c9-b9b31a9ec0bf', 'de-a1-start-guten-tag', 'vocabulary', 'Guten Tag', 'GU-ten TAK', 'phrase', 'Guten Tag!', null, 'de-a1-start', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('fea0692a-7bf6-5fbe-b0c9-b9b31a9ec0bf', 'de', 'formelle Begrüßung am Tag', 'Guten Tag!', null),
  ('fea0692a-7bf6-5fbe-b0c9-b9b31a9ec0bf', 'en', 'Good day / hello', 'Hello!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'fea0692a-7bf6-5fbe-b0c9-b9b31a9ec0bf', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('64a9880a-683a-5441-95e4-18ccb7923159', 'de-a1-start-guten-abend', 'vocabulary', 'Guten Abend', 'GU-ten AH-bent', 'phrase', 'Guten Abend!', null, 'de-a1-start', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('64a9880a-683a-5441-95e4-18ccb7923159', 'de', 'Begrüßung am Abend', 'Guten Abend!', null),
  ('64a9880a-683a-5441-95e4-18ccb7923159', 'en', 'Good evening', 'Good evening!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '64a9880a-683a-5441-95e4-18ccb7923159', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ae6502ba-d3ac-5f48-9e3f-8cc8459f9b15', 'de-a1-start-hallo-quiz', 'quiz_4_option', 'Hallo', 'hallo', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-hallo","question":{"de":"Was bedeutet Hallo?","en":"What does Hallo mean?"},"options":[{"default_text":"interjection","translations":{"de":"Begrüßung: Hallo","en":"Hello"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"Begrüßung am Morgen","en":"Good morning"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"formelle Begrüßung am Tag","en":"Good day / hello"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"Begrüßung am Abend","en":"Good evening"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'ae6502ba-d3ac-5f48-9e3f-8cc8459f9b15', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('4c28a380-a295-5682-8c9b-bc88ee209e79', 'de-a1-start-guten-morgen-quiz', 'quiz_4_option', 'Guten Morgen', 'GU-ten MOR-gen', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-guten-morgen","question":{"de":"Was bedeutet Guten Morgen?","en":"What does Guten Morgen mean?"},"options":[{"default_text":"phrase","translations":{"de":"Begrüßung am Morgen","en":"Good morning"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"formelle Begrüßung am Tag","en":"Good day / hello"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"Begrüßung am Abend","en":"Good evening"},"is_correct":false,"sort_order":3},{"default_text":"interjection","translations":{"de":"Begrüßung: Hallo","en":"Hello"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '4c28a380-a295-5682-8c9b-bc88ee209e79', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('70b57125-d6cf-5583-b4b1-65b6a90af910', 'de-a1-start-guten-tag-quiz', 'quiz_4_option', 'Guten Tag', 'GU-ten TAK', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-guten-tag","question":{"de":"Was bedeutet Guten Tag?","en":"What does Guten Tag mean?"},"options":[{"default_text":"phrase","translations":{"de":"formelle Begrüßung am Tag","en":"Good day / hello"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"Begrüßung am Abend","en":"Good evening"},"is_correct":false,"sort_order":2},{"default_text":"interjection","translations":{"de":"Begrüßung: Hallo","en":"Hello"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"Begrüßung am Morgen","en":"Good morning"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '70b57125-d6cf-5583-b4b1-65b6a90af910', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('fda6d175-f823-568a-a71b-6347a9dba6bf', 'de-a1-start-guten-abend-quiz', 'quiz_4_option', 'Guten Abend', 'GU-ten AH-bent', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-guten-abend","question":{"de":"Was bedeutet Guten Abend?","en":"What does Guten Abend mean?"},"options":[{"default_text":"phrase","translations":{"de":"Begrüßung am Abend","en":"Good evening"},"is_correct":true,"sort_order":1},{"default_text":"interjection","translations":{"de":"Begrüßung: Hallo","en":"Hello"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"Begrüßung am Morgen","en":"Good morning"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"formelle Begrüßung am Tag","en":"Good day / hello"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'fda6d175-f823-568a-a71b-6347a9dba6bf', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('0943ac60-9de4-5686-8c46-74f749eaec7b', (select id from language_cards_learning_courses where slug='de-a1-start-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de-a1-start-politeness', 2, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), 'de', 'Höflich sein', '4 Wörter, 4 Quizkarten.'),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), 'en', 'Being polite', '4 word cards, 4 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('4b6de007-0398-5e64-bf4a-50bdfaa9489a', 'de-a1-start-bitte', 'vocabulary', 'bitte', 'BIT-te', 'interjection', 'Bitte schön.', null, 'de-a1-start', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-start-politeness","kind":"interjection","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('4b6de007-0398-5e64-bf4a-50bdfaa9489a', 'de', 'bitte / gern geschehen', 'Bitte schön.', null),
  ('4b6de007-0398-5e64-bf4a-50bdfaa9489a', 'en', 'please / you are welcome', 'Here you go.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), '4b6de007-0398-5e64-bf4a-50bdfaa9489a', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('6445fe7e-1cfe-5187-a041-7e913a92fa13', 'de-a1-start-danke', 'vocabulary', 'danke', 'DAN-ke', 'interjection', 'Danke schön!', null, 'de-a1-start', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-start-politeness","kind":"interjection","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('6445fe7e-1cfe-5187-a041-7e913a92fa13', 'de', 'Danke', 'Danke schön!', null),
  ('6445fe7e-1cfe-5187-a041-7e913a92fa13', 'en', 'thanks', 'Thank you!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), '6445fe7e-1cfe-5187-a041-7e913a92fa13', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('4b36d098-2a39-5084-8491-d51fef256c21', 'de-a1-start-entschuldigung', 'vocabulary', 'Entschuldigung', 'ent-SHUL-di-gung', 'noun', 'Entschuldigung, wo ist der Bahnhof?', null, 'de-a1-start', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-start-politeness","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('4b36d098-2a39-5084-8491-d51fef256c21', 'de', 'Entschuldigung', 'Entschuldigung, wo ist der Bahnhof?', null),
  ('4b36d098-2a39-5084-8491-d51fef256c21', 'en', 'excuse me / sorry', 'Excuse me, where is the station?', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), '4b36d098-2a39-5084-8491-d51fef256c21', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ee02bf7f-cf5c-544b-8dee-bf9f08308927', 'de-a1-start-tschuess', 'vocabulary', 'Tschüss', 'tschüss', 'interjection', 'Tschüss, bis morgen!', null, 'de-a1-start', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-start-politeness","kind":"interjection","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('ee02bf7f-cf5c-544b-8dee-bf9f08308927', 'de', 'Abschied: Tschüss', 'Tschüss, bis morgen!', null),
  ('ee02bf7f-cf5c-544b-8dee-bf9f08308927', 'en', 'bye', 'Bye, see you tomorrow!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), 'ee02bf7f-cf5c-544b-8dee-bf9f08308927', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('c19ea6d7-4093-5b03-9597-2bc0ec3383f2', 'de-a1-start-bitte-quiz', 'quiz_4_option', 'bitte', 'BIT-te', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 5, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-bitte","question":{"de":"Was bedeutet bitte?","en":"What does bitte mean?"},"options":[{"default_text":"interjection","translations":{"de":"bitte / gern geschehen","en":"please / you are welcome"},"is_correct":true,"sort_order":1},{"default_text":"interjection","translations":{"de":"Danke","en":"thanks"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Entschuldigung","en":"excuse me / sorry"},"is_correct":false,"sort_order":3},{"default_text":"interjection","translations":{"de":"Abschied: Tschüss","en":"bye"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), 'c19ea6d7-4093-5b03-9597-2bc0ec3383f2', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('7811ec64-c3b6-53bd-80ca-70bd2a605440', 'de-a1-start-danke-quiz', 'quiz_4_option', 'danke', 'DAN-ke', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-danke","question":{"de":"Was bedeutet danke?","en":"What does danke mean?"},"options":[{"default_text":"interjection","translations":{"de":"Danke","en":"thanks"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Entschuldigung","en":"excuse me / sorry"},"is_correct":false,"sort_order":2},{"default_text":"interjection","translations":{"de":"Abschied: Tschüss","en":"bye"},"is_correct":false,"sort_order":3},{"default_text":"interjection","translations":{"de":"bitte / gern geschehen","en":"please / you are welcome"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), '7811ec64-c3b6-53bd-80ca-70bd2a605440', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('961d8cc9-f55c-53f2-9da3-40d76c59c273', 'de-a1-start-entschuldigung-quiz', 'quiz_4_option', 'Entschuldigung', 'ent-SHUL-di-gung', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-entschuldigung","question":{"de":"Was bedeutet Entschuldigung?","en":"What does Entschuldigung mean?"},"options":[{"default_text":"noun","translations":{"de":"Entschuldigung","en":"excuse me / sorry"},"is_correct":true,"sort_order":1},{"default_text":"interjection","translations":{"de":"Abschied: Tschüss","en":"bye"},"is_correct":false,"sort_order":2},{"default_text":"interjection","translations":{"de":"bitte / gern geschehen","en":"please / you are welcome"},"is_correct":false,"sort_order":3},{"default_text":"interjection","translations":{"de":"Danke","en":"thanks"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), '961d8cc9-f55c-53f2-9da3-40d76c59c273', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('da83c369-d61c-57c9-8d91-66985c6a0ed6', 'de-a1-start-tschuess-quiz', 'quiz_4_option', 'Tschüss', 'tschüss', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-tschuess","question":{"de":"Was bedeutet Tschüss?","en":"What does Tschüss mean?"},"options":[{"default_text":"interjection","translations":{"de":"Abschied: Tschüss","en":"bye"},"is_correct":true,"sort_order":1},{"default_text":"interjection","translations":{"de":"bitte / gern geschehen","en":"please / you are welcome"},"is_correct":false,"sort_order":2},{"default_text":"interjection","translations":{"de":"Danke","en":"thanks"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Entschuldigung","en":"excuse me / sorry"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-politeness'), 'da83c369-d61c-57c9-8d91-66985c6a0ed6', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('ee30a89c-2b1d-5b6c-8d81-a735faac2dbe', (select id from language_cards_learning_courses where slug='de-a1-start-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de-a1-start-mini-sentences', 3, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'de', 'Erste Mini-Sätze', '4 Sätze, 4 Quizkarten.'),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'en', 'First mini sentences', '4 sentence cards, 4 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('87a02123-6479-58fe-91de-3c58e26f94be', 'de-a1-info-word-order-1', 'info', null, null, null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 1, true, '{"content_md":{"de":"# Mini-Sätze\n\nEin sehr einfacher deutscher Satz hat oft diese Form:\n\n| Ich | heiße | Anna |\n|:---:|:---:|:---:|\n| Person | Verb | Name |\n\nDas Verb steht früh im Satz.","en":"# Mini sentences\n\nA very simple German sentence often has this form:\n\n| Ich | heiße | Anna |\n|:---:|:---:|:---:|\n| person | verb | name |\n\nThe verb appears early in the sentence."}}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), '87a02123-6479-58fe-91de-3c58e26f94be', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('f2fcecd2-d098-5e93-9fbf-ebaa1e58c736', 'de-a1-start-ja', 'vocabulary', 'ja', 'ja', 'particle', 'Ja, bitte.', null, 'de-a1-start', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-start-mini-sentences","kind":"particle","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('f2fcecd2-d098-5e93-9fbf-ebaa1e58c736', 'de', 'ja', 'Ja, bitte.', null),
  ('f2fcecd2-d098-5e93-9fbf-ebaa1e58c736', 'en', 'yes', 'Yes, please.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'f2fcecd2-d098-5e93-9fbf-ebaa1e58c736', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b739408d-dff6-51a7-b439-fe804197ea86', 'de-a1-start-nein', 'vocabulary', 'nein', 'nain', 'particle', 'Nein, danke.', null, 'de-a1-start', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-start-mini-sentences","kind":"particle","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('b739408d-dff6-51a7-b439-fe804197ea86', 'de', 'nein', 'Nein, danke.', null),
  ('b739408d-dff6-51a7-b439-fe804197ea86', 'en', 'no', 'No, thanks.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'b739408d-dff6-51a7-b439-fe804197ea86', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('8535d379-3ecc-5cbe-9422-9e023a8791b2', 'de-a1-start-ich-heisse', 'vocabulary', 'Ich heiße …', 'isch HAI-se', 'phrase', 'Ich heiße Anna.', null, 'de-a1-start', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-start-mini-sentences","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('8535d379-3ecc-5cbe-9422-9e023a8791b2', 'de', 'Ich heiße …', 'Ich heiße Anna.', null),
  ('8535d379-3ecc-5cbe-9422-9e023a8791b2', 'en', 'My name is …', 'My name is Anna.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), '8535d379-3ecc-5cbe-9422-9e023a8791b2', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('c1193641-fd73-5cfd-9c44-88452b1e93d7', 'de-a1-start-wie-heisst-du', 'vocabulary', 'Wie heißt du?', 'vee haist du', 'phrase', 'Wie heißt du?', null, 'de-a1-start', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-start-mini-sentences","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('c1193641-fd73-5cfd-9c44-88452b1e93d7', 'de', 'Wie heißt du?', 'Wie heißt du?', null),
  ('c1193641-fd73-5cfd-9c44-88452b1e93d7', 'en', 'What is your name?', 'What is your name?', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'c1193641-fd73-5cfd-9c44-88452b1e93d7', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ec083127-66b7-599b-b949-a3c44eb598ed', 'de-a1-start-ja-quiz', 'quiz_4_option', 'ja', 'ja', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-ja","question":{"de":"Was bedeutet ja?","en":"What does ja mean?"},"options":[{"default_text":"particle","translations":{"de":"ja","en":"yes"},"is_correct":true,"sort_order":1},{"default_text":"particle","translations":{"de":"nein","en":"no"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"Ich heiße …","en":"My name is …"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"Wie heißt du?","en":"What is your name?"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), 'ec083127-66b7-599b-b949-a3c44eb598ed', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('970f1332-1f11-5e2d-85c4-6e5533f41a12', 'de-a1-start-nein-quiz', 'quiz_4_option', 'nein', 'nain', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-nein","question":{"de":"Was bedeutet nein?","en":"What does nein mean?"},"options":[{"default_text":"particle","translations":{"de":"nein","en":"no"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"Ich heiße …","en":"My name is …"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"Wie heißt du?","en":"What is your name?"},"is_correct":false,"sort_order":3},{"default_text":"particle","translations":{"de":"ja","en":"yes"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), '970f1332-1f11-5e2d-85c4-6e5533f41a12', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('61ef87ca-a14a-55e9-8634-127f43aa3de1', 'de-a1-start-ich-heisse-quiz', 'quiz_4_option', 'Ich heiße …', 'isch HAI-se', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-ich-heisse","question":{"de":"Was bedeutet Ich heiße …?","en":"What does Ich heiße … mean?"},"options":[{"default_text":"phrase","translations":{"de":"Ich heiße …","en":"My name is …"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"Wie heißt du?","en":"What is your name?"},"is_correct":false,"sort_order":2},{"default_text":"particle","translations":{"de":"ja","en":"yes"},"is_correct":false,"sort_order":3},{"default_text":"particle","translations":{"de":"nein","en":"no"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), '61ef87ca-a14a-55e9-8634-127f43aa3de1', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('3c55fde7-e379-5817-af9e-3f713c3c41d1', 'de-a1-start-wie-heisst-du-quiz', 'quiz_4_option', 'Wie heißt du?', 'vee haist du', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-wie-heisst-du","question":{"de":"Was bedeutet Wie heißt du??","en":"What does Wie heißt du? mean?"},"options":[{"default_text":"phrase","translations":{"de":"Wie heißt du?","en":"What is your name?"},"is_correct":true,"sort_order":1},{"default_text":"particle","translations":{"de":"ja","en":"yes"},"is_correct":false,"sort_order":2},{"default_text":"particle","translations":{"de":"nein","en":"no"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"Ich heiße …","en":"My name is …"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-start-mini-sentences'), '3c55fde7-e379-5817-af9e-3f713c3c41d1', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('31108034-8290-5932-bab4-bf545083efba', (select id from language_cards_learning_courses where slug='de-a1-people-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de-a1-people-pronouns', 1, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'de', 'Ich, du, Sie', 'ich · du · er · sie · wir · Sie'),
  ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'en', 'I, you, formal you', 'I · you · he · she · we · formal you')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('1fea60ce-6332-5534-99b1-73a66703e415', 'de-a1-info-du-sie', 'info', null, null, null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 1, true, '{"content_md":{"de":"# du oder Sie?\n\n| du | Sie |\n|:---:|:---:|\n| Freunde, Familie | höflich, fremde Erwachsene |\n\n**Sie** schreibt man groß, wenn es „formal you“ bedeutet.","en":"# du or Sie?\n\n| du | Sie |\n|:---:|:---:|\n| friends, family | polite, unfamiliar adults |\n\n**Sie** is capitalized when it means formal “you”."}}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '1fea60ce-6332-5534-99b1-73a66703e415', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a86ca052-3699-542d-bbd9-245518b58124', 'de-a1-people-ich', 'vocabulary', 'ich', 'isch', 'pronoun', 'Ich bin Anna.', null, 'de-a1-people', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('a86ca052-3699-542d-bbd9-245518b58124', 'de', 'ich', 'Ich bin Anna.', null),
  ('a86ca052-3699-542d-bbd9-245518b58124', 'en', 'I', 'I am Anna.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'a86ca052-3699-542d-bbd9-245518b58124', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('c1321f59-404f-5602-9be5-a938899def0c', 'de-a1-people-du', 'vocabulary', 'du', 'du', 'pronoun', 'Du bist nett.', null, 'de-a1-people', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('c1321f59-404f-5602-9be5-a938899def0c', 'de', 'du', 'Du bist nett.', null),
  ('c1321f59-404f-5602-9be5-a938899def0c', 'en', 'you (informal)', 'You are nice.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'c1321f59-404f-5602-9be5-a938899def0c', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('985852cf-8366-528d-9b79-e483719332bd', 'de-a1-people-er', 'vocabulary', 'er', 'er', 'pronoun', 'Er ist hier.', null, 'de-a1-people', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('985852cf-8366-528d-9b79-e483719332bd', 'de', 'er', 'Er ist hier.', null),
  ('985852cf-8366-528d-9b79-e483719332bd', 'en', 'he', 'He is here.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '985852cf-8366-528d-9b79-e483719332bd', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('475f8bdd-683c-5b94-bf4d-554527c0c140', 'de-a1-people-sie', 'vocabulary', 'sie', 'zee', 'pronoun', 'Sie ist hier.', null, 'de-a1-people', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('475f8bdd-683c-5b94-bf4d-554527c0c140', 'de', 'sie', 'Sie ist hier.', null),
  ('475f8bdd-683c-5b94-bf4d-554527c0c140', 'en', 'she / they', 'She is here.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '475f8bdd-683c-5b94-bf4d-554527c0c140', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a4872886-21c2-56e8-bc70-fe31717796fd', 'de-a1-people-wir', 'vocabulary', 'wir', 'veer', 'pronoun', 'Wir lernen Deutsch.', null, 'de-a1-people', 'beginner', null, null, null, null, 6, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('a4872886-21c2-56e8-bc70-fe31717796fd', 'de', 'wir', 'Wir lernen Deutsch.', null),
  ('a4872886-21c2-56e8-bc70-fe31717796fd', 'en', 'we', 'We are learning German.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'a4872886-21c2-56e8-bc70-fe31717796fd', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('0580eda3-b6e8-5135-ac3d-ba0558dda2bb', 'de-a1-people-sie-formal', 'vocabulary', 'Sie', 'zee', 'pronoun', 'Wie heißen Sie?', null, 'de-a1-people', 'beginner', null, null, null, null, 7, true, '{"lesson_slug":"de-a1-people-pronouns","kind":"pronoun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('0580eda3-b6e8-5135-ac3d-ba0558dda2bb', 'de', 'Sie (höflich)', 'Wie heißen Sie?', null),
  ('0580eda3-b6e8-5135-ac3d-ba0558dda2bb', 'en', 'you (formal)', 'What is your name?', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '0580eda3-b6e8-5135-ac3d-ba0558dda2bb', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b4ad9507-97c1-5299-b534-b36ca79c5645', 'de-a1-people-ich-quiz', 'quiz_4_option', 'ich', 'isch', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-ich","question":{"de":"Was bedeutet ich?","en":"What does ich mean?"},"options":[{"default_text":"pronoun","translations":{"de":"ich","en":"I"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"du","en":"you (informal)"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"er","en":"he"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"sie","en":"she / they"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'b4ad9507-97c1-5299-b534-b36ca79c5645', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b892b339-4ab1-5445-bb37-17073b948c85', 'de-a1-people-du-quiz', 'quiz_4_option', 'du', 'du', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-du","question":{"de":"Was bedeutet du?","en":"What does du mean?"},"options":[{"default_text":"pronoun","translations":{"de":"du","en":"you (informal)"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"er","en":"he"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"sie","en":"she / they"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"wir","en":"we"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'b892b339-4ab1-5445-bb37-17073b948c85', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('1c2f2157-ff29-5b55-9c6a-c14cabddd0e5', 'de-a1-people-er-quiz', 'quiz_4_option', 'er', 'er', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 10, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-er","question":{"de":"Was bedeutet er?","en":"What does er mean?"},"options":[{"default_text":"pronoun","translations":{"de":"er","en":"he"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"sie","en":"she / they"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"wir","en":"we"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"Sie (höflich)","en":"you (formal)"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '1c2f2157-ff29-5b55-9c6a-c14cabddd0e5', 10) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('80b20f56-10fe-59e3-bc9c-a3f3804c555b', 'de-a1-people-sie-quiz', 'quiz_4_option', 'sie', 'zee', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 11, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-sie","question":{"de":"Was bedeutet sie?","en":"What does sie mean?"},"options":[{"default_text":"pronoun","translations":{"de":"sie","en":"she / they"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"wir","en":"we"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"Sie (höflich)","en":"you (formal)"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"ich","en":"I"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '80b20f56-10fe-59e3-bc9c-a3f3804c555b', 11) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b2dbb4e8-5136-591f-9ff5-b8399847e095', 'de-a1-people-wir-quiz', 'quiz_4_option', 'wir', 'veer', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 12, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-wir","question":{"de":"Was bedeutet wir?","en":"What does wir mean?"},"options":[{"default_text":"pronoun","translations":{"de":"wir","en":"we"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"Sie (höflich)","en":"you (formal)"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"ich","en":"I"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"du","en":"you (informal)"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), 'b2dbb4e8-5136-591f-9ff5-b8399847e095', 12) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('6598fa91-7141-5f24-a64b-85a0b11dffca', 'de-a1-people-sie-formal-quiz', 'quiz_4_option', 'Sie', 'zee', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 13, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-sie-formal","question":{"de":"Was bedeutet Sie?","en":"What does Sie mean?"},"options":[{"default_text":"pronoun","translations":{"de":"Sie (höflich)","en":"you (formal)"},"is_correct":true,"sort_order":1},{"default_text":"pronoun","translations":{"de":"ich","en":"I"},"is_correct":false,"sort_order":2},{"default_text":"pronoun","translations":{"de":"du","en":"you (informal)"},"is_correct":false,"sort_order":3},{"default_text":"pronoun","translations":{"de":"er","en":"he"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-pronouns'), '6598fa91-7141-5f24-a64b-85a0b11dffca', 13) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('9280d972-dd31-539a-affc-9627c3ad38bb', (select id from language_cards_learning_courses where slug='de-a1-people-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de-a1-people-sein-haben', 2, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), 'de', 'sein und haben', 'ich bin · du bist · ich habe · du hast'),
  ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), 'en', 'to be and to have', 'I am · you are · I have · you have')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b1e1f122-9e59-55c9-837a-f360e857d2a3', 'de-a1-people-ich-bin', 'vocabulary', 'ich bin', 'isch bin', 'phrase', 'Ich bin müde.', null, 'de-a1-people', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-people-sein-haben","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('b1e1f122-9e59-55c9-837a-f360e857d2a3', 'de', 'ich bin', 'Ich bin müde.', null),
  ('b1e1f122-9e59-55c9-837a-f360e857d2a3', 'en', 'I am', 'I am tired.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), 'b1e1f122-9e59-55c9-837a-f360e857d2a3', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('d0f1b0cd-0a20-5309-b51c-0e5975ad8602', 'de-a1-people-du-bist', 'vocabulary', 'du bist', 'du bist', 'phrase', 'Du bist hier.', null, 'de-a1-people', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-people-sein-haben","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('d0f1b0cd-0a20-5309-b51c-0e5975ad8602', 'de', 'du bist', 'Du bist hier.', null),
  ('d0f1b0cd-0a20-5309-b51c-0e5975ad8602', 'en', 'you are', 'You are here.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), 'd0f1b0cd-0a20-5309-b51c-0e5975ad8602', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('615a4bf8-0f65-5436-935a-2a487093971b', 'de-a1-people-ich-habe', 'vocabulary', 'ich habe', 'isch HA-be', 'phrase', 'Ich habe Zeit.', null, 'de-a1-people', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-people-sein-haben","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('615a4bf8-0f65-5436-935a-2a487093971b', 'de', 'ich habe', 'Ich habe Zeit.', null),
  ('615a4bf8-0f65-5436-935a-2a487093971b', 'en', 'I have', 'I have time.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), '615a4bf8-0f65-5436-935a-2a487093971b', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('46ffbb6b-3694-54bb-a935-28517ae491fd', 'de-a1-people-du-hast', 'vocabulary', 'du hast', 'du hast', 'phrase', 'Du hast Recht.', null, 'de-a1-people', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-people-sein-haben","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('46ffbb6b-3694-54bb-a935-28517ae491fd', 'de', 'du hast', 'Du hast Recht.', null),
  ('46ffbb6b-3694-54bb-a935-28517ae491fd', 'en', 'you have', 'You are right.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), '46ffbb6b-3694-54bb-a935-28517ae491fd', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('96b19382-79b6-5944-8ede-c49907c506ed', 'de-a1-people-ich-bin-quiz', 'quiz_4_option', 'ich bin', 'isch bin', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 5, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-ich-bin","question":{"de":"Was bedeutet ich bin?","en":"What does ich bin mean?"},"options":[{"default_text":"phrase","translations":{"de":"ich bin","en":"I am"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"du bist","en":"you are"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"ich habe","en":"I have"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"du hast","en":"you have"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), '96b19382-79b6-5944-8ede-c49907c506ed', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ec6ebc4c-1332-5f89-bfd8-b3fc1d23795a', 'de-a1-people-du-bist-quiz', 'quiz_4_option', 'du bist', 'du bist', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-du-bist","question":{"de":"Was bedeutet du bist?","en":"What does du bist mean?"},"options":[{"default_text":"phrase","translations":{"de":"du bist","en":"you are"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"ich habe","en":"I have"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"du hast","en":"you have"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"ich bin","en":"I am"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), 'ec6ebc4c-1332-5f89-bfd8-b3fc1d23795a', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('7d656121-84cf-58e8-bda8-fb0cddc99de9', 'de-a1-people-ich-habe-quiz', 'quiz_4_option', 'ich habe', 'isch HA-be', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-ich-habe","question":{"de":"Was bedeutet ich habe?","en":"What does ich habe mean?"},"options":[{"default_text":"phrase","translations":{"de":"ich habe","en":"I have"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"du hast","en":"you have"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"ich bin","en":"I am"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"du bist","en":"you are"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), '7d656121-84cf-58e8-bda8-fb0cddc99de9', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('9af139e7-d37d-547d-bb8a-62241c5eb46a', 'de-a1-people-du-hast-quiz', 'quiz_4_option', 'du hast', 'du hast', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-du-hast","question":{"de":"Was bedeutet du hast?","en":"What does du hast mean?"},"options":[{"default_text":"phrase","translations":{"de":"du hast","en":"you have"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"ich bin","en":"I am"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"du bist","en":"you are"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"ich habe","en":"I have"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-sein-haben'), '9af139e7-d37d-547d-bb8a-62241c5eb46a', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('3aca0c9d-0d3f-56b0-a1dd-19837d56b90d', (select id from language_cards_learning_courses where slug='de-a1-people-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de-a1-people-family', 3, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'de', 'Familie', 'Mutter · Vater · Kind · Freund · Freundin'),
  ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'en', 'Family', 'mother · father · child · friend')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('7afaf22b-700e-5e8a-bae9-fe53c26dbbab', 'de-a1-people-mutter', 'vocabulary', 'die Mutter', 'MUT-ter', 'noun', 'Das ist meine Mutter.', null, 'de-a1-people', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-people-family","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('7afaf22b-700e-5e8a-bae9-fe53c26dbbab', 'de', 'Mutter', 'Das ist meine Mutter.', null),
  ('7afaf22b-700e-5e8a-bae9-fe53c26dbbab', 'en', 'mother', 'This is my mother.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), '7afaf22b-700e-5e8a-bae9-fe53c26dbbab', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a7382b64-ce48-596a-a9d0-71f442b43a99', 'de-a1-people-vater', 'vocabulary', 'der Vater', 'FA-ter', 'noun', 'Das ist mein Vater.', null, 'de-a1-people', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-people-family","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('a7382b64-ce48-596a-a9d0-71f442b43a99', 'de', 'Vater', 'Das ist mein Vater.', null),
  ('a7382b64-ce48-596a-a9d0-71f442b43a99', 'en', 'father', 'This is my father.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'a7382b64-ce48-596a-a9d0-71f442b43a99', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('1b7192c3-d011-5608-8ded-9b813d9063a1', 'de-a1-people-kind', 'vocabulary', 'das Kind', 'kint', 'noun', 'Das Kind spielt.', null, 'de-a1-people', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-people-family","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('1b7192c3-d011-5608-8ded-9b813d9063a1', 'de', 'Kind', 'Das Kind spielt.', null),
  ('1b7192c3-d011-5608-8ded-9b813d9063a1', 'en', 'child', 'The child is playing.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), '1b7192c3-d011-5608-8ded-9b813d9063a1', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('f29986bd-65eb-59e6-ba2d-3afab5f20dc1', 'de-a1-people-freund', 'vocabulary', 'der Freund', 'froint', 'noun', 'Er ist mein Freund.', null, 'de-a1-people', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-people-family","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('f29986bd-65eb-59e6-ba2d-3afab5f20dc1', 'de', 'Freund', 'Er ist mein Freund.', null),
  ('f29986bd-65eb-59e6-ba2d-3afab5f20dc1', 'en', 'male friend / boyfriend', 'He is my friend.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'f29986bd-65eb-59e6-ba2d-3afab5f20dc1', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('d04c7f42-f53b-5f80-ab39-1913d4bc5f05', 'de-a1-people-freundin', 'vocabulary', 'die Freundin', 'FROIN-din', 'noun', 'Sie ist meine Freundin.', null, 'de-a1-people', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-people-family","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('d04c7f42-f53b-5f80-ab39-1913d4bc5f05', 'de', 'Freundin', 'Sie ist meine Freundin.', null),
  ('d04c7f42-f53b-5f80-ab39-1913d4bc5f05', 'en', 'female friend / girlfriend', 'She is my friend.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'd04c7f42-f53b-5f80-ab39-1913d4bc5f05', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('8638eb8f-1736-59b6-9eae-e69f12b9ad38', 'de-a1-people-mutter-quiz', 'quiz_4_option', 'die Mutter', 'MUT-ter', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-mutter","question":{"de":"Was bedeutet die Mutter?","en":"What does die Mutter mean?"},"options":[{"default_text":"noun","translations":{"de":"Mutter","en":"mother"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Vater","en":"father"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Kind","en":"child"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Freund","en":"male friend / boyfriend"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), '8638eb8f-1736-59b6-9eae-e69f12b9ad38', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b1be0d26-90fc-59e2-95c9-a25c76076c11', 'de-a1-people-vater-quiz', 'quiz_4_option', 'der Vater', 'FA-ter', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-vater","question":{"de":"Was bedeutet der Vater?","en":"What does der Vater mean?"},"options":[{"default_text":"noun","translations":{"de":"Vater","en":"father"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Kind","en":"child"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Freund","en":"male friend / boyfriend"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Freundin","en":"female friend / girlfriend"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'b1be0d26-90fc-59e2-95c9-a25c76076c11', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('d7799aa4-ea5c-5650-95ba-608940390d87', 'de-a1-people-kind-quiz', 'quiz_4_option', 'das Kind', 'kint', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-kind","question":{"de":"Was bedeutet das Kind?","en":"What does das Kind mean?"},"options":[{"default_text":"noun","translations":{"de":"Kind","en":"child"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Freund","en":"male friend / boyfriend"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Freundin","en":"female friend / girlfriend"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Mutter","en":"mother"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), 'd7799aa4-ea5c-5650-95ba-608940390d87', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('948719b6-0841-5b3c-98b3-9f1b5fd05047', 'de-a1-people-freund-quiz', 'quiz_4_option', 'der Freund', 'froint', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-freund","question":{"de":"Was bedeutet der Freund?","en":"What does der Freund mean?"},"options":[{"default_text":"noun","translations":{"de":"Freund","en":"male friend / boyfriend"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Freundin","en":"female friend / girlfriend"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Mutter","en":"mother"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Vater","en":"father"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), '948719b6-0841-5b3c-98b3-9f1b5fd05047', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('97baacbb-b606-5a7f-8b2d-01240c266de3', 'de-a1-people-freundin-quiz', 'quiz_4_option', 'die Freundin', 'FROIN-din', null, null, null, 'de-a1-people', 'beginner', null, null, null, null, 10, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-people-freundin","question":{"de":"Was bedeutet die Freundin?","en":"What does die Freundin mean?"},"options":[{"default_text":"noun","translations":{"de":"Freundin","en":"female friend / girlfriend"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Mutter","en":"mother"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Vater","en":"father"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Kind","en":"child"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-people-family'), '97baacbb-b606-5a7f-8b2d-01240c266de3', 10) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('fc72d538-b0b8-5222-aea3-b2547fc90a45', (select id from language_cards_learning_courses where slug='de-a1-numbers-time-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de-a1-numbers-zero-ten', 1, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'de', 'Zahlen 0 bis 10', 'null · eins · zwei · … · zehn'),
  ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'en', 'Numbers 0 to 10', 'zero · one · two · … · ten')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('268421ed-3289-5864-bf73-c381d5d76df6', 'de-a1-numbers-time-null', 'vocabulary', 'null', 'nul', 'number', 'null Euro', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('268421ed-3289-5864-bf73-c381d5d76df6', 'de', 'null', 'null Euro', null),
  ('268421ed-3289-5864-bf73-c381d5d76df6', 'en', 'zero', 'zero euros', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '268421ed-3289-5864-bf73-c381d5d76df6', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('577ede4e-7ce0-5e0a-b040-effc856b117a', 'de-a1-numbers-time-eins', 'vocabulary', 'eins', 'ains', 'number', 'eins, zwei, drei', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('577ede4e-7ce0-5e0a-b040-effc856b117a', 'de', 'eins', 'eins, zwei, drei', null),
  ('577ede4e-7ce0-5e0a-b040-effc856b117a', 'en', 'one', 'one, two, three', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '577ede4e-7ce0-5e0a-b040-effc856b117a', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('f0f8e3ba-8942-5b16-90ad-eb3ef81b1455', 'de-a1-numbers-time-zwei', 'vocabulary', 'zwei', 'tsvai', 'number', 'zwei Personen', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('f0f8e3ba-8942-5b16-90ad-eb3ef81b1455', 'de', 'zwei', 'zwei Personen', null),
  ('f0f8e3ba-8942-5b16-90ad-eb3ef81b1455', 'en', 'two', 'two people', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'f0f8e3ba-8942-5b16-90ad-eb3ef81b1455', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('6741714d-7a5b-5258-9009-31fd19944c3e', 'de-a1-numbers-time-drei', 'vocabulary', 'drei', 'drai', 'number', 'drei Tage', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('6741714d-7a5b-5258-9009-31fd19944c3e', 'de', 'drei', 'drei Tage', null),
  ('6741714d-7a5b-5258-9009-31fd19944c3e', 'en', 'three', 'three days', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '6741714d-7a5b-5258-9009-31fd19944c3e', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a4bff90e-08ae-5a6a-8b3f-45fccae7414a', 'de-a1-numbers-time-vier', 'vocabulary', 'vier', 'feer', 'number', 'vier Wochen', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('a4bff90e-08ae-5a6a-8b3f-45fccae7414a', 'de', 'vier', 'vier Wochen', null),
  ('a4bff90e-08ae-5a6a-8b3f-45fccae7414a', 'en', 'four', 'four weeks', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'a4bff90e-08ae-5a6a-8b3f-45fccae7414a', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b1fade31-04ef-5795-971f-ec7b706df39d', 'de-a1-numbers-time-fuenf', 'vocabulary', 'fünf', 'fünf', 'number', 'fünf Minuten', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 6, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('b1fade31-04ef-5795-971f-ec7b706df39d', 'de', 'fünf', 'fünf Minuten', null),
  ('b1fade31-04ef-5795-971f-ec7b706df39d', 'en', 'five', 'five minutes', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'b1fade31-04ef-5795-971f-ec7b706df39d', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ea0dea11-1a0a-54bc-a64e-704d9417f67d', 'de-a1-numbers-time-sechs', 'vocabulary', 'sechs', 'zeks', 'number', 'sechs Uhr', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 7, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('ea0dea11-1a0a-54bc-a64e-704d9417f67d', 'de', 'sechs', 'sechs Uhr', null),
  ('ea0dea11-1a0a-54bc-a64e-704d9417f67d', 'en', 'six', 'six o’clock', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'ea0dea11-1a0a-54bc-a64e-704d9417f67d', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('819efe82-0263-5515-8e4e-c427024db8a0', 'de-a1-numbers-time-sieben', 'vocabulary', 'sieben', 'ZEE-ben', 'number', 'sieben Tage', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 8, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('819efe82-0263-5515-8e4e-c427024db8a0', 'de', 'sieben', 'sieben Tage', null),
  ('819efe82-0263-5515-8e4e-c427024db8a0', 'en', 'seven', 'seven days', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '819efe82-0263-5515-8e4e-c427024db8a0', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('e20d9fad-711f-5e64-bb63-e9ad0fc57c83', 'de-a1-numbers-time-acht', 'vocabulary', 'acht', 'akht', 'number', 'acht Uhr', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 9, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('e20d9fad-711f-5e64-bb63-e9ad0fc57c83', 'de', 'acht', 'acht Uhr', null),
  ('e20d9fad-711f-5e64-bb63-e9ad0fc57c83', 'en', 'eight', 'eight o’clock', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'e20d9fad-711f-5e64-bb63-e9ad0fc57c83', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('2b1e0daf-bd90-53ab-bc7f-1a28a68b6c14', 'de-a1-numbers-time-neun', 'vocabulary', 'neun', 'noin', 'number', 'neun Euro', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 10, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('2b1e0daf-bd90-53ab-bc7f-1a28a68b6c14', 'de', 'neun', 'neun Euro', null),
  ('2b1e0daf-bd90-53ab-bc7f-1a28a68b6c14', 'en', 'nine', 'nine euros', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '2b1e0daf-bd90-53ab-bc7f-1a28a68b6c14', 10) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('dd0a5238-c94c-55ac-80ba-78867feaafed', 'de-a1-numbers-time-zehn', 'vocabulary', 'zehn', 'tsehn', 'number', 'zehn Minuten', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 11, true, '{"lesson_slug":"de-a1-numbers-zero-ten","kind":"number","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('dd0a5238-c94c-55ac-80ba-78867feaafed', 'de', 'zehn', 'zehn Minuten', null),
  ('dd0a5238-c94c-55ac-80ba-78867feaafed', 'en', 'ten', 'ten minutes', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'dd0a5238-c94c-55ac-80ba-78867feaafed', 11) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('dd29df10-3b1a-5383-ae3e-ae558d8e5770', 'de-a1-numbers-time-null-quiz', 'quiz_4_option', 'null', 'nul', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 12, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-null","question":{"de":"Was bedeutet null?","en":"What does null mean?"},"options":[{"default_text":"number","translations":{"de":"null","en":"zero"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"eins","en":"one"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"zwei","en":"two"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"drei","en":"three"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'dd29df10-3b1a-5383-ae3e-ae558d8e5770', 12) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('10ebe053-1395-55a3-bfaf-d71566f7f0c2', 'de-a1-numbers-time-eins-quiz', 'quiz_4_option', 'eins', 'ains', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 13, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-eins","question":{"de":"Was bedeutet eins?","en":"What does eins mean?"},"options":[{"default_text":"number","translations":{"de":"eins","en":"one"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"zwei","en":"two"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"drei","en":"three"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"vier","en":"four"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '10ebe053-1395-55a3-bfaf-d71566f7f0c2', 13) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('29c1d5e6-255c-533b-98e0-81510bcce2cb', 'de-a1-numbers-time-zwei-quiz', 'quiz_4_option', 'zwei', 'tsvai', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 14, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-zwei","question":{"de":"Was bedeutet zwei?","en":"What does zwei mean?"},"options":[{"default_text":"number","translations":{"de":"zwei","en":"two"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"drei","en":"three"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"vier","en":"four"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"fünf","en":"five"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '29c1d5e6-255c-533b-98e0-81510bcce2cb', 14) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('b8c138de-5b4e-5f77-a402-20190f233c75', 'de-a1-numbers-time-drei-quiz', 'quiz_4_option', 'drei', 'drai', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 15, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-drei","question":{"de":"Was bedeutet drei?","en":"What does drei mean?"},"options":[{"default_text":"number","translations":{"de":"drei","en":"three"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"vier","en":"four"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"fünf","en":"five"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"sechs","en":"six"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'b8c138de-5b4e-5f77-a402-20190f233c75', 15) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('06e5c9d0-7cfe-5600-905a-51836bc91008', 'de-a1-numbers-time-vier-quiz', 'quiz_4_option', 'vier', 'feer', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 16, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-vier","question":{"de":"Was bedeutet vier?","en":"What does vier mean?"},"options":[{"default_text":"number","translations":{"de":"vier","en":"four"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"fünf","en":"five"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"sechs","en":"six"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"sieben","en":"seven"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '06e5c9d0-7cfe-5600-905a-51836bc91008', 16) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('9f94f2b7-dcb7-580b-a46b-1ca41730de0e', 'de-a1-numbers-time-fuenf-quiz', 'quiz_4_option', 'fünf', 'fünf', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 17, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-fuenf","question":{"de":"Was bedeutet fünf?","en":"What does fünf mean?"},"options":[{"default_text":"number","translations":{"de":"fünf","en":"five"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"sechs","en":"six"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"sieben","en":"seven"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"acht","en":"eight"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '9f94f2b7-dcb7-580b-a46b-1ca41730de0e', 17) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('8009ce92-37a7-5ee0-b76f-d92d8cc1a4cd', 'de-a1-numbers-time-sechs-quiz', 'quiz_4_option', 'sechs', 'zeks', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 18, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-sechs","question":{"de":"Was bedeutet sechs?","en":"What does sechs mean?"},"options":[{"default_text":"number","translations":{"de":"sechs","en":"six"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"sieben","en":"seven"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"acht","en":"eight"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"neun","en":"nine"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '8009ce92-37a7-5ee0-b76f-d92d8cc1a4cd', 18) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ba2e6ecb-6b66-5708-a29f-189462291b55', 'de-a1-numbers-time-sieben-quiz', 'quiz_4_option', 'sieben', 'ZEE-ben', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 19, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-sieben","question":{"de":"Was bedeutet sieben?","en":"What does sieben mean?"},"options":[{"default_text":"number","translations":{"de":"sieben","en":"seven"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"acht","en":"eight"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"neun","en":"nine"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"zehn","en":"ten"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'ba2e6ecb-6b66-5708-a29f-189462291b55', 19) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('5d0b40ab-dfa7-5f50-b52a-b637bb54a11a', 'de-a1-numbers-time-acht-quiz', 'quiz_4_option', 'acht', 'akht', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 20, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-acht","question":{"de":"Was bedeutet acht?","en":"What does acht mean?"},"options":[{"default_text":"number","translations":{"de":"acht","en":"eight"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"neun","en":"nine"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"zehn","en":"ten"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"null","en":"zero"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '5d0b40ab-dfa7-5f50-b52a-b637bb54a11a', 20) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('efc33d1d-7160-5867-8111-08e57c9c94df', 'de-a1-numbers-time-neun-quiz', 'quiz_4_option', 'neun', 'noin', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 21, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-neun","question":{"de":"Was bedeutet neun?","en":"What does neun mean?"},"options":[{"default_text":"number","translations":{"de":"neun","en":"nine"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"zehn","en":"ten"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"null","en":"zero"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"eins","en":"one"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), 'efc33d1d-7160-5867-8111-08e57c9c94df', 21) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('5fc5734b-b2bd-55f0-ba7b-bb6313263586', 'de-a1-numbers-time-zehn-quiz', 'quiz_4_option', 'zehn', 'tsehn', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 22, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-zehn","question":{"de":"Was bedeutet zehn?","en":"What does zehn mean?"},"options":[{"default_text":"number","translations":{"de":"zehn","en":"ten"},"is_correct":true,"sort_order":1},{"default_text":"number","translations":{"de":"null","en":"zero"},"is_correct":false,"sort_order":2},{"default_text":"number","translations":{"de":"eins","en":"one"},"is_correct":false,"sort_order":3},{"default_text":"number","translations":{"de":"zwei","en":"two"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten'), '5fc5734b-b2bd-55f0-ba7b-bb6313263586', 22) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('a89b7a3d-63a3-5edf-9533-43bde2320366', (select id from language_cards_learning_courses where slug='de-a1-numbers-time-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de-a1-time-words', 2, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), 'de', 'Zeitwörter', 'heute · morgen · gestern · Tag · Woche'),
  ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), 'en', 'Time words', 'today · tomorrow · yesterday · day · week')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('58fdb4a4-6072-5485-916e-cae199234f68', 'de-a1-numbers-time-heute', 'vocabulary', 'heute', 'HOY-te', 'adverb', 'Heute lerne ich Deutsch.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-time-words","kind":"adverb","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('58fdb4a4-6072-5485-916e-cae199234f68', 'de', 'heute', 'Heute lerne ich Deutsch.', null),
  ('58fdb4a4-6072-5485-916e-cae199234f68', 'en', 'today', 'Today I am learning German.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '58fdb4a4-6072-5485-916e-cae199234f68', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('6962a812-70a3-5760-a7c0-fbc90d61af21', 'de-a1-numbers-time-morgen', 'vocabulary', 'morgen', 'MOR-gen', 'adverb', 'Morgen habe ich Zeit.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-time-words","kind":"adverb","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('6962a812-70a3-5760-a7c0-fbc90d61af21', 'de', 'morgen', 'Morgen habe ich Zeit.', null),
  ('6962a812-70a3-5760-a7c0-fbc90d61af21', 'en', 'tomorrow / morning', 'Tomorrow I have time.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '6962a812-70a3-5760-a7c0-fbc90d61af21', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('4b4913d6-4817-50e3-a7b6-d6173b2542c9', 'de-a1-numbers-time-gestern', 'vocabulary', 'gestern', 'GES-tern', 'adverb', 'Gestern war Montag.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-time-words","kind":"adverb","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('4b4913d6-4817-50e3-a7b6-d6173b2542c9', 'de', 'gestern', 'Gestern war Montag.', null),
  ('4b4913d6-4817-50e3-a7b6-d6173b2542c9', 'en', 'yesterday', 'Yesterday was Monday.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '4b4913d6-4817-50e3-a7b6-d6173b2542c9', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('89ceadbf-daa2-5b8a-b2ba-f15e7e3df055', 'de-a1-numbers-time-tag', 'vocabulary', 'der Tag', 'tak', 'noun', 'Der Tag ist schön.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-time-words","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('89ceadbf-daa2-5b8a-b2ba-f15e7e3df055', 'de', 'Tag', 'Der Tag ist schön.', null),
  ('89ceadbf-daa2-5b8a-b2ba-f15e7e3df055', 'en', 'day', 'The day is beautiful.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '89ceadbf-daa2-5b8a-b2ba-f15e7e3df055', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('cb66a79a-9dff-5fa5-8d9a-d345dcf65b28', 'de-a1-numbers-time-woche', 'vocabulary', 'die Woche', 'VO-khe', 'noun', 'Eine Woche hat sieben Tage.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-time-words","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('cb66a79a-9dff-5fa5-8d9a-d345dcf65b28', 'de', 'Woche', 'Eine Woche hat sieben Tage.', null),
  ('cb66a79a-9dff-5fa5-8d9a-d345dcf65b28', 'en', 'week', 'A week has seven days.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), 'cb66a79a-9dff-5fa5-8d9a-d345dcf65b28', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ad72d871-ac51-5a60-8fc7-a8c605b68848', 'de-a1-numbers-time-heute-quiz', 'quiz_4_option', 'heute', 'HOY-te', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 6, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-heute","question":{"de":"Was bedeutet heute?","en":"What does heute mean?"},"options":[{"default_text":"adverb","translations":{"de":"heute","en":"today"},"is_correct":true,"sort_order":1},{"default_text":"adverb","translations":{"de":"morgen","en":"tomorrow / morning"},"is_correct":false,"sort_order":2},{"default_text":"adverb","translations":{"de":"gestern","en":"yesterday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Tag","en":"day"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), 'ad72d871-ac51-5a60-8fc7-a8c605b68848', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('177746bb-fbd7-5d12-b1aa-3805eb6c2717', 'de-a1-numbers-time-morgen-quiz', 'quiz_4_option', 'morgen', 'MOR-gen', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 7, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-morgen","question":{"de":"Was bedeutet morgen?","en":"What does morgen mean?"},"options":[{"default_text":"adverb","translations":{"de":"morgen","en":"tomorrow / morning"},"is_correct":true,"sort_order":1},{"default_text":"adverb","translations":{"de":"gestern","en":"yesterday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Tag","en":"day"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Woche","en":"week"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '177746bb-fbd7-5d12-b1aa-3805eb6c2717', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('2d7056bf-66cf-5a4b-8858-bc631cafd43f', 'de-a1-numbers-time-gestern-quiz', 'quiz_4_option', 'gestern', 'GES-tern', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-gestern","question":{"de":"Was bedeutet gestern?","en":"What does gestern mean?"},"options":[{"default_text":"adverb","translations":{"de":"gestern","en":"yesterday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Tag","en":"day"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Woche","en":"week"},"is_correct":false,"sort_order":3},{"default_text":"adverb","translations":{"de":"heute","en":"today"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '2d7056bf-66cf-5a4b-8858-bc631cafd43f', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a04b63a7-1cbb-54e3-8c9e-bfdeeeccb3a6', 'de-a1-numbers-time-tag-quiz', 'quiz_4_option', 'der Tag', 'tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-tag","question":{"de":"Was bedeutet der Tag?","en":"What does der Tag mean?"},"options":[{"default_text":"noun","translations":{"de":"Tag","en":"day"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Woche","en":"week"},"is_correct":false,"sort_order":2},{"default_text":"adverb","translations":{"de":"heute","en":"today"},"is_correct":false,"sort_order":3},{"default_text":"adverb","translations":{"de":"morgen","en":"tomorrow / morning"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), 'a04b63a7-1cbb-54e3-8c9e-bfdeeeccb3a6', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('3324d4bc-5728-598b-9de0-06883cdeb7ed', 'de-a1-numbers-time-woche-quiz', 'quiz_4_option', 'die Woche', 'VO-khe', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 10, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-woche","question":{"de":"Was bedeutet die Woche?","en":"What does die Woche mean?"},"options":[{"default_text":"noun","translations":{"de":"Woche","en":"week"},"is_correct":true,"sort_order":1},{"default_text":"adverb","translations":{"de":"heute","en":"today"},"is_correct":false,"sort_order":2},{"default_text":"adverb","translations":{"de":"morgen","en":"tomorrow / morning"},"is_correct":false,"sort_order":3},{"default_text":"adverb","translations":{"de":"gestern","en":"yesterday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-time-words'), '3324d4bc-5728-598b-9de0-06883cdeb7ed', 10) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('c61fa714-6568-5eaf-97a1-77d282072765', (select id from language_cards_learning_courses where slug='de-a1-numbers-time-basics' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de-a1-weekdays', 3, true, 'active')
on conflict (course_id, slug) do update set sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'de', 'Wochentage', 'Montag · Dienstag · Mittwoch · Donnerstag · Freitag · Samstag · Sonntag'),
  ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'en', 'Weekdays', 'Monday · Tuesday · Wednesday · Thursday · Friday · Saturday · Sunday')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('f8b621d4-36e3-5a6c-b3ed-20411095818c', 'de-a1-numbers-time-montag', 'vocabulary', 'Montag', 'MON-tak', 'noun', 'Heute ist Montag.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 1, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('f8b621d4-36e3-5a6c-b3ed-20411095818c', 'de', 'Montag', 'Heute ist Montag.', null),
  ('f8b621d4-36e3-5a6c-b3ed-20411095818c', 'en', 'Monday', 'Today is Monday.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'f8b621d4-36e3-5a6c-b3ed-20411095818c', 1) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('39ec16c2-5079-5e0f-8656-e95ebb39b88e', 'de-a1-numbers-time-dienstag', 'vocabulary', 'Dienstag', 'DEENS-tak', 'noun', 'Am Dienstag lerne ich.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 2, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('39ec16c2-5079-5e0f-8656-e95ebb39b88e', 'de', 'Dienstag', 'Am Dienstag lerne ich.', null),
  ('39ec16c2-5079-5e0f-8656-e95ebb39b88e', 'en', 'Tuesday', 'On Tuesday I study.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '39ec16c2-5079-5e0f-8656-e95ebb39b88e', 2) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('7c714a14-be72-5ddf-a560-ef0b127c2107', 'de-a1-numbers-time-mittwoch', 'vocabulary', 'Mittwoch', 'MIT-vokh', 'noun', 'Mittwoch ist in der Mitte.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 3, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('7c714a14-be72-5ddf-a560-ef0b127c2107', 'de', 'Mittwoch', 'Mittwoch ist in der Mitte.', null),
  ('7c714a14-be72-5ddf-a560-ef0b127c2107', 'en', 'Wednesday', 'Wednesday is in the middle.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '7c714a14-be72-5ddf-a560-ef0b127c2107', 3) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('63b5bab5-6be8-51d4-a3b2-8cb36195b0f9', 'de-a1-numbers-time-donnerstag', 'vocabulary', 'Donnerstag', 'DON-ners-tak', 'noun', 'Donnerstag ist gut.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 4, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('63b5bab5-6be8-51d4-a3b2-8cb36195b0f9', 'de', 'Donnerstag', 'Donnerstag ist gut.', null),
  ('63b5bab5-6be8-51d4-a3b2-8cb36195b0f9', 'en', 'Thursday', 'Thursday is good.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '63b5bab5-6be8-51d4-a3b2-8cb36195b0f9', 4) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('36ca3468-ab91-5cff-b347-8ffcef0b99f0', 'de-a1-numbers-time-freitag', 'vocabulary', 'Freitag', 'FRAI-tak', 'noun', 'Freitag ist fast Wochenende.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 5, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('36ca3468-ab91-5cff-b347-8ffcef0b99f0', 'de', 'Freitag', 'Freitag ist fast Wochenende.', null),
  ('36ca3468-ab91-5cff-b347-8ffcef0b99f0', 'en', 'Friday', 'Friday is almost the weekend.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '36ca3468-ab91-5cff-b347-8ffcef0b99f0', 5) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ae8d20c7-ebb3-544e-a758-11d98a331db4', 'de-a1-numbers-time-samstag', 'vocabulary', 'Samstag', 'ZAMS-tak', 'noun', 'Samstag habe ich Zeit.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 6, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('ae8d20c7-ebb3-544e-a758-11d98a331db4', 'de', 'Samstag', 'Samstag habe ich Zeit.', null),
  ('ae8d20c7-ebb3-544e-a758-11d98a331db4', 'en', 'Saturday', 'On Saturday I have time.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'ae8d20c7-ebb3-544e-a758-11d98a331db4', 6) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('09140311-c805-5246-b5eb-f855dcf901ba', 'de-a1-numbers-time-sonntag', 'vocabulary', 'Sonntag', 'ZON-tak', 'noun', 'Sonntag ist ruhig.', null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 7, true, '{"lesson_slug":"de-a1-weekdays","kind":"noun","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('09140311-c805-5246-b5eb-f855dcf901ba', 'de', 'Sonntag', 'Sonntag ist ruhig.', null),
  ('09140311-c805-5246-b5eb-f855dcf901ba', 'en', 'Sunday', 'Sunday is quiet.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '09140311-c805-5246-b5eb-f855dcf901ba', 7) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('f34fcd3b-5631-5650-949d-921857e454d8', 'de-a1-numbers-time-montag-quiz', 'quiz_4_option', 'Montag', 'MON-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 8, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-montag","question":{"de":"Was bedeutet Montag?","en":"What does Montag mean?"},"options":[{"default_text":"noun","translations":{"de":"Montag","en":"Monday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Dienstag","en":"Tuesday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Mittwoch","en":"Wednesday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Donnerstag","en":"Thursday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'f34fcd3b-5631-5650-949d-921857e454d8', 8) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('8c4d8ca9-0309-5c9e-8e2c-813e5819a007', 'de-a1-numbers-time-dienstag-quiz', 'quiz_4_option', 'Dienstag', 'DEENS-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 9, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-dienstag","question":{"de":"Was bedeutet Dienstag?","en":"What does Dienstag mean?"},"options":[{"default_text":"noun","translations":{"de":"Dienstag","en":"Tuesday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Mittwoch","en":"Wednesday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Donnerstag","en":"Thursday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Freitag","en":"Friday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '8c4d8ca9-0309-5c9e-8e2c-813e5819a007', 9) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('9746431e-1ba7-5234-bc0c-ebf5315de513', 'de-a1-numbers-time-mittwoch-quiz', 'quiz_4_option', 'Mittwoch', 'MIT-vokh', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 10, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-mittwoch","question":{"de":"Was bedeutet Mittwoch?","en":"What does Mittwoch mean?"},"options":[{"default_text":"noun","translations":{"de":"Mittwoch","en":"Wednesday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Donnerstag","en":"Thursday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Freitag","en":"Friday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Samstag","en":"Saturday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '9746431e-1ba7-5234-bc0c-ebf5315de513', 10) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a7806eba-a5c7-5e0c-ab03-5314a384aea0', 'de-a1-numbers-time-donnerstag-quiz', 'quiz_4_option', 'Donnerstag', 'DON-ners-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 11, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-donnerstag","question":{"de":"Was bedeutet Donnerstag?","en":"What does Donnerstag mean?"},"options":[{"default_text":"noun","translations":{"de":"Donnerstag","en":"Thursday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Freitag","en":"Friday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Samstag","en":"Saturday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Sonntag","en":"Sunday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'a7806eba-a5c7-5e0c-ab03-5314a384aea0', 11) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('a9143fe2-cb98-56ca-a96e-59307525f47c', 'de-a1-numbers-time-freitag-quiz', 'quiz_4_option', 'Freitag', 'FRAI-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 12, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-freitag","question":{"de":"Was bedeutet Freitag?","en":"What does Freitag mean?"},"options":[{"default_text":"noun","translations":{"de":"Freitag","en":"Friday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Samstag","en":"Saturday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Sonntag","en":"Sunday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Montag","en":"Monday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'a9143fe2-cb98-56ca-a96e-59307525f47c', 12) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('ea294dab-f657-5e51-beda-b10c0c60abf0', 'de-a1-numbers-time-samstag-quiz', 'quiz_4_option', 'Samstag', 'ZAMS-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 13, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-samstag","question":{"de":"Was bedeutet Samstag?","en":"What does Samstag mean?"},"options":[{"default_text":"noun","translations":{"de":"Samstag","en":"Saturday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Sonntag","en":"Sunday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Montag","en":"Monday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Dienstag","en":"Tuesday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), 'ea294dab-f657-5e51-beda-b10c0c60abf0', 13) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values ('99744e94-bfdb-52d5-a4c5-92a9c1d650b6', 'de-a1-numbers-time-sonntag-quiz', 'quiz_4_option', 'Sonntag', 'ZON-tak', null, null, null, 'de-a1-numbers-time', 'beginner', null, null, null, null, 14, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-numbers-time-sonntag","question":{"de":"Was bedeutet Sonntag?","en":"What does Sonntag mean?"},"options":[{"default_text":"noun","translations":{"de":"Sonntag","en":"Sunday"},"is_correct":true,"sort_order":1},{"default_text":"noun","translations":{"de":"Montag","en":"Monday"},"is_correct":false,"sort_order":2},{"default_text":"noun","translations":{"de":"Dienstag","en":"Tuesday"},"is_correct":false,"sort_order":3},{"default_text":"noun","translations":{"de":"Mittwoch","en":"Wednesday"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values ((select id from language_cards_learning_lessons where slug='de-a1-weekdays'), '99744e94-bfdb-52d5-a4c5-92a9c1d650b6', 14) on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('e4f432dc-369e-581e-b4c8-d0006ae7ce3c', (select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'de-a1-start-greetings', 1, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de', 'Begrüßen'),
  ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'en', 'Greetings')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'bd208b65-1f6e-5e26-9a60-21f2de493dec', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '2981c182-a666-50f4-901b-f66f6e323c5b', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'fea0692a-7bf6-5fbe-b0c9-b9b31a9ec0bf', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-greetings' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '64a9880a-683a-5441-95e4-18ccb7923159', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('f9225d0e-b97d-55fb-adc4-f8afd3cd018d', (select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'de-a1-start-politeness', 2, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de', 'Höflich sein'),
  ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'en', 'Being polite')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '4b6de007-0398-5e64-bf4a-50bdfaa9489a', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '6445fe7e-1cfe-5187-a041-7e913a92fa13', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '4b36d098-2a39-5084-8491-d51fef256c21', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-politeness' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'ee02bf7f-cf5c-544b-8dee-bf9f08308927', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('5aa14c82-d50b-5718-85b1-3361c3936bec', (select id from language_cards_categories where language_id='de' and slug='de-a1-start'), 'de-a1-start-mini-sentences', 3, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'de', 'Erste Mini-Sätze'),
  ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'en', 'First mini sentences')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'f2fcecd2-d098-5e93-9fbf-ebaa1e58c736', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'b739408d-dff6-51a7-b439-fe804197ea86', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), '8535d379-3ecc-5cbe-9422-9e023a8791b2', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-start-mini-sentences' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-start')), 'c1193641-fd73-5cfd-9c44-88452b1e93d7', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('dd6d12b0-d12a-573a-ab95-d722f94434ae', (select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'de-a1-people-pronouns', 1, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de', 'Ich, du, Sie'),
  ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'en', 'I, you, formal you')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'a86ca052-3699-542d-bbd9-245518b58124', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'c1321f59-404f-5602-9be5-a938899def0c', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '985852cf-8366-528d-9b79-e483719332bd', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '475f8bdd-683c-5b94-bf4d-554527c0c140', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'a4872886-21c2-56e8-bc70-fe31717796fd', 5) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-pronouns' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '0580eda3-b6e8-5135-ac3d-ba0558dda2bb', 6) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('3aa10926-a2d8-577d-b992-72433431e244', (select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'de-a1-people-sein-haben', 2, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de', 'sein und haben'),
  ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'en', 'to be and to have')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'b1e1f122-9e59-55c9-837a-f360e857d2a3', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'd0f1b0cd-0a20-5309-b51c-0e5975ad8602', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '615a4bf8-0f65-5436-935a-2a487093971b', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-sein-haben' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '46ffbb6b-3694-54bb-a935-28517ae491fd', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('eca959f7-0f75-5a23-a81f-5ab1b35208cd', (select id from language_cards_categories where language_id='de' and slug='de-a1-people'), 'de-a1-people-family', 3, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'de', 'Familie'),
  ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'en', 'Family')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '7afaf22b-700e-5e8a-bae9-fe53c26dbbab', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'a7382b64-ce48-596a-a9d0-71f442b43a99', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), '1b7192c3-d011-5608-8ded-9b813d9063a1', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'f29986bd-65eb-59e6-ba2d-3afab5f20dc1', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-people-family' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-people')), 'd04c7f42-f53b-5f80-ab39-1913d4bc5f05', 5) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('b675bcc7-62bf-5cbc-9b2d-b390453f9607', (select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'de-a1-numbers-zero-ten', 1, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de', 'Zahlen 0 bis 10'),
  ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'en', 'Numbers 0 to 10')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '268421ed-3289-5864-bf73-c381d5d76df6', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '577ede4e-7ce0-5e0a-b040-effc856b117a', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'f0f8e3ba-8942-5b16-90ad-eb3ef81b1455', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '6741714d-7a5b-5258-9009-31fd19944c3e', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'a4bff90e-08ae-5a6a-8b3f-45fccae7414a', 5) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'b1fade31-04ef-5795-971f-ec7b706df39d', 6) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'ea0dea11-1a0a-54bc-a64e-704d9417f67d', 7) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '819efe82-0263-5515-8e4e-c427024db8a0', 8) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'e20d9fad-711f-5e64-bb63-e9ad0fc57c83', 9) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '2b1e0daf-bd90-53ab-bc7f-1a28a68b6c14', 10) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-numbers-zero-ten' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'dd0a5238-c94c-55ac-80ba-78867feaafed', 11) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('49c03dba-7ee7-5cef-a3f4-905a779cf525', (select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'de-a1-time-words', 2, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de', 'Zeitwörter'),
  ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'en', 'Time words')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '58fdb4a4-6072-5485-916e-cae199234f68', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '6962a812-70a3-5760-a7c0-fbc90d61af21', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '4b4913d6-4817-50e3-a7b6-d6173b2542c9', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '89ceadbf-daa2-5b8a-b2ba-f15e7e3df055', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-time-words' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'cb66a79a-9dff-5fa5-8d9a-d345dcf65b28', 5) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('1453afdf-e5ee-5521-85bd-da34a86b1f64', (select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time'), 'de-a1-weekdays', 3, array['swipe']::text[], true, 'active')
on conflict (category_id, slug) do update set sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;

insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'de', 'Wochentage'),
  ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'en', 'Weekdays')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'f8b621d4-36e3-5a6c-b3ed-20411095818c', 1) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '39ec16c2-5079-5e0f-8656-e95ebb39b88e', 2) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '7c714a14-be72-5ddf-a560-ef0b127c2107', 3) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '63b5bab5-6be8-51d4-a3b2-8cb36195b0f9', 4) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '36ca3468-ab91-5cff-b347-8ffcef0b99f0', 5) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), 'ae8d20c7-ebb3-544e-a758-11d98a331db4', 6) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values ((select id from language_cards_practice_groups where slug='de-a1-weekdays' and category_id=(select id from language_cards_categories where language_id='de' and slug='de-a1-numbers-time')), '09140311-c805-5246-b5eb-f855dcf901ba', 7) on conflict (practice_group_id, card_id) do update set sort_order=excluded.sort_order;

notify pgrst, 'reload schema';

commit;
