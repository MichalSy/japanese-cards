import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import MainMenu from "./pages/MainMenu.jsx";
import ContentTypeView from "./pages/ContentTypeView.jsx";
import GameModeSelector from "./pages/GameModeSelector.jsx";
import GameScreen from "./pages/GameScreen.jsx";
import "./index.css";

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route index element={<MainMenu />} />
        <Route path="content/:contentType" element={<ContentTypeView />} />
        <Route path="content/:contentType/:groupId" element={<GameModeSelector />} />
        <Route path="game/:contentType/:groupId/:modeId" element={<GameScreen />} />
      </Routes>
    </LanguageProvider>
  );
}
