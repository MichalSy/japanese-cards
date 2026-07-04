# Product Model

Japanese Cards ist als mehrsprachige Lernplattform gedacht, nicht nur als einzelne Japanisch-App.

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

`is_active` bleibt aus Kompatibilitätsgründen bestehen. Fachlich zählt zusätzlich `status`:

| Status | Bedeutung | Sichtbarkeit |
|---|---|---|
| `draft` | intern vorbereitet | nicht produktiv sichtbar |
| `planned` | Roadmap / Kommt bald | sichtbar, aber nicht klickbar |
| `active` | produktiv nutzbar | sichtbar und klickbar |
| `deprecated` | Altbestand, nicht weiter benutzen | nicht produktiv sichtbar |
| `archived` | historisch behalten | nicht produktiv sichtbar |

Wichtig: `is_active = false` heißt nicht automatisch „löschen“. Es kann `planned`, `draft`, `deprecated` oder `archived` bedeuten.

## Produktregel

Aufräumen heißt hier:

1. klassifizieren,
2. Status setzen,
3. Roadmap und Produktstruktur in DB abbilden,
4. Legacy markieren,
5. erst nach Audit und Migration löschen.

Keine Produktstruktur aus dem Code entfernen, nur weil Inhalte noch nicht vollständig befüllt sind.
