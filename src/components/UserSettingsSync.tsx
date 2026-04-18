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

  // On login: load settings + translations from backend (one request, no params needed)
  useEffect(() => {
    if (!user?.id) return
    if (fetchedForUserRef.current === user.id) return
    fetchedForUserRef.current = user.id

    fetch('/api/i18n')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        if (data.ui_language && data.ui_language !== language) setLanguage(data.ui_language)
        prevLangRef.current = data.ui_language ?? language
        if (data.strings) setStrings(data.strings)

        const lang = data.learn_language ?? {}
        setSettings({
          uiLanguage: data.ui_language ?? 'en',
          learnLanguageId: data.learn_language_id ?? 'ja',
          appIcon: lang.app_icon ?? '🌸',
          appTitle: `${lang.name_en ?? 'Japanese'} Cards`,
        })
      })
      .catch(() => {})
  }, [user?.id])

  // When language changes (e.g. set by settings page): save to DB only
  // Translations are reloaded by the settings page via /api/i18n after saving
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
