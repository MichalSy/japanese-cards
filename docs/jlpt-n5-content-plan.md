# JLPT N5 Content Plan

Ziel: Die Collection `JLPT N5` soll den kompletten Einstiegspfad sichtbar machen. Fertige Kategorien bleiben aktiv und klickbar. Geplante Kategorien werden bereits angezeigt, sind aber deaktiviert und haben noch keine Lessons oder Practice Groups.

## Reihenfolge in der Collection

| Sortierung | Slug | Status | Typ | Inhalt |
| ---: | --- | --- | --- | --- |
| 1 | `hiragana` | aktiv | Zeichen | Hiragana-Grundlagen, inklusive Dakuten/Handakuten |
| 2 | `katakana` | aktiv | Zeichen | Katakana-Grundlagen, inklusive Dakuten/Handakuten |
| 3 | `first-words` | aktiv | Vokabeln | Erste einfache Wörter zum Einstieg |
| 4 | `n5-vocabulary` | geplant, deaktiviert | Vokabeln | Kernwortschatz für JLPT N5 |
| 5 | `n5-numbers-time` | geplant, deaktiviert | Vokabeln | Zahlen, Uhrzeit, Datum, Wochentage, Mengen |
| 6 | `n5-particles` | geplant, deaktiviert | Grammatik | は, が, を, に, で, と, も, の, へ, から, まで, よ, ね |
| 7 | `n5-verbs` | geplant, deaktiviert | Grammatik | Verbgruppen, Masu-Form, Te-Form-Basis, Vergangenheit, Verneinung |
| 8 | `n5-adjectives` | geplant, deaktiviert | Grammatik | い-Adjektive, な-Adjektive, Formen und einfache Satzmuster |
| 9 | `n5-grammar` | geplant, deaktiviert | Grammatik | N5-Satzbau, Fragen, Existenz, Wünsche, Erlaubnis, Verbverbindungen |
| 10 | `n5-kanji` | geplant, deaktiviert | Zeichen | N5-Kanji mit Lesungen, Bedeutung und Beispielwörtern |
| 11 | `n5-phrases` | geplant, deaktiviert | Phrasen | Alltagssätze, Mini-Dialoge, Prüfungsmuster |

## Umsetzungshinweise

- Geplante Kategorien sind in der Datenbank mit `is_active = false` angelegt.
- Sie gehören trotzdem zur Collection `jlpt-n5` über `collection_id` und `collection_sort_order`.
- Die Collection-Seite zeigt deaktivierte Kategorien ausgegraut mit Hinweis `Kommt bald`.
- Deaktivierte Kategorien sind nicht klickbar und haben bewusst noch keine Learning Courses, Lessons, Practice Groups oder Cards.
- Sobald eine Kategorie befüllt ist, wird sie über `is_active = true` freigeschaltet.

## Empfohlene Befüllungsstrategie

1. Pro Kategorie zuerst Content-Scope finalisieren: Lernziele, Card-Typen, Reihenfolge.
2. Dann Learning Course + Lessons anlegen.
3. Danach Practice Groups und Cards ergänzen.
4. Erst nach UI-Test und Datenprüfung `is_active = true` setzen.

## Grobe Content-Aufteilung

### `n5-vocabulary`

- Menschen und Familie
- Orte und Gebäude
- Essen und Trinken
- Alltag und Haushalt
- Schule und Arbeit
- Natur und Wetter
- Richtungen und Positionen
- Häufige Nomen, Adverbien und Fragewörter

### `n5-numbers-time`

- Zahlen 0-10.000
- Uhrzeit und Dauer
- Tage, Wochen, Monate, Jahre
- Alter, Preise, Mengen
- einfache Zähler, soweit N5-relevant

### `n5-particles`

- Grundfunktion pro Partikel
- Kontrastpaare wie `は` vs. `が`, `に` vs. `で`
- Beispielkarten mit kurzen Sätzen
- Übung über Lückensätze

### `n5-verbs`

- Godan, Ichidan, unregelmäßige Verben
- ます / ません / ました / ませんでした
- Wörterbuchform als Erkennung
- einfache Te-Form-Muster für N5

### `n5-adjectives`

- い-Adjektive und な-Adjektive
- Präsens, Vergangenheit, Verneinung
- direkte Nomenmodifikation
- einfache Vergleichs- und Beschreibungssätze

### `n5-grammar`

- `です` / `だ`
- Fragen mit `か`
- Existenz mit `ある` / `いる`
- `たい`, `てください`, `てもいい`, `てはいけない`
- `から`, `ので`, einfache Satzverbindungen

### `n5-kanji`

- Zahlenkanji
- Zeitkanji
- Menschen, Orte, Basisverben
- Lesungen nur in sinnvollen Beispielwörtern, nicht isoliert überladen

### `n5-phrases`

- Begrüßungen und Höflichkeit
- Einkaufen und Restaurant
- Orientierung
- Schule/Arbeit/Alltag
- kurze Dialoge als Abschlussübungen
