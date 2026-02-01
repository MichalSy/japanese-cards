import { useNavigate } from 'react-router-dom'
import { Settings, Sparkles } from 'lucide-react'

export default function MainMenu() {
  const navigate = useNavigate()

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', emoji: 'あ', color: 'from-pink-500 to-rose-500' },
    { id: 'katakana', name: 'Katakana', emoji: 'カ', color: 'from-purple-500 to-pink-500' },
    { id: 'words', name: 'Wörter', emoji: '📚', color: 'from-blue-500 to-cyan-500' },
    { id: 'sentences', name: 'Sätze', emoji: '💬', color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-yellow-400 animate-spin" size={24} />
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Japanese
            </h1>
            <Sparkles className="text-yellow-400 animate-spin" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Cards</h2>
          <p className="text-purple-300 text-lg">Lerne spielerisch 🎮</p>
        </div>

        {/* Content Buttons */}
        <div className="space-y-4 mb-8">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => navigate(`/content/${type.id}`)}
              className={`w-full py-5 px-6 bg-gradient-to-br ${type.color} hover:shadow-2xl text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-lg active:scale-95`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{type.emoji}</span>
                <div className="text-left">
                  <div className="font-bold">{type.name}</div>
                  <div className="text-sm opacity-90">Starten</div>
                </div>
                <span className="ml-auto text-xl">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Button */}
        <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold transition-all border border-white/20 flex items-center justify-center gap-2 backdrop-blur-lg">
          <Settings size={20} />
          Einstellungen
        </button>

        {/* Footer Stats */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl backdrop-blur-lg border border-white/10">
          <p className="text-center text-purple-300 text-sm">
            ✨ Viel Spaß beim Lernen!
          </p>
        </div>
      </div>
    </div>
  )
}
