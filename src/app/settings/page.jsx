'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { useSettings } from '@/components/SettingsContext'
import AppHeaderBar from '@/components/AppHeaderBar'
import { AppLayout, AppHeader, AppContent, AppFooter, Card } from '@/components/Layout'

export default function SettingsPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { settings, setSettings } = useSettings()

  const [uiLanguage, setUiLanguage] = useState(settings.uiLanguage)
  const [learnLanguageId, setLearnLanguageId] = useState(settings.learnLanguageId)
  const [uiLanguages, setUiLanguages] = useState([])
  const [learnLanguages, setLearnLanguages] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const t = (de, en) => language === 'de' ? de : en

  useEffect(() => {
    fetch('/api/data/languages')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setUiLanguages(data.ui_languages ?? [])
          setLearnLanguages(data.learn_languages ?? [])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ui_language: uiLanguage, learn_language_id: learnLanguageId }),
      })

      const learnLang = learnLanguages.find(l => l.id === learnLanguageId)
      const langName = uiLanguage === 'de' ? (learnLang?.name_de ?? learnLang?.name) : (learnLang?.name_en ?? learnLang?.name)
      setSettings({
        uiLanguage,
        learnLanguageId,
        appIcon: learnLang?.app_icon ?? settings.appIcon,
        appTitle: `${langName} Cards`,
      })

      router.push('/')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = uiLanguage !== settings.uiLanguage || learnLanguageId !== settings.learnLanguageId

  return (
    <AppLayout>
      <AppHeader>
        <AppHeaderBar title={t('Einstellungen', 'Settings')} />
      </AppHeader>

      <AppContent>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>{t('Laden...', 'Loading...')}</div>
        ) : (
          <div className="space-y-6 fade-in">

            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('Muttersprache', 'Mother tongue')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {uiLanguages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setUiLanguage(lang.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                        background: uiLanguage === lang.id
                          ? 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.2))'
                          : 'rgba(255,255,255,0.05)',
                        outline: uiLanguage === lang.id ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>{lang.flag}</span>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: 'white', flex: 1, textAlign: 'left' }}>
                        {lang.name}
                      </span>
                      {uiLanguage === lang.id && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t('Lernsprache', 'Learning language')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {learnLanguages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setLearnLanguageId(lang.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                        background: learnLanguageId === lang.id
                          ? 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.2))'
                          : 'rgba(255,255,255,0.05)',
                        outline: learnLanguageId === lang.id ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>{lang.app_icon ?? lang.flag}</span>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: 'white', flex: 1, textAlign: 'left' }}>
                        {lang.name}
                      </span>
                      {learnLanguageId === lang.id && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

          </div>
        )}
      </AppContent>

      <AppFooter>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          style={{
            width: '100%', padding: '14px',
            background: hasChanges
              ? 'linear-gradient(135deg, #ec4899, #a855f7)'
              : 'rgba(255,255,255,0.08)',
            color: hasChanges ? 'white' : 'rgba(255,255,255,0.3)',
            border: 'none', borderRadius: '100px',
            fontWeight: '700', fontSize: '16px',
            cursor: hasChanges ? 'pointer' : 'default',
            boxShadow: hasChanges ? '0 4px 16px rgba(236,72,153,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {saving ? t('Speichern...', 'Saving...') : t('Speichern', 'Save')}
        </button>
      </AppFooter>
    </AppLayout>
  )
}
