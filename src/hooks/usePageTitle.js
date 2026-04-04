import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} - Japanese Cards` : 'Japanese Cards'
  }, [title])
}
