'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { useSettings } from '@/components/SettingsContext'
import { useT, useSetStrings } from '@/components/I18nContext'
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

function ResetModal({ onClose, onConfirm, resetting, t }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'linear-gradient(180deg, rgba(28,16,60,0.98) 0%, rgba(12,8,34,0.99) 100%)', borderRadius: '20px 20px 0 0', border: '1px solid rgba(255,255,255,0.12)', padding: '0 0 env(safe-area-inset-bottom, 20px)', transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>{t('settings.resetProgress')}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{t('settings.resetConfirm')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleClose} style={{ flex: 1, padding: '13px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '15px' }}>
              {t('settings.resetProgress').startsWith('Reset') ? 'Cancel' : 'Abbrechen'}
            </button>
            <button disabled={resetting} onClick={onConfirm} style={{ flex: 1, padding: '13px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: resetting ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.85)', color: 'white', fontWeight: '700', fontSize: '15px', transition: 'all 0.2s' }}>
              {resetting ? '...' : t('settings.resetConfirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  const [showReset, setShowReset] = useState(false)
  const [resetting, setResetting] = useState(false)

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
      const i18nData = await fetch('/api/i18n').then(r => r.ok ? r.json() : null)
      if (i18nData?.strings) setStrings(i18nData.strings)
      const learnLang = learnLanguages.find(l => l.id === learnLanguageId)
      setLanguage(uiLanguage)
      setSettings({ uiLanguage, learnLanguageId, appIcon: learnLang?.app_icon ?? settings.appIcon, appTitle: `${learnLang?.name_en ?? learnLang?.name ?? 'Japanese'} Cards` })
      router.push('/')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    await fetch('/api/progress/reset', { method: 'DELETE' }).catch(() => {})
    setResetting(false)
    setShowReset(false)
    router.push('/')
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

            <Card>
              <button onClick={() => setShowReset(true)} style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#ef4444' }}>{t('settings.resetProgress')}</span>
              </button>
            </Card>
          </div>
        )}
      </AppContent>

      <AppFooter>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button onClick={handleSave} disabled={!hasChanges || saving}
            style={{ width: '100%', padding: '14px', background: hasChanges ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(255,255,255,0.08)', color: hasChanges ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '16px', cursor: hasChanges ? 'pointer' : 'default', boxShadow: hasChanges ? '0 4px 16px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s' }}>
            {saving ? t('saving') : t('save')}
          </button>
          {process.env.NEXT_PUBLIC_APP_VERSION && (
            <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
              v{process.env.NEXT_PUBLIC_APP_VERSION}
              {process.env.NEXT_PUBLIC_APP_VERSION_DATE && ` (${process.env.NEXT_PUBLIC_APP_VERSION_DATE})`}
            </p>
          )}
        </div>
      </AppFooter>

      {showReset && <ResetModal onClose={() => setShowReset(false)} onConfirm={handleReset} resetting={resetting} t={t} />}
    </AppLayout>
  )
}
