import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { useRouteTitle } from './hooks/usePageTitle'
import MainMenu from './pages/MainMenu'
import ContentTypeView from './pages/ContentTypeView'
import GameModeSelector from './pages/GameModeSelector'
import GameScreen from './pages/GameScreen'
import './App.css'

function AppContent() {
  useRouteTitle()

  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/content/:contentType" element={<ContentTypeView />} />
      <Route path="/content/:contentType/:groupId" element={<GameModeSelector />} />
      <Route path="/game/:contentType/:groupId/:modeId" element={<GameScreen />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Router basename="/japanese-cards/">
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}
