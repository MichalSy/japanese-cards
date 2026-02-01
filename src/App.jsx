import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainMenu from './pages/MainMenu'
import ContentTypeView from './pages/ContentTypeView'
import GameModeSelector from './pages/GameModeSelector'
import GameScreen from './pages/GameScreen'
import './App.css'

export default function App() {
  return (
    <Router basename="/japanese-cards/">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/content/:contentType" element={<ContentTypeView />} />
        <Route path="/content/:contentType/:groupId" element={<GameModeSelector />} />
        <Route path="/game/:contentType/:groupId/:modeId" element={<GameScreen />} />
      </Routes>
    </Router>
  )
}
