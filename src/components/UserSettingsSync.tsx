'use client'

import { useEffect, useRef } from 'react'
import { useAuth, useLanguage } from '@michalsy/aiko-webapp-core'
import { useSettings } from '@/components/SettingsContext'

export default function UserSettingsSync() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { setSettings } = useSettings()
  const initializedRef = useRef(false)
  const prevLangRef = useRef(language)

  useEffect(() => {
    if (!user) { initializedRef.current = false; return }
    if (initializedRef.current) return

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

        initializedRef.current = true
      })
      .catch(() => { initializedRef.current = true })
  }, [user])

  return null
}
