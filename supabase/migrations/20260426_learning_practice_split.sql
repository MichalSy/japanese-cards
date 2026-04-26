-- Split the learning structure from the practice structure.
-- This migration is intentionally non-destructive:
-- old language_cards_courses / language_cards_groups tables stay in place
-- until the app has been verified against the new names.

begin;

create table if not exists language_cards_learning_courses (
  id uuid primary key,
  category_id uuid not null references language_cards_categories(id) on delete cascade,
  slug text not null,
  level text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(category_id, slug)
);

create table if not exists language_cards_learning_course_translations (
  course_id uuid not null references language_cards_learning_courses(id) on delete cascade,
  lang_code text not null,
  title text not null,
  description text,
  primary key(course_id, lang_code)
);

create table if not exists language_cards_learning_lessons (
  id uuid primary key,
  course_id uuid not null references language_cards_learning_courses(id) on delete cascade,
  slug text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique(course_id, slug)
);

create table if not exists language_cards_learning_lesson_translations (
  lesson_id uuid not null references language_cards_learning_lessons(id) on delete cascade,
  lang_code text not null,
  title text not null,
  description text,
  primary key(lesson_id, lang_code)
);

create table if not exists language_cards_learning_lesson_cards (
  lesson_id uuid not null references language_cards_learning_lessons(id) on delete cascade,
  card_id uuid not null references language_cards_cards(id) on delete cascade,
  sort_order int not null default 0,
  primary key(lesson_id, card_id)
);

create table if not exists language_cards_practice_groups (
  id uuid primary key,
  category_id uuid not null references language_cards_categories(id) on delete cascade,
  slug text not null,
  sort_order int not null default 0,
  game_modes text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(category_id, slug)
);

create table if not exists language_cards_practice_group_translations (
  practice_group_id uuid not null references language_cards_practice_groups(id) on delete cascade,
  lang_code text not null,
  name text not null,
  primary key(practice_group_id, lang_code)
);

create table if not exists language_cards_practice_group_cards (
  practice_group_id uuid not null references language_cards_practice_groups(id) on delete cascade,
  card_id uuid not null references language_cards_cards(id) on delete cascade,
  sort_order int not null default 0,
  primary key(practice_group_id, card_id)
);

insert into language_cards_learning_courses (
  id, category_id, slug, level, sort_order, is_active, created_at
)
select
  c.id,
  coalesce(cat_by_slug.id, cat_first.id) as category_id,
  c.slug,
  c.level,
  c.sort_order,
  c.is_active,
  c.created_at
from language_cards_courses c
left join language_cards_categories cat_by_slug
  on cat_by_slug.language_id = c.language_id
 and cat_by_slug.slug = split_part(c.slug, '-', 1)
left join lateral (
  select id
  from language_cards_categories cat
  where cat.language_id = c.language_id
  order by cat.sort_order
  limit 1
) cat_first on true
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  level = excluded.level,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into language_cards_learning_course_translations (
  course_id, lang_code, title, description
)
select
  lc.id,
  lang.lang_code,
  case
    when lc.slug = 'hiragana-basics' and lang.lang_code = 'de' then 'Hiragana Grundlagen'
    when lc.slug = 'hiragana-basics' and lang.lang_code = 'en' then 'Hiragana Basics'
    else initcap(replace(lc.slug, '-', ' '))
  end as title,
  null as description
from language_cards_learning_courses lc
cross join (values ('de'), ('en')) as lang(lang_code)
on conflict (course_id, lang_code) do update set
  title = excluded.title,
  description = excluded.description;

insert into language_cards_learning_lessons (
  id, course_id, slug, sort_order, is_active
)
select id, course_id, slug, sort_order, is_active
from language_cards_course_lessons
on conflict (id) do update set
  course_id = excluded.course_id,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into language_cards_learning_lesson_translations (
  lesson_id, lang_code, title, description
)
select lesson_id, lang_code, title, description
from language_cards_course_lesson_translations
on conflict (lesson_id, lang_code) do update set
  title = excluded.title,
  description = excluded.description;

insert into language_cards_learning_lesson_cards (
  lesson_id, card_id, sort_order
)
select lesson_id, card_id, sort_order
from language_cards_course_lesson_cards
on conflict (lesson_id, card_id) do update set
  sort_order = excluded.sort_order;

insert into language_cards_practice_groups (
  id, category_id, slug, sort_order, game_modes, is_active, created_at
)
select id, category_id, slug, sort_order, game_modes, is_active, created_at
from language_cards_groups
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  game_modes = excluded.game_modes,
  is_active = excluded.is_active;

insert into language_cards_practice_group_translations (
  practice_group_id, lang_code, name
)
select group_id, lang_code, name
from language_cards_group_translations
on conflict (practice_group_id, lang_code) do update set
  name = excluded.name;

insert into language_cards_practice_group_cards (
  practice_group_id, card_id, sort_order
)
select group_id, id, sort_order
from language_cards_cards
where group_id is not null
  and card_type in ('character', 'vocabulary', 'phrase', 'grammar')
on conflict (practice_group_id, card_id) do update set
  sort_order = excluded.sort_order;

commit;
