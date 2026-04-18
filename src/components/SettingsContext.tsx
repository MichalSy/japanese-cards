'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AppSettings {
  uiLanguage: string
  learnLanguageId: string
  appIcon: string
  appTitle: string
}

const defaultSettings: AppSettings = {
  uiLanguage: 'en',
  learnLanguageId: 'ja',
  appIcon: '🌸',
  appTitle: 'Japanese Cards',
}

const SettingsContext = createContext<{
  settings: AppSettings
  setSettings: (s: AppSettings) => void
}>({ settings: defaultSettings, setSettings: () => {} })

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
