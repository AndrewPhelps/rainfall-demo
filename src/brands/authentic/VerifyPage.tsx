'use client'

import { useState, useEffect, useRef } from 'react'
import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Signature draw duration and timing constants
const CARD_ANIM_MS = 700
const DRAW_MS = 4500
const HOLD_MS = 1000
const FADE_MS = 500

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
  const [signaturePhase, setSignaturePhase] = useState<'waiting' | 'drawing' | 'holding' | 'fading' | 'done'>('waiting')
  const slideshowStarted = useRef(false)

  // Signature animation sequence
  useEffect(() => {
    // After card finishes animating, start drawing
    const drawTimer = setTimeout(() => setSignaturePhase('drawing'), CARD_ANIM_MS)
    // After drawing completes, hold
    const holdTimer = setTimeout(() => setSignaturePhase('holding'), CARD_ANIM_MS + DRAW_MS)
    // After hold, start fading
    const fadeTimer = setTimeout(() => setSignaturePhase('fading'), CARD_ANIM_MS + DRAW_MS + HOLD_MS)
    // After fade completes, mark done and advance to slide 2
    const doneTimer = setTimeout(() => {
      setSignaturePhase('done')
      setCurrentSlide(prev => {
        const next = (prev + 1) % allImages.length
        setPreviousSlide(prev)
        setTimeout(() => setPreviousSlide(null), FADE_MS)
        return next
      })
      slideshowStarted.current = true
    }, CARD_ANIM_MS + DRAW_MS + HOLD_MS + FADE_MS)

    return () => {
      clearTimeout(drawTimer)
      clearTimeout(holdTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance slideshow every 4 seconds (only after signature sequence)
  useEffect(() => {
    if (!slideshowStarted.current) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % allImages.length
        setPreviousSlide(prev)
        setTimeout(() => setPreviousSlide(null), FADE_MS)
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [allImages.length, signaturePhase])

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
        @keyframes drawSignature {
          from { stroke-dashoffset: var(--path-length); }
          to { stroke-dashoffset: 0; }
        }
        .signature-path {
          fill: none;
          stroke: white;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: var(--path-length);
          stroke-dashoffset: var(--path-length);
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }
        .signature-drawing .signature-path-1 {
          animation: drawSignature 1.5s ease-in-out forwards;
        }
        .signature-drawing .signature-path-2 {
          animation: drawSignature 3s ease-in-out 1.5s forwards;
        }
        .signature-fading {
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
      `}</style>

      {/* Fixed slideshow background - capped at 570px */}
      <div className="fixed top-0 left-0 right-0 max-w-2xl mx-auto" style={{ height: '570px', maxHeight: '70vh' }}>
        {/* Wilson logo */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
          <img
            src="https://www.wilson.com/icons/logo-black.svg"
            alt="Wilson"
            className="h-6 invert drop-shadow-lg"
          />
        </div>

        {/* Top gradient fade from black */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent z-10" />

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

        {/* Venus Williams signature overlay */}
        {(
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10`} style={{ marginTop: '-40px' }}>
            <svg
              className={signaturePhase !== 'waiting' ? 'signature-drawing' : ''}
              viewBox="0 0 468.88 401.17"
              style={{ width: '80%', maxWidth: '420px' }}
            >
              <path
                className="signature-path signature-path-1"
                style={{ '--path-length': '1600' } as React.CSSProperties}
                d="M48.78,185.39s60.13-58.86,120.25-25.32-55.7,157.59-83.54,183.54c0,0-64.56,60.06-82.91,56.93S89.92,222.1,219.67,110.71C349.41-.68,413.34,1.85,413.34,1.85c0,0,43.74-9.29,53.8,20.89s-44.94,69.62-44.94,69.62"
              />
              <path
                className="signature-path signature-path-2"
                style={{ '--path-length': '1800' } as React.CSSProperties}
                d="M158.28,217.04s-1.9,28.48,25.32,9.49,16.11-25.95,16.11-25.95c0,0-7.6-5.25-5.94,21.67,0,0-.33,18.17,23.61-17.34,0,0,2.48-1.32,1.65,3.47,0,0-2.31,13.71,7.1,4.79l5.78-6.44s2.15-2.48,1.57.66.97,2.39.97,2.39c0,0,1.51-.25,2.08-.83s10.32-8.79,10.32-8.79c0,0,.66-.13.74,1.03s.83,5.7,2.23,5.78,10.82-8.93,10.82-8.93c0,0,1.32-1.06.33,1.91s.37,3.14.37,3.14c0,0,.79.25,1.53-.17s6.85-6.19,6.85-6.19c0,0,1.24-1.24,1.49,0s-1.57,5.45-1.57,5.45c0,0-1.16,2.81,2.31.99s7.76-5.13,7.76-5.13c0,0,.58-.65,1.16.75s4.54,1.73,5.94,1.16,20.23-6.36,29.23-18.17-20.89,9.5-20.89,9.5c0,0-11.56,7.02,4.05,8.01s75.44,10.84,101.2,39.03,5.72,41.17,5.72,41.17c0,0-30.17,32.37-99.52,35.01s-55.27-38.53-55.27-38.53c0,0,1.98-13.87,26.86-44.04s108.55-103.49,108.55-103.49c0,0,26.2-21.8,17.17-31.71s-100.18,22.02-100.18,22.02"
              />
            </svg>
          </div>
        )}

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
