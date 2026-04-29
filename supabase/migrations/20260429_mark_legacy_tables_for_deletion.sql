-- Mark legacy course/group tables for deletion after the learning/practice split.
-- Non-destructive: data is kept, only table names are changed to delete_*.

begin;

-- Progress helpers must use the new practice structure before old tables are renamed.
create or replace function public.get_category_card_counts()
returns table(slug text, total_cards bigint)
language sql
stable
as $function$
  select cat.slug, count(distinct card.id) as total_cards
  from language_cards_categories cat
  join language_cards_practice_groups pg on pg.category_id = cat.id and pg.is_active = true
  join language_cards_practice_group_cards pgc on pgc.practice_group_id = pg.id
  join language_cards_cards card on card.id = pgc.card_id and card.is_active = true
  where cat.is_active = true
  group by cat.slug;
$function$;

create or replace function public.get_progress_overview(p_user_id uuid)
returns table(category_slug text, total bigint, seen bigint, mastered bigint)
language sql
security definer
as $function$
  select
    c.slug,
    count(distinct card.id),
    count(distinct ucp.card_id),
    count(distinct ucp.card_id) filter (where (ucp.correct_count - ucp.incorrect_count) >= 3)
  from language_cards_categories c
  join language_cards_practice_groups pg on pg.category_id = c.id and pg.is_active = true
  join language_cards_practice_group_cards pgc on pgc.practice_group_id = pg.id
  join language_cards_cards card on card.id = pgc.card_id and card.is_active = true
  left join language_cards_user_card_progress ucp
         on ucp.card_id = card.id and ucp.user_id = p_user_id
  where c.language_id = 'ja' and c.is_active = true
  group by c.slug, c.sort_order
  order by c.sort_order;
$function$;

create or replace function public.update_category_snapshot(p_user_id uuid, p_category_id uuid)
returns void
language plpgsql
security definer
as $function$
declare
  v_total    int;
  v_seen     int;
  v_mastered int;
begin
  select
    count(distinct card.id),
    count(distinct ucp.card_id),
    count(distinct ucp.card_id) filter (where (ucp.correct_count - ucp.incorrect_count) >= 3)
  into v_total, v_seen, v_mastered
  from language_cards_practice_groups pg
  join language_cards_practice_group_cards pgc on pgc.practice_group_id = pg.id
  join language_cards_cards card on card.id = pgc.card_id and card.is_active = true
  left join language_cards_user_card_progress ucp
         on ucp.card_id = card.id and ucp.user_id = p_user_id
  where pg.category_id = p_category_id
    and pg.is_active = true;

  insert into language_cards_category_snapshots
    (user_id, category_id, total_cards, seen_cards, mastered_cards, updated_at)
  values (p_user_id, p_category_id, v_total, v_seen, v_mastered, now())
  on conflict (user_id, category_id) do update set
    total_cards    = v_total,
    seen_cards     = v_seen,
    mastered_cards = v_mastered,
    updated_at     = now();
end;
$function$;

-- User sessions should now reference the migrated tables. IDs were copied, so existing rows remain valid.
alter table if exists language_cards_user_sessions drop constraint if exists user_sessions_course_id_fkey;
alter table if exists language_cards_user_sessions drop constraint if exists user_sessions_group_id_fkey;
alter table if exists language_cards_user_sessions
  add constraint user_sessions_course_id_fkey
  foreign key (course_id) references language_cards_learning_courses(id);
alter table if exists language_cards_user_sessions
  add constraint user_sessions_group_id_fkey
  foreign key (group_id) references language_cards_practice_groups(id);

-- Rename legacy tables to make accidental usage obvious while preserving all data.
do $$
begin
  if to_regclass('public.language_cards_course_lesson_cards') is not null
     and to_regclass('public.delete_language_cards_course_lesson_cards') is null then
    alter table public.language_cards_course_lesson_cards rename to delete_language_cards_course_lesson_cards;
  end if;

  if to_regclass('public.language_cards_course_lesson_translations') is not null
     and to_regclass('public.delete_language_cards_course_lesson_translations') is null then
    alter table public.language_cards_course_lesson_translations rename to delete_language_cards_course_lesson_translations;
  end if;

  if to_regclass('public.language_cards_group_translations') is not null
     and to_regclass('public.delete_language_cards_group_translations') is null then
    alter table public.language_cards_group_translations rename to delete_language_cards_group_translations;
  end if;

  if to_regclass('public.language_cards_groups') is not null
     and to_regclass('public.delete_language_cards_groups') is null then
    alter table public.language_cards_groups rename to delete_language_cards_groups;
  end if;

  if to_regclass('public.language_cards_course_lessons') is not null
     and to_regclass('public.delete_language_cards_course_lessons') is null then
    alter table public.language_cards_course_lessons rename to delete_language_cards_course_lessons;
  end if;

  if to_regclass('public.language_cards_courses') is not null
     and to_regclass('public.delete_language_cards_courses') is null then
    alter table public.language_cards_courses rename to delete_language_cards_courses;
  end if;
end $$;

commit;
