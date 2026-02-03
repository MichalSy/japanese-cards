# GitHub Pages SPA Deployment - Lessons Learned

## ⚠️ CRITICAL: What NOT to do

### ❌ Problem 1: React Router 7 Framework Mode + GitHub Pages

**Die Versuchung:** React Router 7 hat ein "Framework Mode" (wie Remix) mit SSR, Hydration, und automatischem Routing.

**Das Problem:**
- Framework Mode generiert HTML ohne `<div id="root">` → React crashes with "Cannot read properties of null"
- Lazy route discovery (`mode: "lazy"`) versucht, `/japanese-cards/__manifest` zu laden
- HTTP 404 Fehler bei Navigation, weil das Manifest nicht existiert
- Komplexe SSR/Hydration Mismatches
- Loaders (`export loader`) nicht im SPA Mode erlaubt
- Viele widersprüchliche Configs (isSpaMode vs ssr vs prerender)

**Beispiel-Error:**
```
"routeDiscovery":{"mode":"lazy","manifestPath":"/japanese-cards/__manifest"}
// Browser versucht __manifest zu laden → 404 Error bei Navigation
```

**❌ Nicht verwenden:**
```js
// react-router.config.js
export default {
  ssr: true,                      // ❌ Brauchen wir nicht
  prerender: () => ["/"],          // ❌ Nur index prerendern führt zu Hydration Errors
  // HydratedRouter + lazy discovery → 💥 Crash auf Navigation
}
```

---

### ❌ Problem 2: Loaders statt useEffect

**Das Problem:**
- React Router Framework Mode mit `ssr: false` erlaubt keine `export loader` Funktionen
- Führt zu Build Errors
- "SPA Mode: 1 invalid route export(s)"

**Beispiel-Error:**
```
[react-router:route-exports] SPA Mode: 1 invalid route export(s) in `pages/ContentTypeView.jsx`: `loader`
```

**❌ Nicht verwenden:**
```jsx
// pages/ContentTypeView.jsx
export async function loader({ params }) {
  const config = await fetchCategoryConfig(params.contentType)
  return { config }
}

export default function ContentTypeView() {
  const { config } = useLoaderData()  // ❌ Funktioniert nicht in SPA Mode!
}
```

---

### ❌ Problem 3: Null Reference Errors bei Navigation

**Das Problem:**
- Komponenten rendern BEVOR `useEffect` ihre Daten lädt
- Versuchen auf `.name` zuzugreifen wenn Daten noch `null` sind
- "Cannot read properties of null (reading 'name')"

**Beispiel-Error:**
```
const categoryName = categoryConfig.name  // ❌ categoryConfig ist noch null!

// React rendert sofort, useEffect lädt später
// Result: categoryConfig undefined → crash
```

---

## ✅ Die RICHTIGE Lösung

### 1. Vanilla Vite + React Router (KEIN Framework Mode)

```js
// vite.config.js - EINFACH
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/japanese-cards/",
  plugins: [react()],
  build: {
    outDir: "build/client",
  },
});
```

**Keine `react-router.config.js` nötig!**

---

### 2. BrowserRouter statt HydratedRouter

```jsx
// src/main.jsx
import { BrowserRouter } from "react-router-dom";
import App from "../app/root.jsx";
import { createRoot } from "react-dom/client";

// ✅ Vanilla React Router - keine Framework Mode Komplexität
createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/japanese-cards/">
    <App />
  </BrowserRouter>
);
```

---

### 3. Statische Routes (keine Loaders)

```jsx
// app/root.jsx
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route index element={<MainMenu />} />
      <Route path="content/:contentType" element={<ContentTypeView />} />
      <Route path="content/:contentType/:groupId" element={<GameModeSelector />} />
      <Route path="game/:contentType/:groupId/:modeId" element={<GameScreen />} />
    </Routes>
  );
}
```

---

### 4. useEffect + Loading States (statt Loaders)

```jsx
// pages/ContentTypeView.jsx - ✅ RICHTIG
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ContentTypeView() {
  const { contentType } = useParams();
  const [categoryConfig, setCategoryConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Daten laden NACH dem ersten Render
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const config = await fetchCategoryConfig(contentType);
        setCategoryConfig(config);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [contentType]);

  // ✅ Warten bis Daten geladen sind bevor rendern
  if (loading) return <div>Laden...</div>;
  if (error || !categoryConfig) return <div>Fehler: {error}</div>;

  // ✅ Jetzt können wir categoryConfig.name sicher nutzen
  return (
    <div>
      <h1>{categoryConfig.name}</h1>
      ...
    </div>
  );
}
```

---

### 5. GitHub Pages 404.html Fallback

```bash
# Build Script
vite build                      # Generiert build/client/index.html
cp build/client/index.html build/client/404.html  # ✅ Fallback
```

**Wie es funktioniert:**
1. Browser: `GET /japanese-cards/content/hiragana`
2. GitHub Pages: Datei nicht gefunden → HTTP 404
3. GitHub Pages: Serves `404.html` (welches `index.html` ist)
4. Browser: Lädt React
5. React Router: Sieht pathname `/content/hiragana`, routet zu richtigem Component
6. ✅ Seite rendet

**WICHTIG:** Gleich nach `vite build` ausführen!

---

### 6. package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/github-pages-spa.js",
    "start": "vite preview"
  }
}
```

---

## 🚀 Zusammenfassung: Die 5 Regeln

| ❌ NICHT machen | ✅ STATTDESSEN |
|---|---|
| React Router Framework Mode | Vanilla Vite + `BrowserRouter` |
| `HydratedRouter` + SSR | `createRoot()` + `BrowserRouter` |
| `export loader` Funktionen | `useState` + `useEffect` |
| Komponenten ohne Null-Checks | Loading States vor Render |
| Komplexe `react-router.config.js` | Einfache `vite.config.js` |

---

## 🐛 Fehlermeldungen - Was sie bedeuten

### "Error: 404" - React Router Fehler
```
Ursache: Lazy route discovery versucht __manifest zu laden
Lösung: Vanilla React Router, keine Framework Mode
```

### "Cannot read properties of null (reading 'name')"
```
Ursache: Komponente rendet bevor useEffect fertig
Lösung: Loading State + Null-Checks
```

### "Cannot read properties of null (reading 'id')"
```
Ursache: useParams() gibt null zurück
Lösung: useEffect Dependencies korrekt setzen
```

### "Minified React error #299"
```
Ursache: <div id="root"> existiert nicht in HTML
Lösung: index.html muss <div id="root"></div> haben
```

---

## 📋 Deployment Checklist

- [ ] Kein `react-router.config.js` (oder nur als `export default { }`)
- [ ] `BrowserRouter basename="/japanese-cards/"`
- [ ] Alle Routes statisch definiert
- [ ] Alle Daten-Fetches in `useEffect`
- [ ] Loading States vor jedem `.map()` oder `.name` Zugriff
- [ ] `build/client/404.html` = copy von `index.html`
- [ ] `.nojekyll` erstellt (verhindert Jekyll Prozessing)
- [ ] `vite build` läuft ohne Errors

---

## 📚 Referenzen

- **GitHub Pages + React SPA**: https://github.com/gitname/react-gh-pages (Bestes Beispiel!)
- **Create React App Deployment**: https://create-react-app.dev/docs/deployment/#github-pages
- **React Router BrowserRouter**: https://reactrouter.com/en/main/routers/browser-router
- **Vite Config**: https://vitejs.dev/config/

---

## 💡 Pro Tips

1. **Never use React Router Framework Mode for static hosting**
   - Framework Mode ist für Full-Stack Apps (mit Server)
   - GitHub Pages ist rein statisch
   - Vanilla React + BrowserRouter ist 1000x simpler

2. **Always test navigation before pushing**
   ```bash
   npm run build
   npm run preview
   # Dann im Browser navigieren, Devtools prüfen
   ```

3. **Loading states sparen Debugging-Stunden**
   - Immer `loading`, `error`, `!data` checken
   - Null-Safety ist nicht optional

4. **GitHub Pages braucht 404.html**
   - Das ist **die** Feature für SPA Routing auf GitHub Pages
   - Nicht vergessen!

---

**Geschrieben nach 8+ Stunden Debugging der schlimmsten React Router + GitHub Pages Kombinationen 😅**
