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
npm run build
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
  --build-arg NEXT_PUBLIC_ASSETS_URL="https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/render/image/public/language-cards" \
  -t japanese-cards .

rm "$TOKEN_FILE"
docker run --env-file .env.local -p 3001:3001 japanese-cards
```

## CI/CD

GitHub Actions (`.github/workflows/docker.yml`) baut das Image bei jedem Push auf
`main`, pusht es nach `ghcr.io` und aktualisiert die Image-Version in GitOps.
Argo CD synchronisiert anschließend die App.

Die Datenbankmigration `20260926_oidc_identities.sql` wird vor dem App-Rollout
angewendet. `20260926_disable_supabase_auth.sql` folgt nach erfolgreicher
Funktionsprüfung, damit der bisherige Login während des Rollouts nutzbar bleibt.

## Umgebungsvariablen

Werden via Kubernetes Secrets injiziert (konfiguriert in `gitops-config/apps/japanese-cards/`):

| Variable | Beschreibung |
|---|---|
| `AUTHENTIK_ISSUER` | Exakter Issuer des Japanese-Cards-Clients |
| `AUTHENTIK_CLIENT_ID` | OAuth-Client-ID |
| `AUTHENTIK_CLIENT_SECRET` | OAuth-Client-Secret aus Infisical |
| `NEXTAUTH_URL` | App-URL mit `/auth` |
| `NEXTAUTH_SECRET` | Sitzungsschlüssel aus Infisical |
| `SUPABASE_URL` | Supabase-Projekt-URL für den Server |
| `NEXT_PUBLIC_ASSETS_URL` | Supabase Storage Render-URL für Kartenbilder |
| `SUPABASE_SERVICE_ROLE_KEY` | Serverseitiger Datenzugang aus Infisical |

## Health Check

`GET /api/health` — liefert `200 OK` wenn der Server läuft.

## Deployment Checklist

- [ ] `npm run build` läuft ohne Errors
- [ ] `GET /api/health` antwortet
- [ ] Login über Authentik funktioniert und vorhandener Fortschritt erscheint
- [ ] Spielmodi laden korrekt
