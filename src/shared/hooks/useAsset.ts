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
        const res = await fetch(`/api/assets/search/${serial}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Asset not found')
        }

        setAsset(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [serial])

  return { asset, loading, error }
}
