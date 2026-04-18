# Japanese Cards

Lernspiel für japanische Schriftsysteme (Hiragana, Katakana) und Vokabeln.

## Features

- **Swipe Game**: Zeichen + Romaji-Paarung bewerten (Tinder-Style)
- **JSON-basierte Daten**: Lerninhalte in `public/GameData/`
- **Mehrsprachig**: Deutsch und Englisch
- **Responsive**: Mobile (Touch) und Desktop

## Technologien

- **Framework**: Next.js 14 (App Router)
- **Auth**: `@michalsy/aiko-webapp-core` (Google OAuth via Supabase)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Deployment**: Docker + Kubernetes via GitOps

## Projektstruktur

```
japanese-cards/
├── src/
│   ├── app/               # Next.js App Router (pages & API routes)
│   │   ├── content/       # Kategorie- und Gruppenauswahl
│   │   ├── game/          # Spielmodi
│   │   └── page.jsx       # Hauptmenü
│   ├── components/        # Wiederverwendbare UI-Komponenten
│   ├── context/           # React Context (LanguageContext)
│   ├── modes/             # Spielmodi-Implementierungen (z.B. SwipeGame)
│   ├── config/            # Konfigurationen
│   └── utils/             # Hilfsfunktionen
├── public/
│   └── GameData/          # JSON-Daten für Kategorien und Karten
└── .aiko/                 # Generierte Auth-Dateien (nicht manuell bearbeiten)
```

## Installation & Start

Voraussetzung: Node.js 20+

```bash
npm install
npm run dev
```

Die App ist unter `http://localhost:3001` erreichbar.

## Build & Deployment

```bash
npm run build    # prebuild generiert Auth-Dateien + next build
```

Das Docker-Image wird via GitHub Actions gebaut und in der K8s-Umgebung deployed.
Domain: `japanese-cards.sytko.de`

## Auth

Auth wird von `@michalsy/aiko-webapp-core` verwaltet. Der `prebuild`-Script generiert
die nötigen Auth-Dateien automatisch. Geschützte Routen werden via Next.js Middleware
abgesichert (Google OAuth erforderlich).

## Datenbank (Supabase)

Alle Tabellen nutzen den Prefix `language_cards_`. Neue Tabellen immer mit diesem Prefix anlegen.

| Tabelle | Zweck |
|---|---|
| `language_cards_languages` | Lernbare Sprachen (ja, ko, zh, de...) |
| `language_cards_categories` | Kategorien pro Sprache (Hiragana, Katakana...) |
| `language_cards_category_translations` | Kategoriename/-beschreibung pro UI-Sprache |
| `language_cards_groups` | Gruppen innerhalb einer Kategorie (A-Reihe...) |
| `language_cards_group_translations` | Gruppenname pro UI-Sprache |
| `language_cards_cards` | Einzelne Lernkarten |
| `language_cards_card_translations` | Übersetzung + Beispiel pro UI-Sprache |
| `language_cards_courses` | Kuratierte Lernpfade |
| `language_cards_course_lessons` | Lektionen innerhalb eines Kurses |
| `language_cards_course_lesson_cards` | Karten in einer Lektion (wiederverwendbar) |
| `language_cards_user_settings` | UI-Sprache + Lernsprache pro User |
| `language_cards_user_card_progress` | Fortschritt pro User pro Karte |
| `language_cards_user_sessions` | Spielsessions mit Statistiken |

Karten haben immer generische Felder: `native` (Zielsprachen-Inhalt), `transliteration` (z.B. Romaji für Japanisch, Pinyin für Chinesisch), `card_type` (`character` | `vocabulary` | `phrase` | `grammar`).
