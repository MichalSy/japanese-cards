import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

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
    { id: 'multiChoice', name: 'Multiple Choice', emoji: '🎯', desc: 'Wähle richtig' },
    { id: 'flashcard', name: 'Flashcard', emoji: '🃏', desc: 'Karte umdrehen' },
    { id: 'typing', name: 'Typing', emoji: '⌨️', desc: 'Tippe Romaji' },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-roboto">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700/30 gap-4">
        <button
          onClick={() => navigate(`/content/${contentType}`)}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{groupName}</h1>
          <p className="text-xs text-slate-400 font-normal">Wähle einen Modus</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4">
          {/* Stats Card - Material Design 3 */}
          <div className="p-4 bg-blue-50 border border-blue-200/50 rounded-2xl">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Deine Statistik</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600 font-normal mb-2">Korrekt</p>
                <p className="text-2xl font-bold text-green-600">14/15</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-normal mb-2">Genauigkeit</p>
                <p className="text-2xl font-bold text-blue-600">93%</p>
              </div>
            </div>
          </div>

          {/* Game Modes - Cards */}
          <div className="space-y-3">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
                className="w-full flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-colors active:bg-slate-100"
              >
                <span className="text-3xl flex-shrink-0">{mode.emoji}</span>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-slate-900 text-base">{mode.name}</h3>
                  <p className="text-xs text-slate-500 font-normal">{mode.desc}</p>
                </div>
                <span className="text-slate-400 text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-6"></div>
      </div>

      {/* Bottom Info */}
      <div className="h-20 bg-white border-t border-slate-200/50 flex items-center justify-center px-4">
        <p className="text-center text-sm text-slate-600 font-normal">
          Wähle einen Modus oben
        </p>
      </div>
    </div>
  )
}
