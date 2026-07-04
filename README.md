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
- **Auth:** Google OAuth via Supabase/Aiko Webapp Core; lokaler Dev-Login für Smoke-/Browser-Checks.

## Technologien

- Next.js 14 App Router
- `@michalsy/aiko-webapp-core`
- Supabase
- Tailwind CSS v3
- Docker + Kubernetes + ArgoCD

## Projektstruktur

```text
src/app/collections/   # Track-/Level-Seite, UI heißt historisch noch collection
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

`prebuild` generiert Aiko-Webapp-Core-Dateien und kopiert sie nach `src/`.

## Dev-Login

Für lokale und interne Smoke-Checks kann `/api/dev-login` genutzt werden. Token nie ausgeben oder in Screenshots/Logs sichtbar machen.

```text
http://localhost:3001/api/dev-login?token=<SUPABASE_DEV_TOKEN>&redirect=/
```

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

Der Runner liest `SUPABASE_ACCESS_TOKEN` aus der Umgebung oder aus `~/secrets.json` und gibt keine Secrets aus.
