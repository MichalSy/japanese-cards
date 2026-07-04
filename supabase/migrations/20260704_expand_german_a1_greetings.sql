-- Expand the first German A1 lesson so it is a useful starter block, not just four items.
-- Menu descriptions should summarize card counts, not list every word.

update language_cards_learning_lesson_translations
set title = case lang_code
  when 'de' then 'Begrüßen & verabschieden'
  when 'en' then 'Greetings & goodbyes'
  else title
end,
description = case lang_code
  when 'de' then '8 Sätze, 8 Quizkarten.'
  when 'en' then '8 phrase cards, 8 quiz cards.'
  else description
end
where lesson_id = (select id from language_cards_learning_lessons where slug='de-a1-start-greetings')
  and lang_code in ('de', 'en');

update language_cards_cards
set data = '{"content_md":{"de":"# Begrüßen & verabschieden\n\nDu lernst jetzt die wichtigsten Wörter, um ein Gespräch freundlich zu beginnen und wieder zu beenden. Hör zu, sprich nach - ein Satz reicht für den Anfang.","en":"# Greetings & goodbyes\n\nYou will learn the first phrases for starting and ending a conversation. Listen, repeat - one sentence is enough to begin."}}'::jsonb
where slug = 'de-a1-info-greetings';

-- Additional farewell/night phrases for the first lesson.
insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values
  ('bd145966-92da-5894-8859-72d28c79d5a9', 'de-a1-start-tschuess-greet', 'vocabulary', 'Tschüss', 'tschüss', 'interjection', 'Tschüss, bis morgen!', null, 'de-a1-start', 'beginner', null, null, null, null, 6, true, '{"lesson_slug":"de-a1-start-greetings","kind":"interjection","learn_language":"de"}'::jsonb),
  ('f552db47-d93c-5459-b0da-d2556d5f1f34', 'de-a1-start-auf-wiedersehen', 'vocabulary', 'Auf Wiedersehen', 'auf VEE-der-zey-en', 'phrase', 'Auf Wiedersehen!', null, 'de-a1-start', 'beginner', null, null, null, null, 7, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb),
  ('f7765214-6dee-5a33-9da0-ff8b0f96cac8', 'de-a1-start-bis-spaeter', 'vocabulary', 'Bis später', 'bis SHPÄ-ter', 'phrase', 'Bis später!', null, 'de-a1-start', 'beginner', null, null, null, null, 8, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb),
  ('715d5b34-a39c-59de-9ade-400c574b3614', 'de-a1-start-gute-nacht', 'vocabulary', 'Gute Nacht', 'GU-te nakht', 'phrase', 'Gute Nacht!', null, 'de-a1-start', 'beginner', null, null, null, null, 9, true, '{"lesson_slug":"de-a1-start-greetings","kind":"phrase","learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

update language_cards_cards set
  image_id = case slug
    when 'de-a1-start-tschuess-greet' then 'b01b6c49-9bc8-44c9-b223-2ff1eaefe6d9'
    when 'de-a1-start-auf-wiedersehen' then '0f88621d-8325-4d44-bb71-52f6bf09f050'
    when 'de-a1-start-bis-spaeter' then 'b703438d-eb92-4843-97c4-d5acfc9ee07f'
    when 'de-a1-start-gute-nacht' then 'c917db28-41d9-461c-8fa9-ddd9fa17c812'
    else image_id
  end,
  audio_url = case slug
    when 'de-a1-start-tschuess-greet' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-tschuess-greet.mp3'
    when 'de-a1-start-auf-wiedersehen' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-auf-wiedersehen.mp3'
    when 'de-a1-start-bis-spaeter' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-bis-spaeter.mp3'
    when 'de-a1-start-gute-nacht' then 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/start-greetings-20260704194728/de-a1-start-gute-nacht.mp3'
    else audio_url
  end
where slug in ('de-a1-start-tschuess-greet', 'de-a1-start-auf-wiedersehen', 'de-a1-start-bis-spaeter', 'de-a1-start-gute-nacht');

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('bd145966-92da-5894-8859-72d28c79d5a9', 'de', 'lockerer Abschied', 'Tschüss, bis morgen!', null),
  ('bd145966-92da-5894-8859-72d28c79d5a9', 'en', 'bye', 'Bye, see you tomorrow!', null),
  ('f552db47-d93c-5459-b0da-d2556d5f1f34', 'de', 'formeller Abschied', 'Auf Wiedersehen!', null),
  ('f552db47-d93c-5459-b0da-d2556d5f1f34', 'en', 'goodbye', 'Goodbye!', null),
  ('f7765214-6dee-5a33-9da0-ff8b0f96cac8', 'de', 'bis später', 'Bis später!', null),
  ('f7765214-6dee-5a33-9da0-ff8b0f96cac8', 'en', 'see you later', 'See you later!', null),
  ('715d5b34-a39c-59de-9ade-400c574b3614', 'de', 'gute Nacht', 'Gute Nacht!', null),
  ('715d5b34-a39c-59de-9ade-400c574b3614', 'en', 'good night', 'Good night!', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

-- Put all vocabulary first, then quizzes.
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'bd145966-92da-5894-8859-72d28c79d5a9', 6),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'f552db47-d93c-5459-b0da-d2556d5f1f34', 7),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'f7765214-6dee-5a33-9da0-ff8b0f96cac8', 8),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '715d5b34-a39c-59de-9ade-400c574b3614', 9),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'ae6502ba-d3ac-5f48-9e3f-8cc8459f9b15', 10),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '4c28a380-a295-5682-8c9b-bc88ee209e79', 11),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '70b57125-d6cf-5583-b4b1-65b6a90af910', 12),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'fda6d175-f823-568a-a71b-6347a9dba6bf', 13)
on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;

update language_cards_cards set sort_order = case slug
  when 'de-a1-start-hallo-quiz' then 10
  when 'de-a1-start-guten-morgen-quiz' then 11
  when 'de-a1-start-guten-tag-quiz' then 12
  when 'de-a1-start-guten-abend-quiz' then 13
  else sort_order
end
where slug in ('de-a1-start-hallo-quiz', 'de-a1-start-guten-morgen-quiz', 'de-a1-start-guten-tag-quiz', 'de-a1-start-guten-abend-quiz');

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data)
values
  ('eb915fc4-4f1b-5c63-80e5-bd5af61d162a', 'de-a1-start-tschuess-greet-quiz', 'quiz_4_option', 'Tschüss', 'tschüss', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 14, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-tschuess-greet","question":{"de":"Was bedeutet Tschüss?","en":"What does Tschüss mean?"},"options":[{"default_text":"interjection","translations":{"de":"lockerer Abschied","en":"bye"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"formeller Abschied","en":"goodbye"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"bis später","en":"see you later"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"gute Nacht","en":"good night"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
  ('0456ab8d-d5df-5d00-a48c-6446683ef0c3', 'de-a1-start-auf-wiedersehen-quiz', 'quiz_4_option', 'Auf Wiedersehen', 'auf VEE-der-zey-en', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 15, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-auf-wiedersehen","question":{"de":"Was bedeutet Auf Wiedersehen?","en":"What does Auf Wiedersehen mean?"},"options":[{"default_text":"phrase","translations":{"de":"formeller Abschied","en":"goodbye"},"is_correct":true,"sort_order":1},{"default_text":"interjection","translations":{"de":"lockerer Abschied","en":"bye"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"bis später","en":"see you later"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"gute Nacht","en":"good night"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
  ('5dc18085-e241-5087-8e66-bc6653f9f223', 'de-a1-start-bis-spaeter-quiz', 'quiz_4_option', 'Bis später', 'bis SHPÄ-ter', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 16, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-bis-spaeter","question":{"de":"Was bedeutet Bis später?","en":"What does Bis später mean?"},"options":[{"default_text":"phrase","translations":{"de":"bis später","en":"see you later"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"gute Nacht","en":"good night"},"is_correct":false,"sort_order":2},{"default_text":"interjection","translations":{"de":"lockerer Abschied","en":"bye"},"is_correct":false,"sort_order":3},{"default_text":"phrase","translations":{"de":"formeller Abschied","en":"goodbye"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb),
  ('18c1c0bd-7dcc-5b09-915f-342a3210282a', 'de-a1-start-gute-nacht-quiz', 'quiz_4_option', 'Gute Nacht', 'GU-te nakht', null, null, null, 'de-a1-start', 'beginner', null, null, null, null, 17, true, '{"quiz_type":"vocabulary_translation","source_card_slug":"de-a1-start-gute-nacht","question":{"de":"Was bedeutet Gute Nacht?","en":"What does Gute Nacht mean?"},"options":[{"default_text":"phrase","translations":{"de":"gute Nacht","en":"good night"},"is_correct":true,"sort_order":1},{"default_text":"phrase","translations":{"de":"bis später","en":"see you later"},"is_correct":false,"sort_order":2},{"default_text":"phrase","translations":{"de":"formeller Abschied","en":"goodbye"},"is_correct":false,"sort_order":3},{"default_text":"interjection","translations":{"de":"lockerer Abschied","en":"bye"},"is_correct":false,"sort_order":4}],"learn_language":"de"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, context=excluded.context, difficulty=excluded.difficulty, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data, audio_url=null, image_url=null, image_id=null;

insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), 'eb915fc4-4f1b-5c63-80e5-bd5af61d162a', 14),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '0456ab8d-d5df-5d00-a48c-6446683ef0c3', 15),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '5dc18085-e241-5087-8e66-bc6653f9f223', 16),
  ((select id from language_cards_learning_lessons where slug='de-a1-start-greetings'), '18c1c0bd-7dcc-5b09-915f-342a3210282a', 17)
on conflict (lesson_id, card_id) do update set sort_order=excluded.sort_order;
