-- Introduce language-level tracks (JLPT/CEFR/custom) and explicit content status.
-- Current lifecycle states are draft, planned, and active.

begin;

-- 1) Explicit lifecycle status. Keep existing is_active columns for compatibility.
alter table language_cards_categories
  add column if not exists status text;
alter table language_cards_learning_courses
  add column if not exists status text;
alter table language_cards_learning_lessons
  add column if not exists status text;
alter table language_cards_practice_groups
  add column if not exists status text;

update language_cards_categories
set status = case
  when is_active = true then 'active'
  when status is null then 'draft'
  else status
end;

update language_cards_learning_courses
set status = case
  when is_active = true then 'active'
  when status is null then 'draft'
  else status
end;

update language_cards_learning_lessons
set status = case
  when is_active = true then 'active'
  when status is null then 'draft'
  else status
end;

update language_cards_practice_groups pg
set status = case
  when pg.is_active = true then 'active'
  when pg.status is null then 'draft'
  else pg.status
end
from language_cards_categories c
where c.id = pg.category_id;

alter table language_cards_categories alter column status set default 'draft';
alter table language_cards_categories alter column status set not null;
alter table language_cards_learning_courses alter column status set default 'draft';
alter table language_cards_learning_courses alter column status set not null;
alter table language_cards_learning_lessons alter column status set default 'draft';
alter table language_cards_learning_lessons alter column status set not null;
alter table language_cards_practice_groups alter column status set default 'draft';
alter table language_cards_practice_groups alter column status set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'language_cards_categories_status_check') then
    alter table language_cards_categories add constraint language_cards_categories_status_check
      check (status in ('draft', 'planned', 'active'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'language_cards_learning_courses_status_check') then
    alter table language_cards_learning_courses add constraint language_cards_learning_courses_status_check
      check (status in ('draft', 'planned', 'active'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'language_cards_learning_lessons_status_check') then
    alter table language_cards_learning_lessons add constraint language_cards_learning_lessons_status_check
      check (status in ('draft', 'planned', 'active'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'language_cards_practice_groups_status_check') then
    alter table language_cards_practice_groups add constraint language_cards_practice_groups_status_check
      check (status in ('draft', 'planned', 'active'));
  end if;
end $$;

-- 2) Tracks: top-level learning-language structure (JLPT N5-N1, CEFR A1-C2, ...).
create table if not exists language_cards_tracks (
  id uuid primary key default gen_random_uuid(),
  language_id text not null references language_cards_languages(id) on delete cascade,
  slug text not null,
  level_system text not null default 'custom',
  level_code text,
  emoji text,
  status text not null default 'planned' check (status in ('draft', 'planned', 'active')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(language_id, slug)
);

create table if not exists language_cards_track_translations (
  track_id uuid not null references language_cards_tracks(id) on delete cascade,
  lang_code text not null,
  name text not null,
  description text,
  primary key(track_id, lang_code)
);

create table if not exists language_cards_track_categories (
  track_id uuid not null references language_cards_tracks(id) on delete cascade,
  category_id uuid not null references language_cards_categories(id) on delete cascade,
  sort_order int not null default 0,
  status_override text check (status_override is null or status_override in ('draft', 'planned', 'active')),
  created_at timestamptz not null default now(),
  primary key(track_id, category_id)
);

create index if not exists idx_language_cards_tracks_language_status_sort
  on language_cards_tracks(language_id, status, sort_order);
create index if not exists idx_language_cards_track_categories_track_sort
  on language_cards_track_categories(track_id, sort_order);
create index if not exists idx_language_cards_track_categories_category
  on language_cards_track_categories(category_id);
create index if not exists idx_language_cards_categories_language_status_sort
  on language_cards_categories(language_id, status, is_active, sort_order);
create index if not exists idx_language_cards_learning_courses_category_status_sort
  on language_cards_learning_courses(category_id, status, is_active, sort_order);
create index if not exists idx_language_cards_practice_groups_category_status_sort
  on language_cards_practice_groups(category_id, status, is_active, sort_order);

alter table language_cards_tracks enable row level security;
alter table language_cards_track_translations enable row level security;
alter table language_cards_track_categories enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'language_cards_tracks' and policyname = 'language_cards_tracks_read') then
    create policy language_cards_tracks_read on language_cards_tracks for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'language_cards_track_translations' and policyname = 'language_cards_track_translations_read') then
    create policy language_cards_track_translations_read on language_cards_track_translations for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'language_cards_track_categories' and policyname = 'language_cards_track_categories_read') then
    create policy language_cards_track_categories_read on language_cards_track_categories for select to authenticated using (true);
  end if;
end $$;

-- 3) Seed Japanese JLPT tracks and future German CEFR tracks.
with track_seed(language_id, slug, level_system, level_code, emoji, status, sort_order, de_name, de_description, en_name, en_description) as (
  values
    ('ja', 'jlpt-n5', 'jlpt', 'N5', '🎓', 'active', 1, 'JLPT N5', 'Grundlagen für die erste Japanisch-Prüfung', 'JLPT N5', 'Basics for the first Japanese proficiency test'),
    ('ja', 'jlpt-n4', 'jlpt', 'N4', '🌿', 'planned', 2, 'JLPT N4', 'Aufbaukurs nach N5', 'JLPT N4', 'Follow-up course after N5'),
    ('ja', 'jlpt-n3', 'jlpt', 'N3', '⛩️', 'planned', 3, 'JLPT N3', 'Mittelstufe mit Alltag und Lesen', 'JLPT N3', 'Intermediate everyday Japanese and reading'),
    ('ja', 'jlpt-n2', 'jlpt', 'N2', '🗻', 'planned', 4, 'JLPT N2', 'Fortgeschrittene Grammatik, Kanji und Texte', 'JLPT N2', 'Advanced grammar, kanji, and texts'),
    ('ja', 'jlpt-n1', 'jlpt', 'N1', '🏯', 'planned', 5, 'JLPT N1', 'Höchste JLPT-Stufe für komplexes Japanisch', 'JLPT N1', 'Highest JLPT level for complex Japanese'),
    ('de', 'de-a1', 'cefr', 'A1', '🇩🇪', 'planned', 1, 'Deutsch A1', 'Einstieg in Deutsch: Alltag, Basiswortschatz und einfache Sätze', 'German A1', 'Beginner German: everyday language, core vocabulary, and simple sentences'),
    ('de', 'de-a2', 'cefr', 'A2', '🇩🇪', 'planned', 2, 'Deutsch A2', 'Grundlagen erweitern und Alltagssituationen sicherer verstehen', 'German A2', 'Expand basics and understand everyday situations more confidently'),
    ('de', 'de-b1', 'cefr', 'B1', '🇩🇪', 'planned', 3, 'Deutsch B1', 'Selbstständiger Sprachgebrauch im Alltag und Beruf', 'German B1', 'Independent everyday and work-related German'),
    ('de', 'de-b2', 'cefr', 'B2', '🇩🇪', 'planned', 4, 'Deutsch B2', 'Fortgeschrittene Grammatik, Diskussionen und Texte', 'German B2', 'Advanced grammar, discussions, and texts'),
    ('de', 'de-c1', 'cefr', 'C1', '🇩🇪', 'planned', 5, 'Deutsch C1', 'Komplexe Sprache, Fachtexte und präziser Ausdruck', 'German C1', 'Complex language, specialist texts, and precise expression'),
    ('de', 'de-c2', 'cefr', 'C2', '🇩🇪', 'planned', 6, 'Deutsch C2', 'Nahezu muttersprachliche Sicherheit', 'German C2', 'Near-native confidence')
), upserted as (
  insert into language_cards_tracks (language_id, slug, level_system, level_code, emoji, status, sort_order)
  select language_id, slug, level_system, level_code, emoji, status, sort_order
  from track_seed
  on conflict (language_id, slug) do update set
    level_system = excluded.level_system,
    level_code = excluded.level_code,
    emoji = excluded.emoji,
    status = excluded.status,
    sort_order = excluded.sort_order,
    updated_at = now()
  returning id, language_id, slug
)
insert into language_cards_track_translations (track_id, lang_code, name, description)
select u.id, lang.lang_code,
  case when lang.lang_code = 'de' then s.de_name else s.en_name end,
  case when lang.lang_code = 'de' then s.de_description else s.en_description end
from upserted u
join track_seed s on s.language_id = u.language_id and s.slug = u.slug
cross join (values ('de'), ('en')) as lang(lang_code)
on conflict (track_id, lang_code) do update set
  name = excluded.name,
  description = excluded.description;

-- 4) Move N5 roadmap categories from code-only fallback into the database.
with planned_categories(slug, native_name, emoji, color, card_type, sort_order, de_name, de_description, en_name, en_description) as (
  values
    ('n5-numbers-time', '数と時間', '🔢', '#14b8a6', 'vocabulary', 105, 'Zahlen & Zeit', 'Zahlen, Uhrzeit, Datum, Wochentage und Mengen', 'Numbers & Time', 'Numbers, time, dates, weekdays, and quantities'),
    ('n5-particles', '助詞', '🧩', '#f59e0b', 'grammar', 106, 'Partikel', 'N5-Partikel wie は, が, を, に, で und の', 'Particles', 'N5 particles such as は, が, を, に, で, and の'),
    ('n5-verbs', '動詞', '🏃', '#ef4444', 'grammar', 107, 'Verben', 'Verbgruppen und grundlegende N5-Formen', 'Verbs', 'Verb groups and basic N5 forms'),
    ('n5-adjectives', '形容詞', '🎨', '#ec4899', 'grammar', 108, 'Adjektive', 'い- und な-Adjektive mit einfachen Formen', 'Adjectives', 'い and な adjectives with basic forms'),
    ('n5-grammar', '文法', '🏗️', '#8b5cf6', 'grammar', 109, 'Grammatik', 'Grundlegender Satzbau und wichtige N5-Muster', 'Grammar', 'Basic sentence structure and important N5 patterns'),
    ('n5-kanji', '漢字', '🈶', '#0ea5e9', 'character', 110, 'N5 Kanji', 'Grundlegende Kanji mit Lesungen und Beispielwörtern', 'N5 Kanji', 'Basic kanji with readings and example words'),
    ('n5-phrases', '表現', '💬', '#22c55e', 'phrase', 111, 'Sätze & Dialoge', 'Alltagssätze, Mini-Dialoge und Prüfungsmuster', 'Phrases & Dialogues', 'Everyday phrases, mini dialogues, and test patterns')
), upserted as (
  insert into language_cards_categories (
    id, language_id, slug, native_name, emoji, color, card_type, game_modes, show_all_option,
    sort_order, is_active, status
  )
  select gen_random_uuid(), 'ja', slug, native_name, emoji, color, card_type, array[]::text[], false,
    sort_order, false, 'planned'
  from planned_categories
  on conflict (language_id, slug) do update set
    native_name = excluded.native_name,
    emoji = excluded.emoji,
    color = excluded.color,
    card_type = excluded.card_type,
    game_modes = excluded.game_modes,
    show_all_option = excluded.show_all_option,
    sort_order = excluded.sort_order,
    is_active = false,
    status = 'planned'
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

-- 5) Link JLPT N5 track to active and planned N5 categories in display order.
with n5 as (
  select id from language_cards_tracks where language_id = 'ja' and slug = 'jlpt-n5'
), category_order(slug, sort_order) as (
  values
    ('hiragana', 1),
    ('katakana', 2),
    ('first-words', 3),
    ('n5-vocabulary', 4),
    ('n5-numbers-time', 5),
    ('n5-particles', 6),
    ('n5-verbs', 7),
    ('n5-adjectives', 8),
    ('n5-grammar', 9),
    ('n5-kanji', 10),
    ('n5-phrases', 11)
), matched as (
  select n5.id as track_id, c.id as category_id, co.sort_order
  from n5
  join category_order co on true
  join language_cards_categories c on c.language_id = 'ja' and c.slug = co.slug
)
insert into language_cards_track_categories (track_id, category_id, sort_order)
select track_id, category_id, sort_order
from matched
on conflict (track_id, category_id) do update set
  sort_order = excluded.sort_order;

-- 6) Language-aware helper for progress counts.
create or replace function public.get_language_category_card_counts(p_language_id text default 'ja')
returns table(slug text, total_cards bigint)
language sql
stable
as $function$
  select cat.slug, count(distinct card.id) as total_cards
  from language_cards_categories cat
  join language_cards_practice_groups pg on pg.category_id = cat.id and pg.is_active = true and pg.status = 'active'
  join language_cards_practice_group_cards pgc on pgc.practice_group_id = pg.id
  join language_cards_cards card on card.id = pgc.card_id and card.is_active = true
  where cat.language_id = p_language_id
    and cat.is_active = true
    and cat.status = 'active'
  group by cat.slug;
$function$;

notify pgrst, 'reload schema';

commit;
