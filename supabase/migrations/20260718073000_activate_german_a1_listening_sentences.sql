-- Activate lesson 8 only when every learning and listening asset is present.
begin;

do $$
declare
  learning_count integer;
  quiz_count integer;
  image_count integer;
  learning_audio_count integer;
  quiz_audio_count integer;
begin
  select count(*), count(image_id), count(audio_url)
    into learning_count, image_count, learning_audio_count
  from language_cards_cards
  where context = 'de-a1-listening-sentences' and card_type = 'sentence';

  select count(*), count(audio_url)
    into quiz_count, quiz_audio_count
  from language_cards_cards
  where context = 'de-a1-listening-sentences' and card_type = 'sentence_quiz';

  if learning_count <> 20 or quiz_count <> 20 or image_count <> 20
     or learning_audio_count <> 20 or quiz_audio_count <> 20 then
    raise exception 'Listening lesson incomplete: learning %, quiz %, images %, learning audio %, quiz audio %',
      learning_count, quiz_count, image_count, learning_audio_count, quiz_audio_count;
  end if;
end $$;

update language_cards_learning_lessons
set is_active = true, status = 'active'
where slug = 'de-a1-basics-listening-sentences';

update language_cards_practice_groups
set is_active = true, status = 'active'
where slug = 'de-a1-basics-listening-sentences';

commit;
