-- Add a simple one-to-many grouping layer above categories.
-- A category belongs to at most one collection via language_cards_categories.collection_id.

begin;

create table if not exists language_cards_category_collections (
  id uuid primary key default gen_random_uuid(),
  language_id text not null,
  slug text not null,
  emoji text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(language_id, slug)
);

create table if not exists language_cards_category_collection_translations (
  collection_id uuid not null references language_cards_category_collections(id) on delete cascade,
  lang_code text not null,
  name text not null,
  description text,
  primary key(collection_id, lang_code)
);

alter table language_cards_categories
  add column if not exists collection_id uuid references language_cards_category_collections(id) on delete set null;

alter table language_cards_categories
  add column if not exists collection_sort_order int not null default 0;

create index if not exists idx_language_cards_categories_collection
  on language_cards_categories(collection_id, collection_sort_order, sort_order);

with collection as (
  insert into language_cards_category_collections (language_id, slug, emoji, sort_order, is_active)
  values ('ja', 'jlpt-n5', '🎓', 1, true)
  on conflict (language_id, slug) do update set
    emoji = excluded.emoji,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active
  returning id
)
insert into language_cards_category_collection_translations (collection_id, lang_code, name, description)
select id, 'de', 'JLPT N5', 'Grundlagen für die erste Japanisch-Prüfung'
from collection
on conflict (collection_id, lang_code) do update set
  name = excluded.name,
  description = excluded.description;

with collection as (
  select id from language_cards_category_collections
  where language_id = 'ja' and slug = 'jlpt-n5'
)
insert into language_cards_category_collection_translations (collection_id, lang_code, name, description)
select id, 'en', 'JLPT N5', 'Basics for the first Japanese proficiency test'
from collection
on conflict (collection_id, lang_code) do update set
  name = excluded.name,
  description = excluded.description;

with collection as (
  select id from language_cards_category_collections
  where language_id = 'ja' and slug = 'jlpt-n5'
)
update language_cards_categories cat
set
  collection_id = collection.id,
  collection_sort_order = case cat.slug
    when 'hiragana' then 1
    when 'katakana' then 2
    when 'first-words' then 3
    else cat.sort_order
  end
from collection
where cat.language_id = 'ja'
  and cat.slug in ('hiragana', 'katakana', 'first-words');


with collection as (
  select id from language_cards_category_collections
  where language_id = 'ja' and slug = 'jlpt-n5'
), planned_categories as (
  select * from (values
    ('n5-vocabulary', '語彙', '📚', '#6366f1', 'vocabulary', 4, 'N5 Vokabeln', 'Kernwortschatz für JLPT N5', 'N5 Vocabulary', 'Core vocabulary for JLPT N5'),
    ('n5-numbers-time', '数と時間', '🔢', '#14b8a6', 'vocabulary', 5, 'Zahlen & Zeit', 'Zahlen, Uhrzeit, Datum, Wochentage und Mengen', 'Numbers & Time', 'Numbers, time, dates, weekdays, and quantities'),
    ('n5-particles', '助詞', '🧩', '#f59e0b', 'grammar', 6, 'Partikel', 'N5-Partikel wie は, が, を, に, で und の', 'Particles', 'N5 particles such as は, が, を, に, で, and の'),
    ('n5-verbs', '動詞', '🏃', '#ef4444', 'grammar', 7, 'Verben', 'Verbgruppen und grundlegende N5-Formen', 'Verbs', 'Verb groups and basic N5 forms'),
    ('n5-adjectives', '形容詞', '🎨', '#ec4899', 'grammar', 8, 'Adjektive', 'い- und な-Adjektive mit einfachen Formen', 'Adjectives', 'い and な adjectives with basic forms'),
    ('n5-grammar', '文法', '🏗️', '#8b5cf6', 'grammar', 9, 'Grammatik', 'Grundlegender Satzbau und wichtige N5-Muster', 'Grammar', 'Basic sentence structure and important N5 patterns'),
    ('n5-kanji', '漢字', '🈶', '#0ea5e9', 'character', 10, 'N5 Kanji', 'Grundlegende Kanji mit Lesungen und Beispielwörtern', 'N5 Kanji', 'Basic kanji with readings and example words'),
    ('n5-phrases', '表現', '💬', '#22c55e', 'phrase', 11, 'Sätze & Dialoge', 'Alltagssätze, Mini-Dialoge und Prüfungsmuster', 'Phrases & Dialogues', 'Everyday phrases, mini dialogues, and test patterns')
  ) as v(slug, native_name, emoji, color, card_type, collection_sort_order, de_name, de_description, en_name, en_description)
), upserted as (
  insert into language_cards_categories (
    id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option,
    sort_order, is_active, collection_id, collection_sort_order
  )
  select
    gen_random_uuid(), 'ja', p.slug, p.native_name, p.emoji, p.color, p.card_type, array[]::text[], false,
    100 + p.collection_sort_order, false, c.id, p.collection_sort_order
  from planned_categories p
  cross join collection c
  on conflict (language_id, slug) do update set
    native_name = excluded.native_name,
    emoji = excluded.emoji,
    color = excluded.color,
    card_type = excluded.card_type,
    collection_id = excluded.collection_id,
    collection_sort_order = excluded.collection_sort_order,
    sort_order = excluded.sort_order
  returning id, slug
)
insert into language_cards_category_translations (category_id, lang_code, name, description)
select u.id, lang.lang_code,
  case when lang.lang_code = 'de' then p.de_name else p.en_name end,
  case when lang.lang_code = 'de' then p.de_description else p.en_description end
from upserted u
join planned_categories p on p.slug = u.slug
cross join (values ('de'), ('en')) as lang(lang_code)
on conflict (category_id, lang_code) do update set
  name = excluded.name,
  description = excluded.description;

commit;
