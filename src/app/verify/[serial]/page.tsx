'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Event {
  id: string
  title: string
  date: string
  description: string
  address: string
  location: [number, number]
  images: string[]
  video_file: string | null
  video_link: string
}

interface Asset {
  id: string
  name: string
  serial: string
  is_owner: boolean
  merchant: {
    slug: string
    name: string
    logo_light: string
    logo_dark: string | null
  }
  image_url: string
  attributes: {
    [key: string]: { name: string; value: string }
  }
  featured_event?: {
    id: string
    title: string
    description: string
  }
  events: Event[]
  verify_url: string
}

export default function VerifyPage() {
  const params = useParams()
  const serial = params.serial as string
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAsset() {
      try {
        // For demo, we'll use the mock API
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

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Verifying authenticity...</div>
      </main>
    )
  }

  if (error || !asset) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Asset Not Found</h1>
          <p className="text-gray-400">Serial: {serial}</p>
        </div>
      </main>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square md:aspect-video max-h-[500px] w-full overflow-hidden">
          <img
            src={asset.image_url}
            alt={asset.name}
            className="w-full h-full object-contain bg-gradient-to-b from-gray-900 to-black"
          />
        </div>

        {/* Verified Badge */}
        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Verified Authentic</span>
        </div>

        {/* Merchant Logo */}
        {asset.merchant.logo_light && (
          <div className="absolute top-4 right-4 bg-white rounded-lg p-2">
            <img
              src={asset.merchant.logo_light}
              alt={asset.merchant.name}
              className="h-8"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Product Info */}
        <div className="mb-8">
          <p className="text-red-500 font-semibold mb-2">{asset.merchant.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{asset.name}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>Serial: {asset.serial}</span>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
          <div className="space-y-3">
            {Object.entries(asset.attributes).map(([key, attr]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{attr.name}</span>
                <span className="text-right max-w-[60%]">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Event */}
        {asset.featured_event && (
          <div className="bg-gradient-to-r from-red-900/50 to-red-800/30 rounded-xl p-6 mb-8 border border-red-700/50">
            <h2 className="text-xl font-bold mb-3">{asset.featured_event.title}</h2>
            <div
              className="text-gray-300 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
            />
          </div>
        )}

        {/* Timeline */}
        {asset.events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6">Product Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />

              <div className="space-y-6">
                {asset.events.map((event, index) => (
                  <div key={event.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />

                    <div className="bg-gray-900 rounded-xl overflow-hidden">
                      {/* Event images */}
                      {event.images.length > 0 && (
                        <img
                          src={event.images[0]}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <div className="p-4">
                        <p className="text-red-400 text-sm mb-1">{formatDate(event.date)}</p>
                        <h3 className="font-semibold mb-2">{event.title}</h3>
                        <div
                          className="text-gray-400 text-sm prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                        {event.address && (
                          <p className="text-gray-500 text-xs mt-2">📍 {event.address}</p>
                        )}
                        {event.video_link && (
                          <a
                            href={event.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-red-400 text-sm hover:text-red-300"
                          >
                            ▶️ Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          <p>Powered by Rainfall Digital</p>
          <p className="mt-1">Authenticity verified via blockchain</p>
        </div>
      </div>
    </main>
  )
}
