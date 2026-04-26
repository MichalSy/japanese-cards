# japanese-cards

## Lokaler Dev-Start

### Voraussetzung: GitHub Token (einmalig)

Das Paket `@michalsy/aiko-webapp-core` liegt auf GitHub Packages. Ohne Token schlagt `npm install` fehl.

1. Token in `C:\Projects\aiko\secrets.json` eintragen:
```json
{
  "kie.ai": { "token": "..." },
  "github": { "token": "ghp_..." }
}
```
Der Token braucht den Scope `read:packages`.

2. `.npmrc` generieren:
```bash
node scripts/setup-npmrc.js
```

### Dev-Server starten

```bash
cd C:\Projects\aiko\japanese-cards
npm install
npm run dev
```

App lauft auf **http://localhost:3001** (nicht 3000 - der Port ist in `server.js` fest auf 3001 gesetzt).

`npm run dev` fuhrt automatisch `npm run generate` aus - das generiert Auth-Dateien aus `aiko-webapp-core` in `src/app/api/`, `src/app/auth/`, `src/middleware.ts` etc. Diese Dateien sind in `.gitignore` und mussen bei jedem Start neu generiert werden.

### Dev-Login (ohne echten Google-Account)

Der Dev-Token ist nur aktiv wenn `SUPABASE_DEV_TOKEN` in `.env.local` gesetzt ist. Er erstellt eine echte Supabase-Session fur `michael.sytko@gmail.com` via Magic-Link OTP - kein Passwort, kein Google-Login notig.

URL aufrufen:
```
http://localhost:3001/api/dev-login?token=aiko-jpcard-dev-2026&redirect=/content/hiragana
```

Der Token `aiko-jpcard-dev-2026` ist in `.env.local` als `SUPABASE_DEV_TOKEN` hinterlegt. In Kubernetes/Produktion existiert dieser Token nicht - er ist ausschliesslich fur lokale Entwicklung.

### Schneller Browser-Check mit Dev-Token

Wenn du die App im Browser/Screenshot pruefen willst, immer den echten Browser auf den Dev-Login-Endpoint schicken, nicht nur `curl` verwenden:

```text
http://localhost:3001/api/dev-login?token=<SUPABASE_DEV_TOKEN>&redirect=/
```

Erwartetes Ergebnis:
- Browser-URL endet auf `http://localhost:3001/`
- Screenshot zeigt die Startseite mit `Japanese Cards`, `Hiragana` und `Katakana`
- Wenn die URL auf `/login?redirect=%2F` endet, ist der Dev-Login fehlgeschlagen

Wichtige Checks bei Fehlern:

```bash
node -p "require('./node_modules/@michalsy/aiko-webapp-core/package.json').version"
```

Die Version muss mindestens `1.1.9` sein. Ab `1.1.9` nutzt der Core fuer Dev-Login Supabase-Fetches mit `cache: 'no-store'`; ohne das kann Next im lokalen Route-Kontext eine alte Magic-Link-Antwort wiederverwenden, was zu `refresh_token_already_used` und Redirect zur Login-Seite fuehrt.

Wenn trotz richtiger Version weiter `/login` kommt:

```powershell
taskkill /F /IM node.exe /T
Remove-Item .next -Recurse -Force
npm install @michalsy/aiko-webapp-core@latest
npm run dev
```

Dann den Browser erneut auf die Dev-Login-URL schicken und direkt danach einen Screenshot der Zielseite machen.

### Chrome mit Remote-Debugging starten

Chrome muss mit `--remote-debugging-port=9222` gestartet werden damit das Chrome DevTools MCP darauf zugreifen kann. Normales Chrome hat keinen Debug-Port.

Chrome mit einem separaten `--user-data-dir` starten - das lauft als eigene Instanz neben dem normalen Chrome, nichts beenden (PowerShell):
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222","--user-data-dir=C:\tmp\chrome-debug2","http://localhost:3001/api/dev-login?token=aiko-jpcard-dev-2026&redirect=/content/hiragana"
```

Verbindung pruefen:
```bash
curl -s http://127.0.0.1:9222/json/version
```

Wenn das JSON zurueckkommt, ist Chrome verbunden. Dann im Claude Code `/mcp` ausfuhren falls das Chrome DevTools MCP nicht verbunden ist.

### Vollstandiger Ablauf (neue Session)

1. Dev-Server starten: `npm run dev` im `japanese-cards/` Ordner
2. Chrome-Prozesse beenden: `taskkill //F //IM chrome.exe //T`
3. Chrome mit Debug-Port starten (PowerShell, siehe oben)
4. Warten bis `curl http://127.0.0.1:9222/json/version` antwortet
5. Im Browser landet man direkt auf `/content/hiragana` - eingeloggt als michael.sytko@gmail.com

### Umgebungsvariablen (.env.local)

Alle Werte sind bereits gesetzt - nichts weiter konfigurieren:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase Projekt-URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key (fur Dev-Login benotigt)
- `SUPABASE_DEV_TOKEN` - Dev-Login Token (`aiko-jpcard-dev-2026`)
- `NEXT_PUBLIC_ASSETS_URL` - URL zum Supabase Storage Bucket fur Kartenbilder
- `DEV_APP_URL` - uberschreibt `NEXT_PUBLIC_APP_URL` auf `http://localhost:3001` damit Dev-Login auf localhost weiterleitet (nicht auf Produktions-URL)
