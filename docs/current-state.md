# Current State

Stand nach der Track-/Status-Migration.

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

Nicht live vorhanden / nicht mehr produktiv genutzt:

- `language_cards_category_collections`
- `language_cards_category_collection_translations`
- `language_cards_groups`
- `language_cards_group_translations`
- `language_cards_courses`
- `language_cards_course_lessons`
- `language_cards_course_lesson_cards`

## Sprachen

Aktuell in `language_cards_languages`:

| ID | Rolle |
|---|---|
| `ja` | aktive Lernsprache |
| `de` | aktive UI-Sprache; Deutsch-Tracks sind als Roadmap angelegt |
| `en` | aktive UI-Sprache |

`learn_language_id` existiert in User Settings und wird von den Content-APIs verwendet. Default bleibt `ja`.

## Tracks

Japanisch:

| Track | Status |
|---|---|
| `jlpt-n5` | `active` |
| `jlpt-n4` | `planned` |
| `jlpt-n3` | `planned` |
| `jlpt-n2` | `planned` |
| `jlpt-n1` | `planned` |

Deutsch / CEFR Roadmap:

| Track | Status |
|---|---|
| `de-a1` | `planned` |
| `de-a2` | `planned` |
| `de-b1` | `planned` |
| `de-b2` | `planned` |
| `de-c1` | `planned` |
| `de-c2` | `planned` |

Deutsch wird noch nicht als aktive Lernsprache in der UI angeboten, solange keine Kategorien/Lessons vorhanden sind.

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
| `words` | `deprecated` | nein | Legacy |
| `sentences` | `deprecated` | nein | Legacy |

## Lernen

Aktive Learning Courses:

| Course | Lessons |
|---|---:|
| `hiragana-basics` | 19 |
| `katakana-basics` | 15 |
| `first-words-basics` | 7 |
| `n5-vocabulary-basics` | 10 |

## Üben / Spiele

Practice Groups existieren aktuell für:

| Kategorie | Practice Groups |
|---|---:|
| `hiragana` | 6 |
| `katakana` | 6 |
| `words` | 1, aber Kategorie ist `deprecated` |
| `sentences` | 1, aber Kategorie ist `deprecated` |

Game Modes:

| Mode | Status |
|---|---|
| `swipe` | implementiert und aktiv |
| `multiChoice` | vorbereitet, global deaktiviert |
| `flashcard` | vorbereitet, global deaktiviert |
| `typing` | vorbereitet, global deaktiviert |

## Audit Reports

Aktuelle DB-Audits liegen hier:

- `docs/db-audit-before-tracks.md`
- `docs/db-audit-after-tracks.md`
