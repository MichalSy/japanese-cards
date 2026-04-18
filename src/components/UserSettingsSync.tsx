'use client'

import { useEffect, useRef } from 'react'
import { useAuth, useLanguage } from '@michalsy/aiko-webapp-core'
import { useSettings } from '@/components/SettingsContext'

export default function UserSettingsSync() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { setSettings } = useSettings()
  // Track by user ID — prevents duplicate fetches when auth fires multiple state updates
  const fetchedForUserRef = useRef<string | null>(null)
  const prevLangRef = useRef(language)

  useEffect(() => {
    if (!user?.id) return
    if (fetchedForUserRef.current === user.id) return
    // Set synchronously before the async fetch so concurrent effect runs don't race
    fetchedForUserRef.current = user.id

    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        if (data.ui_language && data.ui_language !== language) setLanguage(data.ui_language)
        prevLangRef.current = data.ui_language ?? language

        const lang = data.learn_language ?? {}
        const uiLang = data.ui_language ?? 'en'
        const langName = uiLang === 'de' ? (lang.name_de ?? 'Japanese') : (lang.name_en ?? 'Japanese')
        setSettings({
          uiLanguage: uiLang,
          learnLanguageId: data.learn_language_id ?? 'ja',
          appIcon: lang.app_icon ?? '🌸',
          appTitle: `${langName} Cards`,
        })
      })
      .catch(() => {})
  }, [user?.id])

  // Save language changes to DB when user manually switches
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
