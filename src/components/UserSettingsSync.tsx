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
        setSettings({
          uiLanguage: uiLang,
          learnLanguageId: data.learn_language_id ?? 'ja',
          appIcon: lang.app_icon ?? '🌸',
          appTitle: `${lang.name_en ?? 'Japanese'} Cards`,
        })
      })
      .catch(() => {})
  }, [user?.id])

  // Save language changes to DB — skipped if settings page already saved (prevLangRef stays in sync)
  useEffect(() => {
    if (!user?.id || !fetchedForUserRef.current) return
    if (language === prevLangRef.current) return
    prevLangRef.current = language  // update first so settings page save doesn't cause re-fire

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ui_language: language }),
    }).catch(() => {})
  }, [user?.id, language])

  return null
}
