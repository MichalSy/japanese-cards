-- Add German A1 Basic lesson: Food and drink, with 10 vocabulary cards, 10 quiz cards, images, and ElevenLabs audio.

begin;

update language_cards_category_translations set description = case lang_code
  when 'de' then 'Der aufgeräumte Einstieg: Begrüßen, erste Sätze, Menschen, Familie, Zahlen, Zeit, Farben, Essen und Trinken.'
  when 'en' then 'A clean beginner start: greetings, first sentences, people, family, numbers, time, colors, food, and drinks.'
  else description end
where category_id = '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d' and lang_code in ('de','en');
update language_cards_learning_course_translations set description = case lang_code
  when 'de' then 'Alles Wichtige für den ersten Einstieg: Worte, Menschen, Zahlen, Zeit, Farben, Essen und Trinken.'
  when 'en' then 'The essential first steps, grouped clearly: words, people, numbers, time, colors, food, and drinks.'
  else description end
where course_id = 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4' and lang_code in ('de','en');

insert into language_cards_learning_lessons (id, course_id, slug, sort_order, is_active, status)
values ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'e1fd8982-b00c-4d1a-a1a0-50e2ce6b0df4', 'de-a1-basics-food-drink', 5, true, 'active')
on conflict (id) do update set course_id=excluded.course_id, slug=excluded.slug, sort_order=excluded.sort_order, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_learning_lesson_translations (lesson_id, lang_code, title, description) values
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'de', 'Essen und Trinken', '10 Essens- und Getränkekarten, 10 Quizkarten.'),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'en', 'Food and drink', '10 food and drink cards, 10 quiz cards.')
on conflict (lesson_id, lang_code) do update set title=excluded.title, description=excluded.description;
insert into language_cards_practice_groups (id, category_id, slug, sort_order, game_modes, is_active, status)
values ('8482deae-788c-5e4c-9a50-1ea569a40237', '8e6bb6a0-7a01-4f8f-b4cd-dc7ba4ebbb2d', 'de-a1-basics-food-drink', 5, array['swipe']::text[], true, 'active')
on conflict (id) do update set category_id=excluded.category_id, slug=excluded.slug, sort_order=excluded.sort_order, game_modes=excluded.game_modes, is_active=excluded.is_active, status=excluded.status;
insert into language_cards_practice_group_translations (practice_group_id, lang_code, name) values
  ('8482deae-788c-5e4c-9a50-1ea569a40237', 'de', 'Essen und Trinken'),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', 'en', 'Food and drink')
on conflict (practice_group_id, lang_code) do update set name=excluded.name;

insert into language_cards_cards (id, slug, card_type, native, transliteration, word_type, example_native, example_transliteration, context, difficulty, content_md, audio_url, image_url, image_id, sort_order, is_active, data) values
  ('4bf64101-f41e-57b9-bb53-13f804bed5a4', 'de-a1-food-drink-apfel', 'vocabulary', 'der Apfel', 'der AP-fel', 'noun', 'Der Apfel ist rot.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-apfel.mp3', null, '10414241-4ec0-4749-a89a-fba4710f8922', 1, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('4aeb89b2-bfcd-5caf-b984-252de6879050', 'de-a1-food-drink-brot', 'vocabulary', 'das Brot', 'das brot', 'noun', 'Das Brot ist frisch.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-brot.mp3', null, 'c5abfcd7-74c6-466d-b774-8b44e0c5956b', 2, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('f932c60f-b25f-5c36-8182-659c49883ef8', 'de-a1-food-drink-wasser', 'vocabulary', 'das Wasser', 'das VAS-ser', 'noun', 'Ich trinke Wasser.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-wasser.mp3', null, '6c5280d8-4ca0-431b-a561-67944a00a8d4', 3, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('c0b7a640-9844-51f5-820b-39fba1461de3', 'de-a1-food-drink-kaffee', 'vocabulary', 'der Kaffee', 'der KAF-fee', 'noun', 'Der Kaffee ist warm.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-kaffee.mp3', null, '9c349ce2-a98b-48fa-9881-37fc1b44e39a', 4, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('f9bcf206-e19e-5558-aba3-adbf60515e29', 'de-a1-food-drink-tee', 'vocabulary', 'der Tee', 'der tee', 'noun', 'Der Tee ist heiß.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-tee.mp3', null, 'be762156-0f94-4c8a-a906-23fae7b1c568', 5, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('646a4cc5-ea41-5a32-9de8-1da46e64113b', 'de-a1-food-drink-milch', 'vocabulary', 'die Milch', 'die milch', 'noun', 'Die Milch ist kalt.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-milch.mp3', null, '113ff151-8c87-4991-92a2-e0521ea31c50', 6, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('9c8f7674-14c5-5bcf-919c-c0a59bf3dfb9', 'de-a1-food-drink-reis', 'vocabulary', 'der Reis', 'der rais', 'noun', 'Der Reis ist weiß.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-reis.mp3', null, 'f86f34ad-b54d-4c8c-b352-eac67dce2e31', 7, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('468e11d1-3e8a-59fa-9ef5-b7cd9d2ada80', 'de-a1-food-drink-suppe', 'vocabulary', 'die Suppe', 'die ZUP-pe', 'noun', 'Die Suppe ist heiß.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-suppe.mp3', null, 'f4890118-d1d1-4dfb-afd3-f5af654e264e', 8, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('2d232895-3c68-55e0-a6f9-a831a33fc129', 'de-a1-food-drink-ei', 'vocabulary', 'das Ei', 'das ai', 'noun', 'Das Ei ist klein.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-ei.mp3', null, 'ca10b81d-32ea-46d3-875f-a85835d1a632', 9, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('7582f8bf-e1d0-56d7-91fc-e42b19d6c3c2', 'de-a1-food-drink-kaese', 'vocabulary', 'der Käse', 'der KÄ-ze', 'noun', 'Der Käse ist gelb.', null, 'de-a1-food-drink', 'beginner', null, 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-food-drink-20260705142000/de-a1-food-drink-kaese.mp3', null, '76803e4b-784b-492d-b8c8-7b570b734118', 10, true, '{"kind":"food_drink","lesson_slug":"de-a1-basics-food-drink","learn_language":"de"}'::jsonb),
  ('a4310f8a-0666-537b-b70d-a3d9f52e8a75', 'de-a1-food-drink-apfel-quiz', 'quiz_4_option', 'der Apfel', 'der AP-fel', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 11, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Wasser","en":"water"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"der Kaffee","en":"coffee"}}],"question":{"de":"Was bedeutet der Apfel?","en":"What does der Apfel mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-apfel"}'::jsonb),
  ('eef3ff98-0602-5e12-9a59-bb13987bc6ce', 'de-a1-food-drink-brot-quiz', 'quiz_4_option', 'das Brot', 'das brot', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 12, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Wasser","en":"water"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"der Kaffee","en":"coffee"}}],"question":{"de":"Was bedeutet das Brot?","en":"What does das Brot mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-brot"}'::jsonb),
  ('32662d48-566b-5c87-81ba-e7e50eea74db', 'de-a1-food-drink-wasser-quiz', 'quiz_4_option', 'das Wasser', 'das VAS-ser', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 13, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"das Wasser","en":"water"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"der Kaffee","en":"coffee"}}],"question":{"de":"Was bedeutet das Wasser?","en":"What does das Wasser mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-wasser"}'::jsonb),
  ('b6fce200-5bae-5820-88b9-426dbdc2f639', 'de-a1-food-drink-kaffee-quiz', 'quiz_4_option', 'der Kaffee', 'der KAF-fee', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 14, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"der Kaffee","en":"coffee"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet der Kaffee?","en":"What does der Kaffee mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-kaffee"}'::jsonb),
  ('19c7af29-22d7-5194-a083-cd3952a6bccb', 'de-a1-food-drink-tee-quiz', 'quiz_4_option', 'der Tee', 'der tee', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 15, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"der Tee","en":"tea"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet der Tee?","en":"What does der Tee mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-tee"}'::jsonb),
  ('33f345c8-73ac-5bdb-a762-1ba9d1db59f3', 'de-a1-food-drink-milch-quiz', 'quiz_4_option', 'die Milch', 'die milch', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 16, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"die Milch","en":"milk"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet die Milch?","en":"What does die Milch mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-milch"}'::jsonb),
  ('cd653ccf-9cdf-5071-8e18-a2a5a04100a2', 'de-a1-food-drink-reis-quiz', 'quiz_4_option', 'der Reis', 'der rais', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 17, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"der Reis","en":"rice"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet der Reis?","en":"What does der Reis mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-reis"}'::jsonb),
  ('81b8ef6d-34ef-5537-b282-7bec88d7bcc5', 'de-a1-food-drink-suppe-quiz', 'quiz_4_option', 'die Suppe', 'die ZUP-pe', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 18, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"die Suppe","en":"soup"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet die Suppe?","en":"What does die Suppe mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-suppe"}'::jsonb),
  ('38d5c831-23d0-5b99-ab16-f76007647cc2', 'de-a1-food-drink-ei-quiz', 'quiz_4_option', 'das Ei', 'das ai', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 19, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"das Ei","en":"egg"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet das Ei?","en":"What does das Ei mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-ei"}'::jsonb),
  ('ed76b33b-1b65-5ad2-b112-2e2bf6b2d9ca', 'de-a1-food-drink-kaese-quiz', 'quiz_4_option', 'der Käse', 'der KÄ-ze', null, null, null, 'de-a1-food-drink', 'beginner', null, null, null, null, 20, true, '{"options":[{"is_correct":true,"sort_order":1,"default_text":"food","translations":{"de":"der Käse","en":"cheese"}},{"is_correct":false,"sort_order":2,"default_text":"food","translations":{"de":"der Apfel","en":"apple"}},{"is_correct":false,"sort_order":3,"default_text":"food","translations":{"de":"das Brot","en":"bread"}},{"is_correct":false,"sort_order":4,"default_text":"food","translations":{"de":"das Wasser","en":"water"}}],"question":{"de":"Was bedeutet der Käse?","en":"What does der Käse mean?"},"quiz_type":"vocabulary_translation","learn_language":"de","source_card_slug":"de-a1-food-drink-kaese"}'::jsonb)
on conflict (id) do update set slug=excluded.slug, card_type=excluded.card_type, native=excluded.native, transliteration=excluded.transliteration, word_type=excluded.word_type, example_native=excluded.example_native, example_transliteration=excluded.example_transliteration, context=excluded.context, difficulty=excluded.difficulty, content_md=excluded.content_md, audio_url=excluded.audio_url, image_url=excluded.image_url, image_id=excluded.image_id, sort_order=excluded.sort_order, is_active=excluded.is_active, data=excluded.data;

insert into language_cards_card_translations (card_id, lang_code, translation, example_translation, hint) values
  ('2d232895-3c68-55e0-a6f9-a831a33fc129', 'de', 'das Ei', 'Das Ei ist klein.', null),
  ('2d232895-3c68-55e0-a6f9-a831a33fc129', 'en', 'egg', 'Das Ei ist klein.', null),
  ('468e11d1-3e8a-59fa-9ef5-b7cd9d2ada80', 'de', 'die Suppe', 'Die Suppe ist heiß.', null),
  ('468e11d1-3e8a-59fa-9ef5-b7cd9d2ada80', 'en', 'soup', 'Die Suppe ist heiß.', null),
  ('4aeb89b2-bfcd-5caf-b984-252de6879050', 'de', 'das Brot', 'Das Brot ist frisch.', null),
  ('4aeb89b2-bfcd-5caf-b984-252de6879050', 'en', 'bread', 'Das Brot ist frisch.', null),
  ('4bf64101-f41e-57b9-bb53-13f804bed5a4', 'de', 'der Apfel', 'Der Apfel ist rot.', null),
  ('4bf64101-f41e-57b9-bb53-13f804bed5a4', 'en', 'apple', 'Der Apfel ist rot.', null),
  ('646a4cc5-ea41-5a32-9de8-1da46e64113b', 'de', 'die Milch', 'Die Milch ist kalt.', null),
  ('646a4cc5-ea41-5a32-9de8-1da46e64113b', 'en', 'milk', 'Die Milch ist kalt.', null),
  ('7582f8bf-e1d0-56d7-91fc-e42b19d6c3c2', 'de', 'der Käse', 'Der Käse ist gelb.', null),
  ('7582f8bf-e1d0-56d7-91fc-e42b19d6c3c2', 'en', 'cheese', 'Der Käse ist gelb.', null),
  ('9c8f7674-14c5-5bcf-919c-c0a59bf3dfb9', 'de', 'der Reis', 'Der Reis ist weiß.', null),
  ('9c8f7674-14c5-5bcf-919c-c0a59bf3dfb9', 'en', 'rice', 'Der Reis ist weiß.', null),
  ('c0b7a640-9844-51f5-820b-39fba1461de3', 'de', 'der Kaffee', 'Der Kaffee ist warm.', null),
  ('c0b7a640-9844-51f5-820b-39fba1461de3', 'en', 'coffee', 'Der Kaffee ist warm.', null),
  ('f932c60f-b25f-5c36-8182-659c49883ef8', 'de', 'das Wasser', 'Ich trinke Wasser.', null),
  ('f932c60f-b25f-5c36-8182-659c49883ef8', 'en', 'water', 'Ich trinke Wasser.', null),
  ('f9bcf206-e19e-5558-aba3-adbf60515e29', 'de', 'der Tee', 'Der Tee ist heiß.', null),
  ('f9bcf206-e19e-5558-aba3-adbf60515e29', 'en', 'tea', 'Der Tee ist heiß.', null)
on conflict (card_id, lang_code) do update set translation=excluded.translation, example_translation=excluded.example_translation, hint=excluded.hint;

delete from language_cards_learning_lesson_cards where lesson_id = 'ff309354-c6f3-54f0-97c3-fbf0fecd2cb1';
insert into language_cards_learning_lesson_cards (lesson_id, card_id, sort_order) values
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '4bf64101-f41e-57b9-bb53-13f804bed5a4', 1),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '4aeb89b2-bfcd-5caf-b984-252de6879050', 2),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'f932c60f-b25f-5c36-8182-659c49883ef8', 3),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'c0b7a640-9844-51f5-820b-39fba1461de3', 4),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'f9bcf206-e19e-5558-aba3-adbf60515e29', 5),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '646a4cc5-ea41-5a32-9de8-1da46e64113b', 6),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '9c8f7674-14c5-5bcf-919c-c0a59bf3dfb9', 7),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '468e11d1-3e8a-59fa-9ef5-b7cd9d2ada80', 8),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '2d232895-3c68-55e0-a6f9-a831a33fc129', 9),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '7582f8bf-e1d0-56d7-91fc-e42b19d6c3c2', 10),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'a4310f8a-0666-537b-b70d-a3d9f52e8a75', 11),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'eef3ff98-0602-5e12-9a59-bb13987bc6ce', 12),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '32662d48-566b-5c87-81ba-e7e50eea74db', 13),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'b6fce200-5bae-5820-88b9-426dbdc2f639', 14),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '19c7af29-22d7-5194-a083-cd3952a6bccb', 15),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '33f345c8-73ac-5bdb-a762-1ba9d1db59f3', 16),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'cd653ccf-9cdf-5071-8e18-a2a5a04100a2', 17),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '81b8ef6d-34ef-5537-b282-7bec88d7bcc5', 18),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', '38d5c831-23d0-5b99-ab16-f76007647cc2', 19),
  ('ff309354-c6f3-54f0-97c3-fbf0fecd2cb1', 'ed76b33b-1b65-5ad2-b112-2e2bf6b2d9ca', 20);

delete from language_cards_practice_group_cards where practice_group_id = '8482deae-788c-5e4c-9a50-1ea569a40237';
insert into language_cards_practice_group_cards (practice_group_id, card_id, sort_order) values
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '4bf64101-f41e-57b9-bb53-13f804bed5a4', 1),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '4aeb89b2-bfcd-5caf-b984-252de6879050', 2),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', 'f932c60f-b25f-5c36-8182-659c49883ef8', 3),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', 'c0b7a640-9844-51f5-820b-39fba1461de3', 4),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', 'f9bcf206-e19e-5558-aba3-adbf60515e29', 5),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '646a4cc5-ea41-5a32-9de8-1da46e64113b', 6),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '9c8f7674-14c5-5bcf-919c-c0a59bf3dfb9', 7),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '468e11d1-3e8a-59fa-9ef5-b7cd9d2ada80', 8),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '2d232895-3c68-55e0-a6f9-a831a33fc129', 9),
  ('8482deae-788c-5e4c-9a50-1ea569a40237', '7582f8bf-e1d0-56d7-91fc-e42b19d6c3c2', 10);

commit;
