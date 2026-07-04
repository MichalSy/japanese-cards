# Product Model

Japanese Cards ist als mehrsprachige Lernplattform gedacht, nicht als Sammlung historischer Einzelstrukturen.

## Zielbild

```text
User
└── Settings
    ├── UI Language: de/en/...
    └── Learning Language: ja/de/...

Learning Language
└── Track / Level
    ├── Japanisch: JLPT N5, N4, N3, N2, N1
    ├── Deutsch: A1, A2, B1, B2, C1, C2
    └── Custom tracks
        └── Category
            ├── Lernen
            │   └── Course
            │       └── Lessons
            │           └── Cards
            └── Üben
                └── Practice Groups
                    └── Game Modes
```

## Begriffe

| Begriff | Bedeutung | Beispiele |
|---|---|---|
| Learning Language | Sprache, die gelernt wird | Japanisch (`ja`), Deutsch (`de`) |
| UI Language | Sprache der App-Oberfläche | Deutsch (`de`), Englisch (`en`) |
| Track / Level | Oberste Produkt-/Lernstufe pro Lernsprache | `jlpt-n5`, `jlpt-n4`, `de-a1`, `de-a2` |
| Category | Inhaltsbereich innerhalb eines Tracks | Hiragana, Katakana, N5 Vokabeln, Grammatik |
| Course | Geordneter Lernpfad in einer Kategorie | `hiragana-basics`, `n5-vocabulary-basics` |
| Lesson | konkrete Lerneinheit | A-Reihe, Familie & Menschen |
| Practice Group | Kartenset für Übung/Spiele | Basic 1, Dakuten 1, Alle kombiniert |
| Game Mode | Spielmechanik für Practice Cards | Swipe, Multiple Choice, Flashcard, Typing |

## Beispiele

```text
Japanisch → JLPT N5 → Hiragana → Lernen → Hiragana Basics → A-Reihe
Japanisch → JLPT N5 → Hiragana → Üben → Basic 1 → Swipe
Japanisch → JLPT N5 → N5 Vokabeln → Lernen → Familie & Menschen
Deutsch → Deutsch A1 → Basisvokabeln → Lernen
Deutsch → Deutsch A1 → Artikel → Üben → Multiple Choice
```

## Statusmodell

`is_active` bleibt für bestehende UI-/API-Kompatibilität bestehen. Fachlich zählt zusätzlich `status`:

| Status | Bedeutung | Sichtbarkeit |
|---|---|---|
| `draft` | intern vorbereitet | nicht produktiv sichtbar |
| `planned` | Roadmap / Kommt bald | sichtbar, aber nicht klickbar |
| `active` | produktiv nutzbar | sichtbar und klickbar |

Wichtig: `is_active = false` heißt nicht automatisch „löschen“. Es kann ein geplanter Roadmap-Eintrag sein. Inhalte, die nicht mehr zum Produktmodell gehören, werden entfernt.

## Produktregel

Aufräumen heißt hier:

1. Zielmodell klären,
2. aktive und geplante Produktstruktur in der DB abbilden,
3. nicht mehr gültige Inhalte entfernen,
4. Doku, Code, API und DB mit denselben Begriffen halten.

Keine Produktstruktur aus dem Code entfernen, nur weil Inhalte noch nicht vollständig befüllt sind. Geplante Tracks/Kategorien bleiben `planned`; alter Bestand bleibt nicht im Projekt liegen.
