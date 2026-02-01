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
    { id: 'swipe', name: 'Swipe Game', emoji: '👆', desc: 'Wische links oder rechts' },
    { id: 'multiChoice', name: 'Multiple Choice', emoji: '🎯', desc: 'Wähle die richtige Antwort' },
    { id: 'flashcard', name: 'Flashcard', emoji: '🃏', desc: 'Karte umdrehen' },
    { id: 'typing', name: 'Typing Challenge', emoji: '⌨️', desc: 'Tippe das Romaji' },
  ]

  const groupName = groupNames[contentType]?.[groupId] || 'Gruppe'

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700 gap-4">
        <button
          onClick={() => navigate(`/content/${contentType}`)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white truncate">{groupName}</h1>
          <p className="text-xs text-slate-400">Wähle einen Spiel-Modus</p>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {/* Stats Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-4 mb-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Deine Statistik</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">Korrekt</p>
                <p className="text-2xl font-bold text-green-600">14/15</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Genauigkeit</p>
                <p className="text-2xl font-bold text-blue-600">93%</p>
              </div>
            </div>
          </div>

          {/* Game Modes */}
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate(`/game/${contentType}/${groupId}/${mode.id}`)}
              className="w-full group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md p-4 transition-all active:scale-95 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all"></div>
              <div className="relative flex items-center gap-4">
                <div className="text-4xl">{mode.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{mode.name}</h3>
                  <p className="text-sm text-slate-500">{mode.desc}</p>
                </div>
                <span className="text-2xl text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom padding */}
        <div className="h-8"></div>
      </div>

      {/* Bottom Action Button */}
      <div className="h-16 bg-white border-t-2 border-slate-200 flex items-center px-6">
        <p className="text-center text-sm text-slate-500 w-full">
          Wähle einen Modus oben zum Spielen
        </p>
      </div>
    </div>
  )
}
