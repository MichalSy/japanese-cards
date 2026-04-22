# japanese-cards

## Lokaler Dev-Start

### Voraussetzung: GitHub Token

Das Paket `@michalsy/aiko-webapp-core` liegt auf GitHub Packages. Fur npm-Zugriff wird ein GitHub PAT benotigt.

1. Token in `C:\Projects\aiko\secrets.json` eintragen:
```json
{
  "kie.ai": { "token": "..." },
  "github": { "token": "ghp_..." }
}
```
Der Token braucht den Scope `read:packages`.

2. `.npmrc` generieren (einmalig oder nach Token-Wechsel):
```bash
node scripts/setup-npmrc.js
```

### Dev-Server starten

```bash
cd C:\Projects\aiko\japanese-cards
npm install
npm run dev
```

App lauft dann auf http://localhost:3000

### Dev-Login (ohne echten Account)

URL direkt aufrufen - kein Login notwendig:

```
http://localhost:3000/api/dev-login?token=aiko-jpcard-dev-2026&redirect=/content/hiragana
```

Der Token `aiko-jpcard-dev-2026` ist in `.env.local` als `SUPABASE_DEV_TOKEN` hinterlegt.

### Umgebungsvariablen

Alle notwendigen Werte sind in `.env.local` gesetzt - nichts weiter konfigurieren.

### Chrome mit DevTools starten (fur Browser-Debugging)

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir=C:\tmp\chrome-debug
```
