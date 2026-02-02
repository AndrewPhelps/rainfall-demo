'use client'

import { useState, useEffect } from 'react'
import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

export default function AuthenticVerifyPage({ asset }: VerifyPageProps) {
  // Asset image first, then all event images
  const allImages = [
    { src: asset.image_url, eventTitle: asset.name },
    ...asset.events.flatMap(event =>
      event.images.map(img => ({ src: img, eventTitle: event.title }))
    ),
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [openEvents, setOpenEvents] = useState<Record<string, boolean>>({})
  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % allImages.length
        setPreviousSlide(prev)
        setTimeout(() => setPreviousSlide(null), 500)
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [allImages.length])

  return (
    <main className="min-h-screen bg-white text-[#15191d] max-w-2xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        .font-heading { font-family: 'Instrument Serif', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0;
          animation: fadeUp 0.7s ease-out forwards;
        }
        @keyframes slideFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .slide-fade-in {
          animation: slideFadeIn 0.5s ease-out forwards;
        }
      `}</style>

      {/* Fixed slideshow background - capped at 570px */}
      <div className="fixed top-0 left-0 right-0 max-w-2xl mx-auto" style={{ height: '570px', maxHeight: '70vh' }}>
        {/* Previous image (stays visible underneath during fade) */}
        {previousSlide !== null && (
          <img
            src={allImages[previousSlide].src}
            alt={allImages[previousSlide].eventTitle}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        )}
        {/* Current image (fades in on top) */}
        <img
          key={currentSlide}
          src={allImages[currentSlide].src}
          alt={allImages[currentSlide].eventTitle}
          className={`absolute inset-0 w-full h-full object-cover ${previousSlide !== null ? 'slide-fade-in' : ''}`}
          draggable={false}
        />

        {/* Bottom gradient fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

      </div>

      {/* Scrollable content card overlapping bottom of slideshow */}
      <div className="relative z-10 font-body" style={{ paddingTop: 'min(510px, calc(70vh - 60px))' }}>
        <div className="mx-4 bg-white shadow-2xl anim-fade-up">
          <div className="px-6 pt-8 pb-6">
            {/* Title */}
            <h1 className="font-heading text-3xl mb-6 text-center">{asset.name}</h1>

            {/* Attributes */}
            {Object.keys(asset.attributes).length > 0 && (
              <div className="border border-[#dddddd] mb-4">
                {/* Verified Authentic row first */}
                <div className="flex justify-between items-center p-4 border-b border-[#dddddd]">
                  <span className="text-xs uppercase tracking-[0.15em] text-gray-400">Verified Authentic</span>
                  <span className="text-sm">{asset.serial}</span>
                </div>
                {Object.entries(asset.attributes).map(([key, attr], i, arr) => (
                  <div
                    key={key}
                    className={`flex justify-between items-center p-4 ${i < arr.length - 1 ? 'border-b border-[#dddddd]' : ''}`}
                  >
                    <span className="text-xs uppercase tracking-[0.15em] text-gray-400">{attr.name}</span>
                    <span className="text-sm">{attr.value}</span>
                  </div>
                ))}
                {/* Photography Details accordion */}
                {asset.events.length > 0 && (
                  <>
                    <button
                      onClick={() => setOpenEvents(prev => ({ ...prev, photography: !prev.photography }))}
                      className="w-full flex justify-between items-center p-4 border-t border-[#dddddd]"
                    >
                      <span className="text-xs uppercase tracking-[0.15em] text-gray-400">Photography Details</span>
                      <svg
                        className={`w-5 h-5 text-[#15191d] transition-transform duration-300 ${openEvents.photography ? 'rotate-45' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                    {openEvents.photography && (
                      <div className="px-4 pb-4 space-y-3">
                        {asset.events.map(event => (
                          <div key={event.id} className="bg-[#f5f5f5] p-4">
                            {event.description && (
                              <div
                                className="text-sm text-gray-600 leading-relaxed [&_a]:text-[#15191d] [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-2 last:[&_p]:mb-0 mb-2"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                              />
                            )}
                            <p className="text-xs text-gray-400">
                              {event.title} · {formatDate(event.date)}{event.address ? ` · ${event.address}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Dark section */}
        <div className="mx-4 bg-[#15191d] text-white shadow-2xl">
          <div className="px-6 pt-8 pb-6">
            {/* Featured Event */}
            {asset.featured_event && (
              <div className="mb-8 text-center">
                <h2 className="font-heading text-2xl mb-0.5">{asset.featured_event.title}</h2>
                <div
                  className="text-sm text-gray-300 leading-relaxed [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
                />
              </div>
            )}

            {/* CTA buttons */}
            {asset.call_to_action && asset.call_to_action.length > 0 && (
              <div className="mb-8">
                {asset.call_to_action.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 border border-white text-white text-sm uppercase tracking-[0.2em] text-center transition-colors hover:bg-white hover:text-[#15191d]"
                  >
                    {cta.text}
                  </a>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-500 text-xs py-6 border-t border-[#272B2F]">
              <p>Powered by Rainfall</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
