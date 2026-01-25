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
  const [visibleImages, setVisibleImages] = useState<Record<string, boolean>>({})
  const [visibleEvents, setVisibleEvents] = useState<Record<string, boolean>>({})
  const [progressHeight, setProgressHeight] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({})

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

  // Calculate progress line height when events become visible
  useEffect(() => {
    if (!asset || !timelineRef.current) return

    // Find the last visible event
    const lastVisibleIndex = asset.events.reduce((lastIdx, event, idx) =>
      visibleEvents[event.id] ? idx : lastIdx, -1)

    if (lastVisibleIndex === -1) {
      setProgressHeight(0)
      return
    }

    const lastVisibleEvent = asset.events[lastVisibleIndex]
    const eventEl = eventRefs.current[lastVisibleEvent.id]

    if (eventEl && timelineRef.current) {
      const timelineRect = timelineRef.current.getBoundingClientRect()
      const eventRect = eventEl.getBoundingClientRect()
      // Add 6px to reach center of the dot (dot is 12px, so center is 6px from top)
      setProgressHeight(eventRect.top - timelineRect.top + 6)
    }
  }, [visibleEvents, asset])

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
      <div className="max-w-2xl mx-auto px-8 py-4 flex items-center justify-center">
        <img
          src="https://www.mitchellandness.com/content/assets/__0-312089732270.3597.svg"
          alt="Mitchell & Ness"
          className="h-16"
        />
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
          {/* Title Box */}
          <div className="bg-white border border-gray-200 border-b-0 px-4 py-4">
            <h1 className="text-xl md:text-2xl font-bold">{asset.name}</h1>
          </div>

          {/* Accordion */}
          <div className="border border-gray-200 rounded-none overflow-hidden">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full bg-white text-black px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="bg-black text-white px-2 py-1 flex items-center gap-1.5 text-xs rounded-full">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="uppercase tracking-widest font-semibold">Authentic</span>
                </div>
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
            <div className="relative" ref={timelineRef}>
              {/* Timeline background line (dashed) */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300" />

              {/* Timeline progress line (solid) */}
              <div
                className="absolute left-6 top-0 w-0.5 bg-black transition-all duration-700 ease-out"
                style={{ height: progressHeight }}
              />

              <div className="space-y-6">
                {asset.events.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative pl-14"
                    ref={(el) => {
                      // Store ref for progress height calculation
                      eventRefs.current[event.id] = el

                      if (el && !visibleEvents[event.id]) {
                        const observer = new IntersectionObserver(
                          ([entry]) => {
                            if (entry.isIntersecting) {
                              setVisibleEvents(prev => ({ ...prev, [event.id]: true }))
                              observer.disconnect()
                            }
                          },
                          { threshold: 0.2 }
                        )
                        observer.observe(el)
                      }
                    }}
                  >
                    {/* Timeline dot - appears immediately in place */}
                    <div className={`absolute left-[19px] w-3 h-3 bg-black rounded-full transition-opacity duration-300 ${
                      visibleEvents[event.id] ? 'opacity-100' : 'opacity-0'
                    }`} />

                    {/* Content that slides in */}
                    <div className={`transition-all duration-700 ease-out ${
                      visibleEvents[event.id] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}>
                    {/* Date and location */}
                    <div className="flex items-center mb-2">
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
                        <div
                          ref={(el) => {
                            if (el && !visibleImages[event.id]) {
                              const observer = new IntersectionObserver(
                                ([entry]) => {
                                  if (entry.isIntersecting) {
                                    setVisibleImages(prev => ({ ...prev, [event.id]: true }))
                                    observer.disconnect()
                                  }
                                },
                                { threshold: 0.7, rootMargin: '-50px 0px' }
                              )
                              observer.observe(el)
                            }
                          }}
                        >
                          <img
                            src={event.images[0]}
                            alt={event.title}
                            className={`w-full object-contain transition-all duration-700 ease-out ${
                              visibleImages[event.id] ? 'grayscale-0' : 'grayscale'
                            }`}
                          />
                        </div>
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pt-2 pb-28">
          <p>Powered by Rainfall Digital</p>
          <p className="mt-0.5">Authenticity verified via blockchain</p>
        </div>
      </div>
      </div>

      {/* Modal Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Modal Card - appears above button */}
      <div
        className={`fixed bottom-24 left-4 right-4 z-50 md:max-w-2xl md:mx-auto transition-all duration-300 ease-out ${
          drawerOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 space-y-4">
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
      </div>

      {/* CTA Button - always visible, toggles modal */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:max-w-2xl md:mx-auto">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full bg-black text-white py-5 px-6 text-sm font-bold uppercase tracking-wide flex items-center justify-between rounded-full"
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
