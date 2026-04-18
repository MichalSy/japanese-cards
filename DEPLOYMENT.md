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

```bash
docker build -t japanese-cards .
docker run -p 3001:3001 japanese-cards
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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |

## Health Check

`GET /api/health` — liefert `200 OK` wenn der Server läuft.

## Deployment Checklist

- [ ] `npm run build` läuft ohne Errors
- [ ] `GET /api/health` antwortet
- [ ] Login via Google OAuth funktioniert
- [ ] Spielmodi laden korrekt
