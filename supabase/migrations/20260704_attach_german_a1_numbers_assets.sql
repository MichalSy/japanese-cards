-- Attach images and audio to the German A1 numbers lesson and keep the menu subtitle concise.

begin;

update language_cards_learning_lesson_translations
set description = case lang_code
  when 'de' then '11 Zahlenkarten, 11 Quizkarten.'
  when 'en' then '11 number cards, 11 quiz cards.'
  else description
end
where lesson_id = (select id from language_cards_learning_lessons where slug='de-a1-numbers-zero-ten')
  and lang_code in ('de', 'en');

update language_cards_cards set
  image_id = case slug
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
    else image_id
  end,
  audio_url = case slug
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
    else audio_url
  end
where slug in ('de-a1-numbers-time-null', 'de-a1-numbers-time-eins', 'de-a1-numbers-time-zwei', 'de-a1-numbers-time-drei', 'de-a1-numbers-time-vier', 'de-a1-numbers-time-fuenf', 'de-a1-numbers-time-sechs', 'de-a1-numbers-time-sieben', 'de-a1-numbers-time-acht', 'de-a1-numbers-time-neun', 'de-a1-numbers-time-zehn');

commit;
