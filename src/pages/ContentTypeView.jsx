import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'

export default function ContentTypeView() {
  const { contentType } = useParams()
  const navigate = useNavigate()

  const contentData = {
    hiragana: {
      name: 'Hiragana',
      emoji: 'あ',
      color: 'from-pink-500 to-rose-500',
      groups: [
        { id: 'a', name: 'A-Reihe', accuracy: 93, completed: true, count: 5 },
        { id: 'ka', name: 'Ka-Reihe', accuracy: 87, completed: true, count: 5 },
        { id: 'sa', name: 'Sa-Reihe', accuracy: 0, completed: false, count: 5 },
        { id: 'ta', name: 'Ta-Reihe', accuracy: 0, completed: false, count: 5 },
        { id: 'na', name: 'Na-Reihe', accuracy: 0, completed: false, count: 5 },
      ],
    },
    katakana: {
      name: 'Katakana',
      emoji: 'カ',
      color: 'from-purple-500 to-pink-500',
      groups: [
        { id: 'a', name: 'A-Reihe', accuracy: 0, completed: false, count: 5 },
        { id: 'ka', name: 'Ka-Reihe', accuracy: 0, completed: false, count: 5 },
      ],
    },
    words: {
      name: 'Wörter',
      emoji: '📚',
      color: 'from-blue-500 to-cyan-500',
      groups: [
        { id: 'animals', name: 'Tiere', accuracy: 0, completed: false, count: 8 },
        { id: 'food', name: 'Essen', accuracy: 0, completed: false, count: 12 },
      ],
    },
    sentences: {
      name: 'Sätze',
      emoji: '💬',
      color: 'from-green-500 to-emerald-500',
      groups: [
        { id: 'greetings', name: 'Grüße', accuracy: 0, completed: false, count: 6 },
      ],
    },
  }

  const data = contentData[contentType] || contentData.hiragana
  const completedCount = data.groups.filter(g => g.completed).length
  const totalCount = data.groups.length

  const getProgressColor = (accuracy) => {
    if (accuracy === 0) return 'bg-gray-400'
    if (accuracy < 50) return 'bg-red-500'
    if (accuracy < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-20">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 hover:bg-white/10 rounded-xl transition-all"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.name}</h1>
            <p className="text-purple-300 text-sm">{completedCount}/{totalCount} abgeschlossen</p>
          </div>
          <span className="text-5xl ml-auto">{data.emoji}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white/5 rounded-xl p-4 backdrop-blur-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Fortschritt</span>
            <span className="text-purple-300 font-bold">{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${data.color} transition-all`}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-3 mb-8">
          {data.groups.map((group) => (
            <button
              key={group.id}
              onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105 text-left backdrop-blur-lg border border-white/20 active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{group.name}</h3>
                  <p className="text-purple-300 text-sm">{group.count} Zeichen</p>
                </div>
                {group.completed ? (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{group.accuracy}%</div>
                    <div className="text-xs text-green-300">✅ Abgeschlossen</div>
                  </div>
                ) : (
                  <div className="text-right">
                    <Zap size={24} className="text-gray-400" />
                    <div className="text-xs text-gray-400">Neu</div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
          <p className="text-center text-purple-300 text-sm">Wähle eine Gruppe zum Starten</p>
        </div>
      </div>
    </div>
  )
}
