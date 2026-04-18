'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

type Handler = () => void

const BackHandlerContext = createContext<{
  handler: Handler | null
  setHandler: (fn: Handler | null) => void
}>({ handler: null, setHandler: () => {} })

export function BackHandlerProvider({ children }: { children: ReactNode }) {
  const [handler, setHandler] = useState<Handler | null>(null)
  return (
    <BackHandlerContext.Provider value={{ handler, setHandler }}>
      {children}
    </BackHandlerContext.Provider>
  )
}

export const useBackHandler = () => useContext(BackHandlerContext).handler

/** Register a back handler on mount, auto-clears on unmount. */
export function useSetBackHandler(fn: Handler) {
  const { setHandler } = useContext(BackHandlerContext)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    const wrapped = () => fnRef.current()
    setHandler(() => wrapped)  // double-wrap: outer fn is the updater, returns wrapped as new state
    return () => setHandler(null)
  }, [])
}
