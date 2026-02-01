import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Target, Award } from 'lucide-react'
import { useState } from 'react'

export default function MainMenu() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('start')

  const contentTypes = [
    { id: 'hiragana', name: 'Hiragana', icon: BookOpen, desc: '日本語の基本文字' },
    { id: 'katakana', name: 'Katakana', icon: Target, desc: '外来語の文字' },
    { id: 'words', name: 'Wörter', icon: Zap, desc: 'Vokabeltraining' },
    { id: 'sentences', name: 'Sätze', icon: Award, desc: 'Satzstrukturen' },
  ]

  const tabs = [
    { id: 'start', label: 'Start', icon: '🎮' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'stats', label: 'Stats', icon: '🏆' },
  ]

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top Header */}
      <div className="h-20 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-6 border-b border-slate-700">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Japanese
          </h1>
          <p className="text-xs text-slate-400">Lerne spielerisch</p>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {activeTab === 'start' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Kategorien</h2>
              <div className="grid grid-cols-1 gap-3">
                {contentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => navigate(`/content/${type.id}`)}
                      className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 p-4 transition-all hover:shadow-md active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl group-hover:shadow-md transition-all">
                          <Icon size={24} className="text-slate-700" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-slate-900">{type.name}</h3>
                          <p className="text-sm text-slate-500">{type.desc}</p>
                        </div>
                        <span className="text-xl text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">💡 Tipp des Tages</h3>
              <p className="text-sm text-slate-600">
                Regelmäßiges Üben hilft dir, schneller Fortschritte zu machen. Starte mit den Zeichensätzen!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Dein Fortschritt</h2>
            <div className="space-y-4">
              {contentTypes.map((type) => (
                <div key={type.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-900">{type.name}</h3>
                    <span className="text-sm font-bold text-pink-600">42%</span>
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Statistiken</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-600 font-semibold mb-1">Tage aktiv</p>
                <p className="text-3xl font-black text-blue-700">12</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-xs text-green-600 font-semibold mb-1">Gesamtpunkte</p>
                <p className="text-3xl font-black text-green-700">1.2K</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-2xl p-4">
                <p className="text-xs text-pink-600 font-semibold mb-1">Genauigkeit</p>
                <p className="text-3xl font-black text-pink-700">89%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-4">
                <p className="text-xs text-purple-600 font-semibold mb-1">Streak</p>
                <p className="text-3xl font-black text-purple-700">7</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="h-20 bg-white border-t-2 border-slate-200 flex items-center justify-around px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-slate-900'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
