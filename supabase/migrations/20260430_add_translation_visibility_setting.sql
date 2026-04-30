alter table if exists language_cards_user_settings
  add column if not exists show_translations_by_default boolean not null default true;
