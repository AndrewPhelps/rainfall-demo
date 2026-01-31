'use client'

import { useState, useEffect } from 'react'
import type { Asset } from '../types'

interface UseAssetResult {
  asset: Asset | null
  loading: boolean
  error: string | null
}

export function useAsset(serial: string): UseAssetResult {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAsset() {
      try {
        // Try the API first
        const res = await fetch(`/api/assets/search/${serial}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Asset not found')
        }

        setAsset(data)
      } catch {
        // Fall back to static data (for demo assets when API is blocked by Cloudflare)
        try {
          const staticRes = await fetch(`/data/${serial}.json`)
          if (staticRes.ok) {
            const staticData = await staticRes.json()
            setAsset(staticData)
            return
          }
        } catch {
          // Static fallback also failed
        }
        setError('Failed to load asset')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [serial])

  return { asset, loading, error }
}
