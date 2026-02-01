import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Target, Award } from 'lucide-react'
import { useState } from 'react'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', icon: BookOpen },
    { id: 'katakana', name: 'Katakana', icon: Target },
    { id: 'words', name: 'Wörter', icon: Zap },
    { id: 'sentences', name: 'Sätze', icon: Award },
  ]

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'stats', label: 'Stats', icon: '🏆' },
  ]

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-5 border-b border-slate-700">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Japanese
          </h1>
          <p className="text-xs text-slate-400 font-medium">Learn Japanese</p>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {activeTab === 'start' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 px-1 pt-2">Kategorien</h2>
            <div className="space-y-2">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => navigate(`/content/${type.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors active:scale-95"
                  >
                    <div className="p-2 bg-slate-200 rounded-md">
                      <Icon size={20} className="text-slate-700" />
                    </div>
                    <span className="flex-1 text-left font-medium text-slate-900">{type.name}</span>
                    <span className="text-slate-400 text-sm">→</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
              <p className="text-xs font-medium text-slate-700">
                💡 Starte mit einer Kategorie, um zu spielen!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 px-1 pt-2">Fortschritt</h2>
            <div className="space-y-3">
              {contentTypes.map((type) => (
                <div key={type.id} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-900">{type.name}</span>
                    <span className="text-xs font-bold text-pink-600">42%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 px-1 pt-2">Statistiken</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-xs text-blue-700 font-semibold mb-2">Tage aktiv</p>
                <p className="text-3xl font-black text-blue-700">12</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-xs text-green-700 font-semibold mb-2">Punkte</p>
                <p className="text-3xl font-black text-green-700">1.2K</p>
              </div>
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg text-center">
                <p className="text-xs text-pink-700 font-semibold mb-2">Genauigkeit</p>
                <p className="text-3xl font-black text-pink-700">89%</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <p className="text-xs text-purple-700 font-semibold mb-2">Streak</p>
                <p className="text-3xl font-black text-purple-700">7</p>
              </div>
            </div>
          </div>
        )}

        <div className="h-4"></div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-around px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 py-3 px-6 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-slate-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
