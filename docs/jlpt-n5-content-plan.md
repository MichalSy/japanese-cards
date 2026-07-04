# JLPT N5 Content Plan

Ziel: Die Collection `JLPT N5` bleibt der sichtbare Einstiegspfad. Fertige Kategorien sind aktiv und klickbar. Geplante Kategorien werden angezeigt, sind deaktiviert und zeigen `Kommt bald`.

Die weiteren JLPT-Collections `JLPT N4`, `JLPT N3`, `JLPT N2` und `JLPT N1` werden auf der Hauptseite ebenfalls sichtbar gemacht. Sie sind deaktiviert, ausgegraut und dienen als Roadmap-Ausblick.

## Navigationsstruktur

| Sortierung | Slug | Status | Typ | Inhalt |
| ---: | --- | --- | --- | --- |
| 1 | `hiragana` | aktiv | Zeichen | Hiragana-Grundlagen, inklusive Dakuten/Handakuten |
| 2 | `katakana` | aktiv | Zeichen | Katakana-Grundlagen, inklusive Dakuten/Handakuten |
| 3 | `first-words` | aktiv | Vokabeln | Erste einfache Wörter zum Einstieg |
| 4 | `n5-vocabulary` | aktiv | Vokabeln | Kernwortschatz für JLPT N5 |
| 5 | `n5-numbers-time` | geplant, deaktiviert | Vokabeln | Zahlen, Uhrzeit, Datum, Wochentage, Mengen |
| 6 | `n5-particles` | geplant, deaktiviert | Grammatik | は, が, を, に, で, と, も, の, へ, から, まで, よ, ね |
| 7 | `n5-verbs` | geplant, deaktiviert | Grammatik | Verbgruppen, Masu-Form, Te-Form-Basis, Vergangenheit, Verneinung |
| 8 | `n5-adjectives` | geplant, deaktiviert | Grammatik | い-Adjektive, な-Adjektive, Formen und einfache Satzmuster |
| 9 | `n5-grammar` | geplant, deaktiviert | Grammatik | N5-Satzbau, Fragen, Existenz, Wünsche, Erlaubnis, Verbverbindungen |
| 10 | `n5-kanji` | geplant, deaktiviert | Zeichen | N5-Kanji mit Lesungen, Bedeutung und Beispielwörtern |
| 11 | `n5-phrases` | geplant, deaktiviert | Phrasen | Alltagssätze, Mini-Dialoge und Prüfungsmuster |

## Aktueller technischer Stand

- Die Hauptseite zeigt Collection-Karten, nicht eine flache Kategorienliste.
- `jlpt-n5` führt auf `/collections/jlpt-n5` und zeigt die aktive N5-Reihenfolge plus deaktivierte geplante Bereiche.
- `jlpt-n4` bis `jlpt-n1` bleiben sichtbar, aber deaktiviert.
- Kategorien verwenden die produktiven Learning-/Practice-Tabellen:
  - `language_cards_learning_courses`
  - `language_cards_learning_lessons`
  - `language_cards_learning_lesson_cards`
  - `language_cards_practice_groups`
  - `language_cards_practice_group_cards`
  - `language_cards_cards`
- Die Collection-Navigation kann aus einer echten Collection-Migration kommen oder — solange diese Migration nicht aktiv ist — durch `/api/data/categories` aus den vorhandenen Kategorien und Roadmap-Daten zusammengesetzt werden.

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

Wenn weitere N5-Bereiche kommen, zuerst Content-Scope finalisieren, dann Learning Course/Lessons und Practice Groups/Cards anlegen. Erst nach UI-Test und Datenprüfung `is_active = true` setzen.

1. Zahlen & Zeit
2. Partikel
3. Verben
4. Adjektive
5. Grammatik
6. Kanji
7. Sätze & Dialoge
