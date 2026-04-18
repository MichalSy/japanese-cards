'use client'

import { useEffect, useRef } from 'react'
import { useAuth, useLanguage } from '@michalsy/aiko-webapp-core'
import { useSettings } from '@/components/SettingsContext'
import { useSetStrings } from '@/components/I18nContext'

export default function UserSettingsSync() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { setSettings } = useSettings()
  const setStrings = useSetStrings()
  const fetchedForUserRef = useRef<string | null>(null)
  const prevLangRef = useRef(language)

  useEffect(() => {
    if (!user?.id) return
    if (fetchedForUserRef.current === user.id) return
    fetchedForUserRef.current = user.id

    Promise.all([
      fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/i18n').then((r) => (r.ok ? r.json() : null)),
    ]).then(([settingsData, i18nData]) => {
      if (settingsData) {
        if (settingsData.ui_language && settingsData.ui_language !== language)
          setLanguage(settingsData.ui_language)
        prevLangRef.current = settingsData.ui_language ?? language

        const lang = settingsData.learn_language ?? {}
        const uiLang = settingsData.ui_language ?? 'en'
        setSettings({
          uiLanguage: uiLang,
          learnLanguageId: settingsData.learn_language_id ?? 'ja',
          appIcon: lang.app_icon ?? '🌸',
          appTitle: `${lang.name_en ?? 'Japanese'} Cards`,
        })
      }
      if (i18nData) setStrings(i18nData)
    }).catch(() => {})
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !fetchedForUserRef.current) return
    if (language === prevLangRef.current) return
    prevLangRef.current = language

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ui_language: language }),
    }).catch(() => {})
  }, [user?.id, language])

  return null
}
