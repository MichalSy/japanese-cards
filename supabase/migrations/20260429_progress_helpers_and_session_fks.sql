-- Current progress helpers and session foreign keys.

begin;

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
    and pg.is_active = true
    and pg.status = 'active';

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

alter table if exists language_cards_user_sessions drop constraint if exists user_sessions_course_id_fkey;
alter table if exists language_cards_user_sessions drop constraint if exists user_sessions_group_id_fkey;

alter table if exists language_cards_user_sessions
  add constraint user_sessions_course_id_fkey
  foreign key (course_id) references language_cards_learning_courses(id);

alter table if exists language_cards_user_sessions
  add constraint user_sessions_group_id_fkey
  foreign key (group_id) references language_cards_practice_groups(id);

commit;
