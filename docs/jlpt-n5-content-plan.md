# JLPT N5 Content Plan

Diese Datei beschreibt nur den konkreten Japanisch-Track `JLPT N5`. Das allgemeine Produktmodell steht in `docs/product-model.md`; der aktuelle DB-Zustand steht in `docs/current-state.md`.

## Track

| Feld | Wert |
|---|---|
| Lernsprache | `ja` |
| Track | `jlpt-n5` |
| Level-System | `jlpt` |
| Level-Code | `N5` |
| Status | `active` |

## Track-Kategorien

| Sortierung | Slug | Status | Aktiv | Typ | Inhalt |
|---:|---|---|---:|---|---|
| 1 | `hiragana` | `active` | ja | Zeichen | Hiragana-Grundlagen, inklusive Dakuten/Handakuten |
| 2 | `katakana` | `active` | ja | Zeichen | Katakana-Grundlagen, inklusive Dakuten/Handakuten |
| 3 | `first-words` | `active` | ja | Vokabeln | Erste einfache Wörter zum Einstieg |
| 4 | `n5-vocabulary` | `active` | ja | Vokabeln | Kernwortschatz für JLPT N5 |
| 5 | `n5-numbers-time` | `planned` | nein | Vokabeln | Zahlen, Uhrzeit, Datum, Wochentage, Mengen |
| 6 | `n5-particles` | `planned` | nein | Grammatik | は, が, を, に, で, と, も, の, へ, から, まで, よ, ね |
| 7 | `n5-verbs` | `planned` | nein | Grammatik | Verbgruppen, Masu-Form, Te-Form-Basis, Vergangenheit, Verneinung |
| 8 | `n5-adjectives` | `planned` | nein | Grammatik | い-Adjektive, な-Adjektive, Formen und einfache Satzmuster |
| 9 | `n5-grammar` | `planned` | nein | Grammatik | N5-Satzbau, Fragen, Existenz, Wünsche, Erlaubnis, Verbverbindungen |
| 10 | `n5-kanji` | `planned` | nein | Zeichen | N5-Kanji mit Lesungen, Bedeutung und Beispielwörtern |
| 11 | `n5-phrases` | `planned` | nein | Phrasen | Alltagssätze, Mini-Dialoge und Prüfungsmuster |

Geplante Kategorien sind echte DB-Kategorien mit `status = planned` und `is_active = false`. Sie werden als Roadmap angezeigt, sind aber nicht klickbar.

## `n5-vocabulary`

Aktuell angelegt als Course `n5-vocabulary-basics`.

| # | Lesson | Stand |
|---:|---|---|
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

## Freischaltregel

Eine geplante N5-Kategorie wird erst aktiv gesetzt, wenn erfüllt ist:

1. Content-Scope finalisiert.
2. Learning Course und Lessons angelegt.
3. Practice Groups/Cards angelegt, falls Üben für die Kategorie vorgesehen ist.
4. UI lokal geprüft.
5. DB-Audit ohne relevante Orphans.
6. `status = active` und `is_active = true` gesetzt.

Keine Kategorie wird gelöscht, nur weil sie noch nicht vollständig befüllt ist.
