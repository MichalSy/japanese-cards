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

commit;
