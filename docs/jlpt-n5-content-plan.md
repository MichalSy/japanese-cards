# JLPT N5 Content Stand

Die App nutzt aktuell keine eigene Collection-Schicht. Die Hauptnavigation kommt direkt aus `language_cards_categories` und zeigt nur aktive Kategorien. Die produktive N5-Struktur ist deshalb eine normale Kategorie (`n5-vocabulary`) mit einem Learning Course und aktiven Lessons.

## Aktive Kategorien

| Sortierung | Slug | Status | Typ | Inhalt |
| ---: | --- | --- | --- | --- |
| 1 | `hiragana` | aktiv | Zeichen | Hiragana-Grundlagen, inklusive Dakuten/Handakuten |
| 2 | `katakana` | aktiv | Zeichen | Katakana-Grundlagen, inklusive Dakuten/Handakuten |
| 5 | `first-words` | aktiv | Vokabeln | Erste einfache Wörter zum Einstieg |
| 104 | `n5-vocabulary` | aktiv | Vokabeln | Kernwortschatz für JLPT N5 |

Deaktivierte Legacy-Kategorien `words` und `sentences` bleiben in der DB, werden aber nicht in der Hauptnavigation angezeigt.

## Nicht aktive / nicht live verwendete Struktur

Nicht Teil des aktuellen Live-Schemas:

- `language_cards_category_collections`
- `language_cards_category_collection_translations`
- `language_cards_categories.collection_id`
- `language_cards_categories.collection_sort_order`
- alte Legacy-Tabellen `language_cards_courses`, `language_cards_course_lessons`, `language_cards_course_lesson_cards`, `language_cards_groups`

Neue Inhalte werden über die produktiven Tabellen gepflegt:

- `language_cards_categories`
- `language_cards_learning_courses`
- `language_cards_learning_lessons`
- `language_cards_learning_lesson_cards`
- `language_cards_practice_groups`
- `language_cards_practice_group_cards`
- `language_cards_cards`
- jeweilige Translation-Tabellen

## `n5-vocabulary`

Aktuell angelegt als Course `n5-vocabulary-basics`.

| # | Lesson | Stand |
| ---: | --- | --- |
| 1 | `n5-vocab-family-people` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 2 | `n5-vocab-home-places` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 3 | `n5-vocab-daily-objects` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 4 | `n5-vocab-food-drink` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 5 | `n5-vocab-basic-verbs-1` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 6 | `n5-vocab-basic-verbs-2` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 7 | `n5-vocab-adjectives-1` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 8 | `n5-vocab-adjectives-2` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 9 | `n5-vocab-school-work` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |
| 10 | `n5-vocab-nature-weather` | aktiv, 10 Vokabelkarten + 10 Quizkarten, Bilder + Audio vollständig |

## Nächste Inhaltsbereiche

Wenn weitere N5-Bereiche kommen, zuerst als normale `language_cards_categories` anlegen und nur nach befüllten/validierten Learning-/Practice-Daten aktivieren:

1. Zahlen & Zeit
2. Partikel
3. Verben
4. Adjektive
5. Grammatik
6. Kanji
7. Sätze & Dialoge

Keine UI-Platzhalter oder synthetischen Kategorien im Code anlegen; die DB bleibt Quelle der Wahrheit.
