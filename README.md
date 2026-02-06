# Japanese Cards 🗾

Ein modernes Lernspiel zum Lernen von Japanisch, mit Fokus auf Hiragana-Zeichen und deren Romanisierung.

## 📋 Überblick

**Japanese Cards** ist eine interaktive Web-Anwendung, die japanische Schriftsysteme (Hiragana, Katakana) und Vokabeln durch spielerische Modi trainiert.

### ✨ Features

- **Swipe Game** (Hauptmodus): Zeichen + Romaji-Paarung bewerten (Tinder-Style)
- **Pro Mode**: Erweiterte Ansicht für Power-User
- **JSON-basierte Daten**: Alle Lerninhalte liegen in `public/GameData/`
- **Mehrsprachig**: Deutsch (DE) und Englisch (EN)
- **Responsive**: Optimiert für Mobile (Touch) und Desktop

## 🛠️ Technologien

Das Projekt verwendet moderne Web-Technologien:

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (im SPA Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Projektstruktur

Der Quellcode befindet sich hauptsächlich im `app/` Verzeichnis:

```
japanese-cards/
├── app/
│   ├── components/      # Wiederverwendbare UI-Komponenten
│   ├── config/          # Konfigurationen (z.B. API)
│   ├── context/         # React Context (z.B. LanguageContext)
│   ├── hooks/           # Custom Hooks
│   ├── modes/           # Spielmodi (z.B. SwipeGame)
│   ├── pages/           # Seiten-Views (MainMenu, GameScreen)
│   ├── utils/           # Hilfsfunktionen
│   ├── root.jsx         # Haupt-Layout und Routing
│   └── index.css        # Globale Styles & Tailwind
├── public/
│   └── GameData/        # JSON-Daten für Kategorien und Karten
├── src/
│   └── main.jsx         # Einstiegspunkt für Vite
└── vite.config.js       # Vite Konfiguration
```

## 🚀 Installation & Start

Voraussetzung: Node.js (Version 18+ empfohlen).

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd japanese-cards
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Die App ist nun unter `http://localhost:5173/japanese-cards/` erreichbar.

## 🏗️ Build & Deployment

Das Projekt ist für **GitHub Pages** optimiert.

```bash
npm run build
```

Der Build-Output landet in `build/client`.

## 🧹 Code-Status

Das Projekt befindet sich in aktiver Entwicklung.
- **Einstiegspunkt**: `src/main.jsx` -> `app/root.jsx`
- **Daten**: Werden dynamisch aus `public/GameData` geladen (oder via GitHub Raw API in Production).

---

## 👤 Autor

Michal
