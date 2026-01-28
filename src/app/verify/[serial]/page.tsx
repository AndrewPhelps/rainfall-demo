'use client'

import { useParams } from 'next/navigation'
import { useAsset } from '@/shared/hooks'
import { resolveBrand } from '@/config/brand-registry'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

// Dynamic imports for each brand's VerifyPage
const brandComponents: Record<string, ReturnType<typeof dynamic>> = {
  '_default': dynamic(() => import('@/brands/_default/VerifyPage')),
  'mitchell-ness': dynamic(() => import('@/brands/mitchell-ness/VerifyPage')),
  'lexie-johnson-art': dynamic(() => import('@/brands/lexie-johnson-art/VerifyPage')),
  'authentic': dynamic(() => import('@/brands/authentic/VerifyPage')),
  'robert-glasper': dynamic(() => import('@/brands/robert-glasper/VerifyPage')),
}

export default function VerifyRouter() {
  const params = useParams()
  const serial = params.serial as string
  const { asset, loading, error } = useAsset(serial)

  // Resolve which brand component to use
  const brandSlug = useMemo(() => {
    if (!asset) return '_default'
    return resolveBrand(asset.merchant.slug)
  }, [asset])

  const BrandVerifyPage = brandComponents[brandSlug] || brandComponents['_default']

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Verifying authenticity...</div>
      </main>
    )
  }

  // Show error state
  if (error || !asset) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Asset Not Found</h1>
          <p className="text-gray-600">Serial: {serial}</p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </main>
    )
  }

  // Render the brand-specific page
  return <BrandVerifyPage asset={asset} />
}
