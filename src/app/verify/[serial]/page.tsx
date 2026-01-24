'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)

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
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="animate-pulse text-xl">Verifying authenticity...</div>
      </main>
    )
  }

  if (error || !asset) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Asset Not Found</h1>
          <p className="text-gray-600">Serial: {serial}</p>
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
    <main className="min-h-screen bg-gray-100 text-black md:py-4">
      <div className="md:max-w-2xl md:mx-auto bg-white md:shadow-lg md:rounded-2xl md:pt-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-8 py-3 flex items-center justify-between">
        <img
          src="https://www.mitchellandness.com/content/assets/__0-312089732270.3597.svg"
          alt="Mitchell & Ness"
          className="h-12"
        />
        <div className="bg-black text-white px-1.5 py-1 flex items-center gap-1.5 text-xs rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="uppercase tracking-widest font-semibold">Authentic</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square md:aspect-video max-h-[350px] w-full overflow-hidden">
          <img
            src={asset.image_url}
            alt={asset.name}
            className="w-full h-full object-contain bg-white"
          />
        </div>


      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Product Info */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{asset.name}</h1>

          {/* Accordion */}
          <div className="border border-gray-200 rounded-none overflow-hidden">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full bg-white text-black px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold uppercase tracking-wide">Serial: {asset.serial}</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${detailsOpen ? 'rotate-45' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {detailsOpen && (
              <div className="bg-white p-6 pt-3">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(asset.attributes).map(([key, attr]) => (
                      <tr key={key} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 pr-8 text-gray-600 align-top">{attr.name}</td>
                        <td className="py-2 text-left">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        {asset.events.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-6">
                {asset.events.map((event, index) => (
                  <div key={event.id} className="relative pl-14">
                    {/* Timeline dot, date and location */}
                    <div className="flex items-center mb-2">
                      <div className="absolute left-[19px] w-3 h-3 bg-black rounded-full" />
                      <div>
                        <p className="text-black text-sm font-medium">{formatDate(event.date)}</p>
                        {event.address && (
                          <p className="text-gray-500 text-xs">{event.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-none overflow-hidden border border-gray-200">
                      {/* Event images */}
                      {event.images.length > 0 && (
                        <img
                          src={event.images[0]}
                          alt={event.title}
                          className="w-full object-contain"
                        />
                      )}

                      <button
                        onClick={() => setExpandedEvents(prev => ({ ...prev, [event.id]: !prev[event.id] }))}
                        className="w-full bg-white text-black px-4 py-3 flex items-center justify-between border-t border-gray-200"
                      >
                        <h3 className="text-sm font-bold text-left pr-4">{event.title}</h3>
                        <svg
                          className={`w-5 h-5 transition-transform ${expandedEvents[event.id] ? 'rotate-45' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      {expandedEvents[event.id] && (
                        <div className="p-4 border-t border-gray-200">
                          <div
                            className="text-gray-600 text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                          />
                          {event.video_link && (
                            <a
                              href={event.video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-red-600 text-sm hover:text-red-500"
                            >
                              ▶️ Watch Video
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pt-2 pb-12">
          <p>Powered by Rainfall Digital</p>
          <p className="mt-0.5">Authenticity verified via blockchain</p>
        </div>
      </div>
      </div>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Unified CTA Button / Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:max-w-2xl md:mx-auto transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-y-0' : ''
        }`}
      >
        {/* Drawer Content - slides up when open */}
        <div
          className={`bg-white overflow-hidden transition-all duration-300 ease-out rounded-t-xl ${
            drawerOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6 pt-6 space-y-4">
            <a href="#" className="block text-sm text-gray-700 hover:text-black">
              <span className="mr-2">🛍️</span>
              <span className="font-medium">Shop the MJ Collection</span> – Own all of the iconic Michael Jordan Authentic merch
            </a>
            <a href="#" className="block text-sm text-gray-700 hover:text-black">
              <span className="mr-2">🎥</span>
              <span className="font-medium">Watch Jordan's '96 Highlights</span> – Relive peak MJ moments from the record-breaking season
            </a>
            <a href="#" className="block text-sm text-gray-700 hover:text-black">
              <span className="mr-2">📸</span>
              <span className="font-medium">Follow the Bulls on Instagram</span> – See how fans honor greatness then and now
            </a>
            <a href="#" className="block text-sm text-gray-700 hover:text-black">
              <span className="mr-2">🎟️</span>
              <span className="font-medium">Visit the United Center</span> – Experience the house that MJ built, live in Chicago
            </a>
            <a href="#" className="block text-sm text-gray-700 hover:text-black">
              <span className="mr-2">❤️</span>
              <span className="font-medium">Support the Bulls Youth Hoops Program</span> – Give back and inspire the next generation of legends
            </a>
          </div>
        </div>

        {/* CTA Button - always visible, toggles drawer */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`w-full bg-black text-white py-5 px-6 text-sm font-bold uppercase tracking-wide flex items-center justify-between ${
            drawerOpen ? '' : 'rounded-t-xl'
          }`}
        >
          <span className="text-left">🏀 RELIVE THE LEGACY OF MJ & THE '96 BULLS</span>
          {drawerOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
    </main>
  )
}
