-- Ensure the current learning/practice schema exists.
-- Source of truth:
--   Category -> Learning Courses -> Lessons -> Lesson Cards
--   Category -> Practice Groups -> Practice Group Cards

begin;

create table if not exists language_cards_learning_courses (
  id uuid primary key,
  category_id uuid not null references language_cards_categories(id) on delete cascade,
  slug text not null,
  level text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'planned', 'active')),
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
  status text not null default 'draft' check (status in ('draft', 'planned', 'active')),
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
  status text not null default 'draft' check (status in ('draft', 'planned', 'active')),
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

commit;
