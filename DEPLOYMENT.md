# Deployment

## Übersicht

Japanese Cards läuft als Docker-Container in Kubernetes, deployed via ArgoCD (GitOps).

- **Domain**: `japanese-cards.sytko.de`
- **Image**: `ghcr.io/michalsy/japanese-cards.aikoapp`
- **Port**: 3001

## Build

### Lokal

```bash
npm install
npm run build    # führt prebuild + next build aus
npm run start    # Production-Server
```

### Docker

Der Docker-Build ist ein vollständiger Multi-Stage-Build. Er installiert Dependencies im Build-Container per `npm ci`, baut Next.js mit `output: 'standalone'` und kopiert in das Runtime-Image nur `.next/standalone`, `.next/static`, `public/` und `aikoapp.json`. Das komplette lokale `node_modules/` wird nicht mehr in das Runtime-Image kopiert.

Für das private Paket `@michalsy/aiko-webapp-core` wird ein BuildKit-Secret benötigt:

```bash
TOKEN_FILE=$(mktemp)
awk -F= '/_authToken/ { print $2 }' .npmrc > "$TOKEN_FILE"

DOCKER_BUILDKIT=1 docker build \
  --secret id=npm_token,src="$TOKEN_FILE" \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  --build-arg NEXT_PUBLIC_ASSETS_URL="https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/render/image/public/language-cards" \
  -t japanese-cards .

rm -f "$TOKEN_FILE"
docker run --env-file .env.local -p 3001:3001 japanese-cards
```

## CI/CD

GitHub Actions (`.github/workflows/docker.yml`) baut das Image bei jedem Push auf `main`
und pusht es nach `ghcr.io`. ArgoCD erkennt das neue Image und deployed automatisch.

## prebuild

Der `prebuild`-Script generiert Auth-Dateien via `@michalsy/aiko-webapp-core generate`
und kopiert sie nach `src/`. Diese Dateien nicht manuell bearbeiten — werden bei jedem
Build überschrieben.

## Umgebungsvariablen

Werden via Kubernetes Secrets injiziert (konfiguriert in `gitops-config/apps/japanese-cards/`):

| Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable/Anon Key |
| `NEXT_PUBLIC_ASSETS_URL` | Supabase Storage Render-URL für Kartenbilder |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `SUPABASE_DEV_TOKEN` | Interner Dev-Login-Token für Smoke-/Browser-Checks |

## Health Check

`GET /api/health` — liefert `200 OK` wenn der Server läuft.

## Deployment Checklist

- [ ] `npm run build` läuft ohne Errors
- [ ] `GET /api/health` antwortet
- [ ] Login via Google OAuth funktioniert
- [ ] Spielmodi laden korrekt
