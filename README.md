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
