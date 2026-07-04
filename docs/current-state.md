# Current State

Stand nach der Aktivierung von Deutsch als Lernsprache und dem ersten Deutsch-A1-Seed.

## Live-Datenmodell

Produktiv genutzt werden diese Tabellen:

| Bereich | Tabellen |
|---|---|
| Sprachen & Settings | `language_cards_languages`, `language_cards_user_settings` |
| Tracks / Level | `language_cards_tracks`, `language_cards_track_translations`, `language_cards_track_categories` |
| Kategorien | `language_cards_categories`, `language_cards_category_translations` |
| Lernen | `language_cards_learning_courses`, `language_cards_learning_course_translations`, `language_cards_learning_lessons`, `language_cards_learning_lesson_translations`, `language_cards_learning_lesson_cards` |
| Üben | `language_cards_practice_groups`, `language_cards_practice_group_translations`, `language_cards_practice_group_cards` |
| Cards | `language_cards_cards`, `language_cards_card_translations` |
| Fortschritt | `language_cards_user_card_progress`, `language_cards_category_snapshots`, `language_cards_user_sessions` |

## Sprachen

Aktuell in `language_cards_languages`:

| ID | Rolle |
|---|---|
| `ja` | aktive Lernsprache |
| `de` | aktive UI-Sprache und aktive Lernsprache |
| `en` | aktive UI-Sprache |

`learn_language_id` existiert in User Settings und wird von den Content-APIs verwendet. Default für neue Settings bleibt `ja`.

## Tracks

Japanisch:

| Track | Status |
|---|---|
| `jlpt-n5` | `active` |
| `jlpt-n4` | `planned` |
| `jlpt-n3` | `planned` |
| `jlpt-n2` | `planned` |
| `jlpt-n1` | `planned` |

Deutsch / CEFR:

| Track | Status |
|---|---|
| `de-a1` | `active` |
| `de-a2` | `planned` |
| `de-b1` | `planned` |
| `de-b2` | `planned` |
| `de-c1` | `planned` |
| `de-c2` | `planned` |

## Kategorien

Japanisch:

| Kategorie | Status | Aktiv | Rolle |
|---|---|---:|---|
| `hiragana` | `active` | ja | Lernen + Üben |
| `katakana` | `active` | ja | Lernen + Üben |
| `first-words` | `active` | ja | Lernen |
| `n5-vocabulary` | `active` | ja | Lernen |
| `n5-numbers-time` | `planned` | nein | Roadmap |
| `n5-particles` | `planned` | nein | Roadmap |
| `n5-verbs` | `planned` | nein | Roadmap |
| `n5-adjectives` | `planned` | nein | Roadmap |
| `n5-grammar` | `planned` | nein | Roadmap |
| `n5-kanji` | `planned` | nein | Roadmap |
| `n5-phrases` | `planned` | nein | Roadmap |

Deutsch A1:

| Kategorie | Status | Aktiv | Rolle |
|---|---|---:|---|
| `de-a1-start` | `active` | ja | Begrüßen, Höflichkeit, Mini-Sätze |
| `de-a1-people` | `active` | ja | Pronomen, sein/haben, Familie |
| `de-a1-numbers-time` | `active` | ja | Zahlen, Zeitwörter, Wochentage |
| `de-a1-home-city` | `planned` | nein | Zuhause, Stadt, Wege |
| `de-a1-food-shopping` | `planned` | nein | Essen, Preise, Einkaufen |
| `de-a1-daily-life` | `planned` | nein | Alltag, Routinen, Termine |
| `de-a1-grammar` | `planned` | nein | Artikel, Fragen, Negation, Fälle |
| `de-a1-dialogues` | `planned` | nein | kurze Alltagssituationen |

Details zur deutschen A1-Struktur stehen in `docs/de-a1-curriculum.md`.

## Lernen

Aktive Learning Courses:

| Course | Lessons |
|---|---:|
| `hiragana-basics` | 19 |
| `katakana-basics` | 15 |
| `first-words-basics` | 7 |
| `n5-vocabulary-basics` | 10 |
| `de-a1-start-basics` | 3 |
| `de-a1-people-basics` | 3 |
| `de-a1-numbers-time-basics` | 3 |

Deutsch A1 enthält aktuell 50 Zielkarten, 50 Quizkarten und 3 Infokarten. Die erste Begrüßungs-Lesson (`de-a1-start-greetings`) hat 4 generierte Kartenbilder; die übrigen Deutsch-A1-Zielkarten sind noch ohne Bilder und Sounds.

## Üben / Spiele

Practice Groups existieren aktuell für:

| Kategorie | Practice Groups |
|---|---:|
| `hiragana` | 6 |
| `katakana` | 6 |
| `de-a1-start` | 3 |
| `de-a1-people` | 3 |
| `de-a1-numbers-time` | 3 |

Game Modes:

| Mode | Status |
|---|---|
| `swipe` | implementiert und aktiv |
| `multiChoice` | vorbereitet, global deaktiviert |
| `flashcard` | vorbereitet, global deaktiviert |
| `typing` | vorbereitet, global deaktiviert |

## Audit Report

Der aktuelle DB-Audit liegt hier:

- `docs/db-audit-current.md`
