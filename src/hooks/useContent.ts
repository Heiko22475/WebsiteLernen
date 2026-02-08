import { useEffect, useState } from 'react'
import type { Content } from '../content'
import { content as defaultContent } from '../content'
import { getContent } from '../lib/contentService'
import { applyTheme } from '../lib/theme'

export function useContent() {
  const [data, setData] = useState<Content>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const content = await getContent()
        if (!active) {
          return
        }
        setData(content)
        applyTheme(content.theme)
      } catch (err) {
        if (!active) {
          return
        }
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(defaultContent)
        applyTheme(defaultContent.theme)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  return { data, setData, loading, error }
}
