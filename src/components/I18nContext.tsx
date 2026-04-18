'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations } from '@/lib/translations'

type Strings = Record<string, string>

const I18nContext = createContext<{
  t: (key: string, fallback?: string) => string
  setStrings: (s: Strings) => void
}>({
  t: (key, fallback) => fallback ?? key,
  setStrings: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [strings, setStrings] = useState<Strings>(translations.en)
  const t = (key: string, fallback?: string) => strings[key] ?? fallback ?? key
  return <I18nContext.Provider value={{ t, setStrings }}>{children}</I18nContext.Provider>
}

export const useT = () => useContext(I18nContext).t
export const useSetStrings = () => useContext(I18nContext).setStrings
