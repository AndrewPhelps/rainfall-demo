'use client'

import { useParams } from 'next/navigation'
import { useAsset } from '@/shared/hooks'
import dynamic from 'next/dynamic'

// Custom loading component for Robert Glasper brand
function RobertGlasperLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .rotating-text-loading {
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />


      {/* Centered rotating badge - 270px */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[270px] h-[270px] relative flex items-center justify-center">
          {/* Rotating text around the circle */}
          <svg className="absolute w-full h-full rotating-text-loading" viewBox="0 0 100 100">
            <defs>
              <path
                id="circlePathLoading"
                d="M 50,50 m -27,0 a 27,27 0 1,1 54,0 a 27,27 0 1,1 -54,0"
              />
            </defs>
            <text fontSize="6.5" letterSpacing="4" fontWeight="800" className="uppercase fill-white" style={{ fontFamily: 'Jost, sans-serif' }}>
              <textPath href="#circlePathLoading">
                VERIFIED • AUTHENTIC •
              </textPath>
            </text>
          </svg>
          {/* Center checkmark */}
          <svg className="w-[117px] h-[117px] text-white relative z-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </main>
  )
}

// Custom loading component for Authentic (Venus Williams) brand
function AuthenticLoading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      <p className="text-2xl text-gray-400 animate-pulse" style={{ fontFamily: "'Instrument Serif', serif" }}>
        Verifying authenticity...
      </p>
    </main>
  )
}

// Custom loading component for Lexie Johnson Art brand
function LexieJohnsonArtLoading() {
  return (
    <main className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <p className="text-xs uppercase tracking-[0.15em] text-stone-400" style={{ fontFamily: 'Jost, sans-serif' }}>
        Lexie Johnson Art · Verified Authentic
      </p>
    </main>
  )
}

// Brand configuration: component + loading styles
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const brandConfig: Record<string, {
  component: React.ComponentType<any>
  loadingBg: string
  loadingText: string
  customLoading?: () => JSX.Element
}> = {
  '_default': {
    component: dynamic(() => import('@/brands/_default/VerifyPage')),
    loadingBg: 'bg-gray-50',
    loadingText: 'text-gray-500',
  },
  'mitchell-ness': {
    component: dynamic(() => import('@/brands/mitchell-ness/VerifyPage')),
    loadingBg: 'bg-gray-100',
    loadingText: 'text-gray-500',
  },
  'lexie-johnson-art': {
    component: dynamic(() => import('@/brands/lexie-johnson-art/VerifyPage')),
    loadingBg: 'bg-[#F5F5F0]',
    loadingText: 'text-stone-400',
    customLoading: LexieJohnsonArtLoading,
  },
  'authentic': {
    component: dynamic(() => import('@/brands/authentic/VerifyPage')),
    loadingBg: 'bg-white',
    loadingText: 'text-gray-500',
    customLoading: AuthenticLoading,
  },
  'robert-glasper': {
    component: dynamic(() => import('@/brands/robert-glasper/VerifyPage')),
    loadingBg: 'bg-black',
    loadingText: 'text-white',
    customLoading: RobertGlasperLoading,
  },
}

export default function BrandVerifyPage() {
  const params = useParams()
  const brand = params.brand as string
  const serial = params.serial as string
  const { asset, loading, error } = useAsset(serial)

  // Get brand config, fallback to default
  const config = brandConfig[brand] || brandConfig['_default']
  const BrandComponent = config.component

  // Show brand-specific loading state
  if (loading) {
    // Use custom loading component if available
    if (config.customLoading) {
      const CustomLoading = config.customLoading
      return <CustomLoading />
    }
    return (
      <main className={`min-h-screen ${config.loadingBg} flex items-center justify-center`}>
        <div className={`animate-pulse ${config.loadingText}`}>Verifying authenticity...</div>
      </main>
    )
  }

  // Show error state with brand styling
  if (error || !asset) {
    return (
      <main className={`min-h-screen ${config.loadingBg} flex items-center justify-center p-8`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-2 ${config.loadingText}`}>Asset Not Found</h1>
          <p className={config.loadingText}>Serial: {serial}</p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </main>
    )
  }

  // Render the brand-specific page
  return <BrandComponent asset={asset} />
}
