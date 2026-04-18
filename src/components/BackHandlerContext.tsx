'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

type Handler = (() => void) | null

const BackHandlerContext = createContext<{
  handler: Handler
  setHandler: (fn: Handler) => void
}>({ handler: null, setHandler: () => {} })

export function BackHandlerProvider({ children }: { children: ReactNode }) {
  const [handler, setHandler] = useState<Handler>(null)
  return (
    <BackHandlerContext.Provider value={{ handler, setHandler }}>
      {children}
    </BackHandlerContext.Provider>
  )
}

export const useBackHandler = () => useContext(BackHandlerContext).handler

/** Register a back handler while the component is mounted. Pass null to clear. */
export function useSetBackHandler(fn: Handler) {
  const { setHandler } = useContext(BackHandlerContext)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (fn) setHandler(() => fnRef.current?.())
    else setHandler(null)
    return () => setHandler(null)
  }, [!!fn])
}
