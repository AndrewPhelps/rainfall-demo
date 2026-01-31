'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAsset } from '@/shared/hooks'
import { resolveBrand } from '@/config/brand-registry'
import { useEffect } from 'react'

// Legacy route: fetches asset to determine brand, then redirects to /verify/[brand]/[serial]
// Handles URLs like /verify/VBDhQ9CCrbKubHih4idd6U (catch-all [...legacy] route)
export default function LegacyVerifyRedirect() {
  const params = useParams()
  const router = useRouter()
  // Catch-all route gives us an array, take the first segment as the serial
  const legacyParams = params.legacy as string[]
  const serial = legacyParams?.[0] || ''
  const { asset, loading, error } = useAsset(serial)

  useEffect(() => {
    if (asset) {
      const brand = resolveBrand(asset.merchant.slug)
      router.replace(`/verify/${brand}/${serial}`)
    }
  }, [asset, serial, router])

  // Show neutral dark loading during redirect lookup
  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </main>
    )
  }

  // Show error if asset not found
  if (error || !asset) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Asset Not Found</h1>
          <p className="text-white/50">Serial: {serial}</p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </main>
    )
  }

  // Redirecting...
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-white/50">Redirecting...</div>
    </main>
  )
}
