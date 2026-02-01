import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ContentTypeView() {
  const { contentType } = useParams()
  const navigate = useNavigate()

  const contentData = {
    hiragana: {
      name: 'Hiragana',
      groups: [
        { id: 'a', name: 'A-Reihe', progress: 93 },
        { id: 'ka', name: 'Ka-Reihe', progress: 87 },
        { id: 'sa', name: 'Sa-Reihe', progress: 0 },
        { id: 'ta', name: 'Ta-Reihe', progress: 0 },
        { id: 'na', name: 'Na-Reihe', progress: 0 },
      ],
    },
    katakana: {
      name: 'Katakana',
      groups: [
        { id: 'a', name: 'A-Reihe', progress: 0 },
        { id: 'ka', name: 'Ka-Reihe', progress: 0 },
      ],
    },
    words: {
      name: 'Wörter',
      groups: [
        { id: 'animals', name: 'Tiere', progress: 0 },
        { id: 'food', name: 'Essen', progress: 0 },
      ],
    },
    sentences: {
      name: 'Sätze',
      groups: [
        { id: 'greetings', name: 'Grüße', progress: 0 },
      ],
    },
  }

  const data = contentData[contentType] || contentData.hiragana
  const completedCount = data.groups.filter(g => g.progress > 0).length
  const totalCount = data.groups.length

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-5 border-b border-slate-700 gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">{data.name}</h1>
          <p className="text-xs text-slate-400 font-medium">{completedCount}/{totalCount} abgeschlossen</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="space-y-3">
          {/* Progress Overview */}
          <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-900">Gesamtfortschritt</span>
              <span className="text-xs font-bold text-pink-600">{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Groups */}
          {data.groups.map((group) => (
            <button
              key={group.id}
              onClick={() => navigate(`/content/${contentType}/${group.id}`)}
              className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors active:scale-95"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-slate-900 text-sm">{group.name}</h3>
                <span className="text-xs font-bold text-pink-600">{group.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${group.progress}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>

        <div className="h-4"></div>
      </div>

      {/* Bottom Action Button */}
      <div className="h-20 bg-white border-t border-slate-200 flex items-center px-5">
        <button
          onClick={() => navigate(`/content/${contentType}/${data.groups[0].id}`)}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95 text-sm"
        >
          Spielen →
        </button>
      </div>
    </div>
  )
}
