'use client'

import { useEffect, useRef } from 'react'
import { useAuth, useLanguage } from '@michalsy/aiko-webapp-core'

export default function UserSettingsSync() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const initializedRef = useRef(false)
  const prevLangRef = useRef(language)

  useEffect(() => {
    if (!user) { initializedRef.current = false; return }
    if (initializedRef.current) return

    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.ui_language && data.ui_language !== language) {
          setLanguage(data.ui_language)
        }
        initializedRef.current = true
        prevLangRef.current = data?.ui_language ?? language
      })
      .catch(() => { initializedRef.current = true })
  }, [user])

  useEffect(() => {
    if (!user || !initializedRef.current) return
    if (language === prevLangRef.current) return
    prevLangRef.current = language

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ui_language: language }),
    }).catch(() => {})
  }, [user, language])

  return null
}
