# Japanese Cards

Lernspiel für japanische Schriftsysteme, Vokabeln und JLPT-Inhalte.

## Features

- **JLPT-Gruppierung**: Startseite zeigt `JLPT N5` aktiv sowie `JLPT N4` bis `JLPT N1` als Roadmap/„Kommt bald“.
- **Lernen + Üben**: Kategorien haben Learn-Lessons und/oder Practice-Groups mit Spielmodi.
- **Swipe Game**: Zeichen + Romaji-Paarung bewerten (Tinder-Style).
- **Supabase-basierte Lerninhalte**: Kategorien, Learning-Lessons, Practice-Groups, Cards und Fortschritt aus der Datenbank.
- **Mehrsprachig**: Deutsch und Englisch.
- **Responsive**: Mobile (Touch) und Desktop.

## Technologien

- **Framework**: Next.js 14 (App Router)
- **Auth**: `@michalsy/aiko-webapp-core` (Google OAuth via Supabase)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Deployment**: Docker + Kubernetes via GitOps

## Projektstruktur

```text
japanese-cards/
├── src/
│   ├── app/               # Next.js App Router (pages & API routes)
│   │   ├── collections/   # JLPT-/Roadmap-Gruppierung
│   │   ├── content/       # Kategorie- und Gruppenauswahl
│   │   ├── game/          # Spielmodi
│   │   └── page.jsx       # Hauptmenü
│   ├── components/        # Wiederverwendbare UI-Komponenten
│   ├── modes/             # Spielmodi-Implementierungen
│   ├── config/            # API-Client-Konfiguration
│   └── utils/             # Hilfsfunktionen
├── public/                # Statische Assets
└── .aiko/                 # Generierte Auth-Dateien (nicht manuell bearbeiten)
```

## Installation & Start

Voraussetzung: Node.js 20+

```bash
npm install
npm run dev
```

Die App ist lokal unter `http://localhost:3001` erreichbar.

## Build & Deployment

```bash
npm run build    # prebuild generiert Auth-Dateien + next build
```

Das Docker-Image wird via GitHub Actions gebaut und in der K8s-Umgebung deployed.
Domain: `japanese-cards.sytko.de`

## Auth

Auth wird von `@michalsy/aiko-webapp-core` verwaltet. Der `prebuild`-Script generiert die nötigen Auth-Dateien automatisch. Geschützte Routen werden via Next.js Middleware abgesichert (Google OAuth erforderlich).

### Lokaler Dev-Login

Für lokale Browser-Checks kann eine echte Supabase-Session ohne Google-OAuth erzeugt werden. Voraussetzung ist eine `.env.local` mit `SUPABASE_DEV_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

```bash
npm run dev
```

Dann im Browser öffnen:

```text
http://localhost:3001/api/dev-login?token=<SUPABASE_DEV_TOKEN>&redirect=/
```

Erwartet: Der Browser landet auf `http://localhost:3001/` und zeigt die Startseite mit `JLPT N5` sowie den Roadmap-Gruppen `JLPT N4` bis `JLPT N1`. Wenn stattdessen `/login?redirect=%2F` erscheint, Core-Version prüfen: `@michalsy/aiko-webapp-core` muss mindestens `1.1.9` sein.

## Datenbank (Supabase)

Alle produktiven Tabellen nutzen den Prefix `language_cards_`. Neue Tabellen immer mit diesem Prefix anlegen.

| Tabelle | Zweck |
|---|---|
| `language_cards_languages` | UI- und Lernsprachen |
| `language_cards_categories` | Aktive/deaktivierte Inhaltsbereiche wie Hiragana, Katakana, First Words, N5 Vocabulary |
| `language_cards_category_translations` | Kategoriename/-beschreibung pro UI-Sprache |
| `language_cards_learning_courses` | Kuratierte Lernpfade pro Kategorie |
| `language_cards_learning_course_translations` | Kurstitel/-beschreibung pro UI-Sprache |
| `language_cards_learning_lessons` | Lektionen innerhalb eines Learning Course |
| `language_cards_learning_lesson_translations` | Lektionstitel/-beschreibung pro UI-Sprache |
| `language_cards_learning_lesson_cards` | Kartenreihenfolge innerhalb einer Lesson |
| `language_cards_practice_groups` | Übungsgruppen pro Kategorie |
| `language_cards_practice_group_translations` | Practice-Group-Name pro UI-Sprache |
| `language_cards_practice_group_cards` | Kartenreihenfolge innerhalb einer Practice Group |
| `language_cards_cards` | Einzelne Lern-, Info- und Quizkarten |
| `language_cards_card_translations` | Übersetzung + Beispiel pro UI-Sprache für Vokabel-/Phrasenkarten |
| `language_cards_user_settings` | UI-Sprache + Lernsprache pro User |
| `language_cards_user_card_progress` | Fortschritt pro User pro Karte |
| `language_cards_category_snapshots` | Aggregierter Fortschritt pro User/Kategorie |
| `language_cards_user_sessions` | Spielsessions mit Statistiken |

Karten haben generische Felder wie `native` (Zielsprachen-Inhalt), `transliteration`, `card_type` (`character` | `vocabulary` | `phrase` | `grammar` | `quiz_4_option` | `info`) und optionale Medienfelder.

## JLPT-/Collection-Layer

Die JLPT-Gruppierung ist Produktnavigation und Roadmap, nicht gleichbedeutend mit alten Übungsgruppen. Die API `/api/data/categories` liefert deshalb zusätzlich zu `categories` auch `collections`:

- `jlpt-n5` aktiv mit Hiragana, Katakana, Erste Vokabeln, N5 Vokabeln und geplanten deaktivierten N5-Bereichen.
- `jlpt-n4` bis `jlpt-n1` deaktiviert als sichtbare Roadmap.

Wenn eine echte Collection-Migration (`language_cards_category_collections` + `collection_id`) vorhanden ist, kann die API sie nutzen. Solange sie nicht vorhanden ist, wird diese Navigationsstruktur aus den bestehenden Kategorien zusammengesetzt, damit die Produktstruktur live stabil bleibt.
