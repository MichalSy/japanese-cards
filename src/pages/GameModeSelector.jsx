import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '../components/Layout'

export default function GameModeSelector() {
  const { contentType, groupId } = useParams()
  const navigate = useNavigate()

  const groupNames = {
    hiragana: {
      a: 'Hiragana - A-Reihe',
      ka: 'Hiragana - Ka-Reihe',
      sa: 'Hiragana - Sa-Reihe',
      ta: 'Hiragana - Ta-Reihe',
      na: 'Hiragana - Na-Reihe',
    },
  }

  const gameModes = [
    { id: 'swipe', name: 'Swipe Game', emoji: '👆', desc: 'Wische links/rechts' },
    { id: 'multiChoice', name: 'Multiple Choice', emoji: '🎯', desc: 'Wähle die richtige Antwort' },
    { id: 'flashcard', name: 'Flashcard', emoji: '🃏', desc: 'Karte umdrehen' },
    { id: 'typing', name: 'Typing Challenge', emoji: '⌨️', desc: 'Tippe Romaji' },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'

  return (
    <AppLayout>
      <AppHeader onBack={() => navigate(`/content/${contentType}`)}>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{groupName}</h1>
          <p className="text-xs text-slate-300">Wähle einen Modus</p>
        </div>
      </AppHeader>

      <AppContent>
        <div className="space-y-[var(--spacing-5)]">
          {/* Stats Card */}
          <Card>
            <div className="space-y-[var(--spacing-3)]">
              <h3 className="text-sm font-medium text-[var(--md-on-surface)]">Deine Statistik</h3>
              <div className="grid grid-cols-2 gap-[var(--spacing-3)]">
                <div className="space-y-[var(--spacing-2)]">
                  <p className="text-xs text-[var(--md-on-surface-variant)]">Korrekt</p>
                  <p className="text-2xl font-bold text-green-600">14/15</p>
                </div>
                <div className="space-y-[var(--spacing-2)]">
                  <p className="text-xs text-[var(--md-on-surface-variant)]">Genauigkeit</p>
                  <p className="text-2xl font-bold text-blue-600">93%</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Modes */}
          <div className="space-y-[var(--spacing-3)]">
            {gameModes.map((mode) => (
              <Card
                key={mode.id}
                interactive
                onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
              >
                <div className="flex items-center gap-[var(--spacing-4)]">
                  <span className="text-3xl flex-shrink-0">{mode.emoji}</span>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-[var(--md-on-surface)] text-base">{mode.name}</h3>
                    <p className="text-xs text-[var(--md-on-surface-variant)]">{mode.desc}</p>
                  </div>
                  <span className="text-[var(--md-on-surface-variant)]">→</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>

      <AppFooter>
        <p className="text-center text-sm text-[var(--md-on-surface-variant)] w-full">
          Wähle einen Modus zum Spielen
        </p>
      </AppFooter>
    </AppLayout>
  )
}
