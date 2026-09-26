# Japanese Cards

Mehrsprachige Lernplattform für Sprachen, Tracks/Level, Lektionen und Übungsspiele.

Aktueller produktiver Fokus: Japanisch mit `JLPT N5`.

## Produktmodell

Zielstruktur:

```text
Learning Language
└── Track / Level
    └── Category
        ├── Lernen → Course → Lessons → Cards
        └── Üben → Practice Groups → Game Modes
```

Beispiele:

- Japanisch → JLPT N5 → Hiragana → Lernen
- Japanisch → JLPT N5 → Hiragana → Üben → Swipe
- Deutsch → A1 → Basisvokabeln → Lernen/Üben

Details:

- `docs/product-model.md` — fachliches Zielmodell und Begriffe
- `docs/current-state.md` — aktueller DB-/App-Stand
- `docs/jlpt-n5-content-plan.md` — konkreter JLPT-N5-Plan
- `docs/kana-course-generation.md` — Content-/Asset-Regeln für Kana-Kurse

## Features

- **Tracks / Level:** `JLPT N5` aktiv, `JLPT N4-N1` als Roadmap, Deutsch `A1-C2` als geplante DB-Tracks.
- **Lernen:** Kurse, Lektionen und Karten aus Supabase.
- **Üben:** Practice Groups und Game Modes. Produktiv aktiv ist aktuell Swipe.
- **Mehrsprachigkeit:** UI-Sprachen Deutsch/Englisch; Lernsprache aktuell Japanisch, Datenmodell für weitere Lernsprachen vorbereitet.
- **Auth:** Google-Anmeldung über den zentralen Authentik-Server und Aiko Core 1.8.3. Supabase speichert weiter Lerninhalte und Fortschritt.

## Technologien

- Next.js 14 App Router
- `@michalsy/aiko-webapp-core`
- Supabase
- Tailwind CSS v3
- Docker + Kubernetes + ArgoCD

## Projektstruktur

```text
src/app/tracks/        # Track-/Level-Seite
src/app/content/       # Kategorie, Lernen/Üben Tabs, Practice Groups
src/app/learn/         # Lesson Player
src/app/game/          # Game Mode Runtime
src/app/api/           # Supabase-backed API Routes
src/modes/             # Learn-/Swipe-Komponenten
supabase/migrations/   # DB-Migrationen
scripts/               # Audit-, Seed- und Wartungsskripte
docs/                  # Produkt-/DB-/Content-Doku
```

## Lokaler Start

```bash
npm install
npm run dev
```

Die App läuft auf `http://localhost:3001`.

## Build

```bash
npm run build
```

Die Anmeldung nutzt den eigenen Authentik-Client `japanese-cards`. Der Callback ist
`https://japanese-cards.sytko.de/auth/callback/authentik`. Lokal benötigt ein
vollständiger Login eine zusätzlich registrierte lokale Callback-Adresse.
API-Routen prüfen die OAuth-Sitzung serverseitig. Die Zuordnung zum bestehenden
Fortschritt verwendet die feste Google-ID; E-Mail-Adressen dienen nicht zur
Kontozusammenführung. Der alte Supabase-Dev-Login ist entfernt.

Erwartung nach Login:

- Startseite zeigt Track-Karten.
- `JLPT N5` ist aktiv/klickbar.
- `JLPT N4-N1` sind sichtbar, aber `Kommt bald`.
- In `JLPT N5` sind aktive Kategorien klickbar und geplante Kategorien deaktiviert.

## DB-Audit

```bash
node scripts/audit-language-cards-db.js docs/db-audit-current.md
```

DDL-Migrationen werden per Supabase Management API ausgeführt:

```bash
node scripts/apply-supabase-sql.js supabase/migrations/<migration>.sql
```

Der Runner liest `SUPABASE_ACCESS_TOKEN` aus der Umgebung oder Infisical und gibt keine Secrets aus.
