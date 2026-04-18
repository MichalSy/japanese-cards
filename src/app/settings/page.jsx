'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { useSettings } from '@/components/SettingsContext'
import { useT, useSetStrings } from '@/components/I18nContext'
import { translations } from '@/lib/translations'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

const CHECK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function LangButton({ lang, selected, onClick, icon }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer', background: selected ? 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.2))' : 'rgba(255,255,255,0.05)', outline: selected ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s', width: '100%' }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <span style={{ fontSize: '16px', fontWeight: '600', color: 'white', flex: 1, textAlign: 'left' }}>{lang.name}</span>
      {selected && CHECK}
    </button>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const { settings, setSettings } = useSettings()
  const t = useT()
  const setStrings = useSetStrings()

  const [uiLanguage, setUiLanguage] = useState(settings.uiLanguage)
  const [learnLanguageId, setLearnLanguageId] = useState(settings.learnLanguageId)
  const [uiLanguages, setUiLanguages] = useState([])
  const [learnLanguages, setLearnLanguages] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data/languages')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) { setUiLanguages(data.ui_languages ?? []); setLearnLanguages(data.learn_languages ?? []) } })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ui_language: uiLanguage, learn_language_id: learnLanguageId }) })
      const learnLang = learnLanguages.find(l => l.id === learnLanguageId)
      setStrings(translations[uiLanguage] ?? translations.en)
      setLanguage(uiLanguage)
      setSettings({ uiLanguage, learnLanguageId, appIcon: learnLang?.app_icon ?? settings.appIcon, appTitle: `${learnLang?.name_en ?? learnLang?.name ?? 'Japanese'} Cards` })
      router.push('/')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = uiLanguage !== settings.uiLanguage || learnLanguageId !== settings.learnLanguageId

  return (
    <AppLayout>
      <AppHeader><AppHeaderBar title={t('settings.title')} /></AppHeader>
      <AppContent>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>{t('loading')}</div>
        ) : (
          <div className="space-y-6 fade-in">
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('settings.motherTongue')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {uiLanguages.map(lang => <LangButton key={lang.id} lang={lang} selected={uiLanguage === lang.id} onClick={() => setUiLanguage(lang.id)} icon={lang.flag} />)}
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('settings.learnLang')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {learnLanguages.map(lang => <LangButton key={lang.id} lang={lang} selected={learnLanguageId === lang.id} onClick={() => setLearnLanguageId(lang.id)} icon={lang.app_icon ?? lang.flag} />)}
                </div>
              </div>
            </Card>
          </div>
        )}
      </AppContent>
      <AppFooter>
        <button onClick={handleSave} disabled={!hasChanges || saving}
          style={{ width: '100%', padding: '14px', background: hasChanges ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(255,255,255,0.08)', color: hasChanges ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '16px', cursor: hasChanges ? 'pointer' : 'default', boxShadow: hasChanges ? '0 4px 16px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s' }}
        >
          {saving ? t('saving') : t('save')}
        </button>
      </AppFooter>
    </AppLayout>
  )
}
