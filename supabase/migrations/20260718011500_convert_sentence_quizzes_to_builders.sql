-- Replace three-option German sentence quizzes with word-by-word sentence builders.
-- Each quiz mixes the unique words of the target sentence with exactly one adjacent distractor sentence.
begin;

with sentence_words as (
  select
    slug,
    sort_order,
    to_jsonb(regexp_split_to_array(
      regexp_replace(trim(native), '[.!?]+$', ''),
      E'\\s+'
    )) as words
  from language_cards_cards
  where context = 'de-a1-simple-sentences'
    and card_type = 'sentence'
),
sentence_pairs as (
  select
    slug,
    words as target_words,
    coalesce(
      lead(words) over (order by sort_order),
      first_value(words) over (order by sort_order rows between unbounded preceding and unbounded following)
    ) as distractor_words
  from sentence_words
)
update language_cards_cards quiz
set data = (quiz.data - 'options') || jsonb_build_object(
  'quiz_type', 'sentence_builder',
  'question', jsonb_build_object(
    'de', 'Baue den deutschen Satz:',
    'en', 'Build the German sentence:'
  ),
  'target_words', pair.target_words,
  'distractor_words', pair.distractor_words
)
from sentence_pairs pair
where quiz.context = 'de-a1-simple-sentences'
  and quiz.card_type = 'sentence_quiz'
  and quiz.data->>'source_card_slug' = pair.slug;

update language_cards_learning_lesson_translations
set description = case lang_code
  when 'de' then '20 kurze Sätze und 20 Satzbau-Quizfragen mit gemischten Wort-Tags.'
  when 'en' then '20 short sentences and 20 sentence-building quizzes with mixed word tags.'
  else description
end
where lesson_id = '21956ad1-bba8-5b61-97b7-e947eb1e7d89'
  and lang_code in ('de', 'en');

commit;
