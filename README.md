# Japanese Cards 🗾

Ein modernes Lernspiel zum Lernen von Japanisch, mit Fokus auf Hiragana-Zeichen und deren Romanisierung.

## 📋 Überblick

**Japanese Cards** ist eine interaktive Web-Anwendung, die japanische Schriftsysteme (Hiragana, Katakana) und Vokabeln durch spielerische Modi trainiert.

### ✨ Features

- **Swipe Game** (Hauptmodus): Zeigezeichen + Romaji-Paarung, bewerten ob korrekt
- **JSON-basierte Datenstruktur**: Leicht zu erweitern und zu pflegen
- **Mehrsprachig**: Deutsch (DE) und Englisch (EN) mit localStorage-Persistierung
- **Modularная Architektur**: Spielmodi sind unabhängig und erweiterbar
- **Mobile-freundlich**: Touch-Optimiert mit Swipe-Erkennung
- **Fehlertracking**: Detaillierte Fehleranalyse nach jedem Spiel

---

## 🎮 Spielmechanik

### Swipe Game (Aktuell Implementiert ✅)

**Ablauf:**
1. Zeige Zeichen (z.B. ひ) + Romaji-Behauptung (z.B. "he")
2. Nutzer entscheidet: "Ist diese Paarung korrekt?"
3. Swipen: `➡️ Rechts = Richtig` | `⬅️ Links = Falsch`
4. Visuelles Feedback: Grüner/roter Flash-Overlay
5. Fehler werden getrackt für Lernanalyse

**Besonderheiten:**
- 50/50 zufällige Korrektheit pro Karte (lerneffektiv)
- Kartenwiederholung wenn weniger Items als gewählt (z.B. 71 Hiragana × 20er-Deck)
- Keine Layout-Shifts bei Flash-Animation (Buttons bleiben im DOM)

**Zukünftige Modi:**
- MultiChoice: Mehrere Optionen auswählen
- Flashcard: Klassische Kartenflip-Mechanik
- Typing: Manuelles Eingeben von Romaji

---

## 📁 Projektstruktur

```
japanese-cards/
├── public/
│   ├── GameData/
│   │   ├── categories.json          # Kategorie-Listing
│   │   ├── gamemodes.json           # Globale Spielmodus-Konfiguration
│   │   ├── hiragana/
│   │   │   ├── category.json        # Hiragana-Metadaten + verfügbare Modi
│   │   │   └── data/
│   │   │       ├── hiragana-a.json      # Reihen-Daten (a, ka, sa, ta, na, ha, ma, ya, ra, wa, ga, za, da, ba, pa)
│   │   │       └── ...
│   │   ├── katakana/, words/, sentences/ (disabled)
│   │   └── 404.html                 # Statisch generiert für GitHub Pages
│   │
│   └── index.html
│
├── src/
│   ├── config/
│   │   └── api.js                   # Daten-Fetching (GitHub Raw URLs)
│   │
│   ├── context/
│   │   └── LanguageContext.jsx      # Sprach-State (DE/EN)
│   │
│   ├── components/
│   │   ├── AppHeaderBar.jsx         # Header mit Navbar (Grid: auto 1fr auto)
│   │   ├── LanguageToggle.jsx       # DE/EN Umschalter
│   │   ├── Layout.jsx               # Wrapper (AppContent, AppFooter, Card)
│   │   └── CategoryCardSkeleton.jsx # Skeleton Loading
│   │
│   ├── hooks/
│   │   └── usePageTitle.js          # Dynamische Seitentitel
│   │
│   ├── modes/
│   │   └── swipe/
│   │       ├── SwipeGame.jsx        # Main Game Container
│   │       ├── SwipeCard.jsx        # Interaktive Karte + Touch-Handler
│   │       └── useSwipeGame.js      # Spiel-Logik Hook
│   │
│   ├── pages/
│   │   ├── MainMenu.jsx             # Startseite (Kategorie-Browser)
│   │   ├── GameModeSelector.jsx     # Modus + Kartenzahl-Wahl
│   │   └── GameScreen.jsx           # Game Mode Lazy-Loading
│   │
│   ├── App.jsx                      # Router + Layout
│   ├── main.jsx                     # Entry Point
│   └── index.css                    # Global Styles
│
├── scripts/
│   └── generate-html.js             # Vite Plugin für statische HTML-Gen.
│
├── vite.config.js                   # Vite + Plugins
└── package.json
```

---

## 🏗️ Architektur-Prinzipien

### 1. **Datengetrieben (JSON-First)**
- Alle Inhalte liegen als JSONs in `public/GameData/`
- **Keine hardcodierten Daten** in JS
- Leicht zu aktualisieren, ohne Code zu ändern

### 2. **Modulare Spielmodi**
Jeder Modus hat einen eigenen Ordner mit:
```
src/modes/{gameMode}/
├── {GameMode}.jsx       # Container + UI
├── {GameMode}Card.jsx   # Einzelne Karten-Komponente
└── use{GameMode}.js     # Spiel-Logik Hook
```

Neu? Einfach neuen Ordner anlegen und wie `swipe/` strukturieren.

### 3. **Lazy Loading**
- Spielmodi werden nur bei Bedarf geladen
- Kategorie-Daten werden asynchron gefetcht
- GameScreen nutzt `import()` für dynamisches Laden

### 4. **Separation of Concerns**
- **Hook** (`useSwipeGame.js`): Zustand, Logik, Shuffle, Stats
- **Card** (`SwipeCard.jsx`): Touch-Handling, Animation
- **Game** (`SwipeGame.jsx`): Container, Fehler-Display, Results

### 5. **API-First (GitHub Raw URLs)**
```javascript
// api.js
const API_BASE = 'https://raw.githubusercontent.com/MichalSy/japanese-cards/refs/heads/main/public/GameData'

fetchCategories()        // GET /categories.json
fetchCategoryConfig()    // GET /{categoryId}/category.json
fetchGroupData()         // GET /{categoryId}/data/{groupId}.json
```

---

## 📊 Datenstruktur

### categories.json
```json
[
  {
    "id": "hiragana",
    "nameEn": "Hiragana",
    "nameDe": "Hiragana",
    "enabled": true,
    "type": "characters"
  }
]
```

### hiragana/category.json
```json
{
  "id": "hiragana",
  "gameModes": ["swipe", "multiChoice", "flashcard"],
  "groups": [
    { "id": "a", "name": "A-Reihe", "dataFile": "data/hiragana-a.json" },
    { "id": "ka", "name": "Ka-Reihe", "dataFile": "data/hiragana-ka.json" }
  ]
}
```

### hiragana/data/hiragana-a.json
```json
{
  "items": [
    { "character": "あ", "romaji": "a" },
    { "character": "い", "romaji": "i" },
    { "character": "う", "romaji": "u" },
    { "character": "え", "romaji": "e" },
    { "character": "お", "romaji": "o" }
  ]
}
```

### gamemodes.json
```json
{
  "gamemodes": [
    { "id": "swipe", "enabled": true },
    { "id": "multiChoice", "enabled": false },
    { "id": "flashcard", "enabled": false }
  ]
}
```

---

## 🎯 Was wir bisher implementiert haben

### ✅ Phase 1: Datenmigration
- Hiragana-Zeichensatz: 71 Zeichen über 15 Reihen
- JSON-Struktur: `public/GameData/hiragana/data/{reihe}.json`
- API-Fetching aus GitHub Raw URLs

### ✅ Phase 2: Infrastruktur
- LanguageContext (DE/EN toggle + localStorage)
- AppHeaderBar mit Grid-Layout (auto 1fr auto)
- Skeleton Loading States
- Dynamic Page Titles

### ✅ Phase 3: Swipe Game
- `useSwipeGame.js` Hook: Shuffle, Tracking, Card Repetition
- `SwipeCard.jsx`: Touch-Detection, Swipe-Animation, Flash-Feedback
- `SwipeGame.jsx`: Game Container, Results, Mistake Tracking
- Karten-Wiederholung bei kleinen Datensätzen
- Fehler-Tracking mit römischen Buchstaben (Romaji)

### ✅ Phase 4: UI/UX Polish
- Cute & Modern Design mit rosa Akzent (#ec4899)
- Keine Card-Stack-Optik (exakte Überlagerung)
- Große lesbare Zeichen (160px)
- Arrow-Buttons statt Text
- Keine Layout-Shifts bei Flash-Animation

---

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: CSS-in-JS (inline styles) + CSS Variables
- **State Management**: React Hooks + Context API
- **Data**: JSON + GitHub Raw URLs
- **Deployment**: GitHub Pages (static HTML gen via Vite plugin)
- **Animation**: CSS Transitions + requestAnimationFrame

---

## 🛠️ Setup & Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Öffne http://localhost:5173

### Build
```bash
npm run build
```

### Deploy zu GitHub Pages
```bash
npm run build
# Dann in Repo-Settings GitHub Pages auf `gh-pages` Branch setzen
```

---

## 📈 Nächste Schritte

1. **MultiChoice Mode**: Mehrere Romaji-Optionen zur Auswahl
2. **Flashcard Mode**: Klassische Flip-Mechanik
3. **Typing Mode**: Manuelles Eingeben von Romaji
4. **Progress Tracking**: Persistente Statistiken pro Nutzer
5. **Katakana / Words / Sentences**: Weitere Kategorien aktivieren
6. **User Accounts**: Optional für Cloud-Sync von Progress

---

## 📝 Lizenz

MIT

---

## 👤 Author

Michal
