'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Art gallery aesthetic with Jost typography
export default function LexieJohnsonArtVerifyPage({ asset }: VerifyPageProps) {
  const [view, setView] = useState<'details' | 'story'>('details')
  const [viewKey, setViewKey] = useState(0)
  const [currentEvent, setCurrentEvent] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  // Swipe state
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchDelta = useRef(0)
  const swipeDirection = useRef<'horizontal' | 'vertical' | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reverse events so newest progress is first
  const reversedEvents = [...asset.events].reverse()

  // Autoplay videos on mute when they become visible
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          }
        })
      },
      { threshold: 0.5 }
    )

    Object.values(videoRefs.current).forEach((video) => {
      if (video) videoObserver.observe(video)
    })

    return () => videoObserver.disconnect()
  }, [reversedEvents, view, currentEvent])

  // Swipe handlers for story view
  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= reversedEvents.length || isAnimating) return
    setIsAnimating(true)
    setSwipeOffset(0)
    setSlideDirection(index > currentEvent ? 'left' : 'right')
    setCurrentEvent(index)
    setTimeout(() => setIsAnimating(false), 350)
  }, [reversedEvents.length, isAnimating, currentEvent])

  const resetSwipe = useCallback(() => {
    touchStart.current = null
    touchDelta.current = 0
    swipeDirection.current = null
  }, [])

  const resolveSwipe = useCallback(() => {
    const delta = touchDelta.current
    const threshold = 50

    if (delta < -threshold && currentEvent < reversedEvents.length - 1) {
      goTo(currentEvent + 1)
    } else if (delta > threshold && currentEvent > 0) {
      goTo(currentEvent - 1)
    } else {
      setSwipeOffset(0)
    }
    resetSwipe()
  }, [currentEvent, reversedEvents.length, goTo, resetSwipe])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    touchDelta.current = 0
    swipeDirection.current = null
  }, [isAnimating])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || isAnimating) return
    const deltaX = e.touches[0].clientX - touchStart.current.x
    const deltaY = e.touches[0].clientY - touchStart.current.y

    if (!swipeDirection.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      swipeDirection.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }

    if (swipeDirection.current !== 'horizontal') return

    e.preventDefault()
    touchDelta.current = deltaX
    const atEdge = (currentEvent === 0 && deltaX > 0) || (currentEvent === reversedEvents.length - 1 && deltaX < 0)
    setSwipeOffset(deltaX * (atEdge ? 0.2 : 1))
  }, [isAnimating, currentEvent, reversedEvents.length])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current) return
    resolveSwipe()
  }, [resolveSwipe])

  // Mouse drag handlers for desktop
  const isDragging = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAnimating) return
    isDragging.current = true
    touchStart.current = { x: e.clientX, y: e.clientY }
    touchDelta.current = 0
    swipeDirection.current = null
  }, [isAnimating])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !touchStart.current || isAnimating) return
    const deltaX = e.clientX - touchStart.current.x
    const deltaY = e.clientY - touchStart.current.y

    if (!swipeDirection.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      swipeDirection.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }

    if (swipeDirection.current !== 'horizontal') return

    touchDelta.current = deltaX
    const atEdge = (currentEvent === 0 && deltaX > 0) || (currentEvent === reversedEvents.length - 1 && deltaX < 0)
    setSwipeOffset(deltaX * (atEdge ? 0.2 : 1))
  }, [isAnimating, currentEvent, reversedEvents.length])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    resolveSwipe()
  }, [resolveSwipe])

  const event = reversedEvents[currentEvent]

  return (
    <main className="min-h-screen bg-[#F5F5F0] text-stone-900">
      {/* Jost font + single animation system */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');
        .font-jost { font-family: 'Jost', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0;
          animation: fadeUp 0.7s ease-out forwards;
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-from-left {
          animation: slideFromLeft 0.3s ease-out forwards;
        }
        .slide-from-right {
          animation: slideFromRight 0.3s ease-out forwards;
        }
        @keyframes greenFade {
          0% { color: #16a34a; }
          100% { color: #a8a29e; }
        }
        .anim-green-fade {
          animation: greenFade 0.6s ease-out 1s forwards;
          color: #16a34a;
        }
      `}</style>

      {view === 'details' ? (
        /* ===== ASSET DETAILS VIEW ===== */
        <div key={viewKey} className="max-w-3xl mx-auto px-6 font-jost anim-fade-up" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          {/* Artwork */}
          <div>
            <img
              src={asset.image_url}
              alt={asset.name}
              className="w-full h-auto shadow-2xl"
            />
          </div>

          {/* Auth box + Attributes table */}
          <div className="mt-6 mb-4 border border-stone-300">
            {/* Title + Auth verification row */}
            <div className="p-4 text-center border-b border-stone-300">
              <h1 className="text-xl font-medium tracking-[0.15em] uppercase mb-1">{asset.name}</h1>
              <p className="text-xs uppercase tracking-[0.15em] anim-green-fade">Lexie Johnson Art · Verified Authentic</p>
            </div>
            {/* 2x2 attributes */}
            <div className="grid grid-cols-2">
              <div className="p-4 border-r border-b border-stone-300">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">{asset.attributes['title']?.name || 'Title'}</p>
                <p className="text-sm">{asset.attributes['title']?.value}</p>
              </div>
              <div className="p-4 border-b border-stone-300">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">Serial Number</p>
                <p className="text-sm">{asset.serial}</p>
              </div>
              <div className="p-4 border-r border-stone-300">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">{asset.attributes['medium']?.name || 'Medium'}</p>
                <p className="text-sm">{asset.attributes['medium']?.value}</p>
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">{asset.attributes['dimensions']?.name || 'Dimensions'}</p>
                <p className="text-sm">{asset.attributes['dimensions']?.value}</p>
              </div>
            </div>
          </div>

          {/* Creation Story button */}
          {asset.events.length > 0 && (
            <div>
              <button
                onClick={() => {
                  setCurrentEvent(0)
                  setSwipeOffset(0)
                  setView('story')
                }}
                className="w-full py-5 border border-stone-900 text-stone-900 bg-[#F5F5F0] text-sm uppercase tracking-[0.2em] transition-colors hover:bg-stone-900 hover:text-white active:bg-stone-800 active:text-white"
              >
                Creation Story
              </button>
            </div>
          )}

        </div>
      ) : (
        /* ===== CREATION STORY VIEW ===== */
        <div
          ref={containerRef}
          className="fixed inset-0 bg-[#F5F5F0] font-jost flex flex-col select-none anim-fade-up"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Swipeable event content */}
          <div className="flex-shrink-0 overflow-hidden px-6" style={{ paddingTop: '1.5rem' }}>
            <div
              key={currentEvent}
              className={`max-w-3xl mx-auto ${
                slideDirection === 'left' ? 'slide-from-right' :
                slideDirection === 'right' ? 'slide-from-left' : ''
              }`}
              style={{
                transform: swipeDirection.current === 'horizontal' ? `translateX(${swipeOffset}px)` : undefined,
                transition: swipeDirection.current === 'horizontal' ? 'none' : undefined,
              }}
            >
              {/* Event media - cropped to fill, shares bottom border with event text */}
              {(event?.video_file || event?.images.length > 0) && (
                <div
                  className="w-full bg-[#F5F5F0] overflow-hidden"
                  style={{ aspectRatio: '9/16', maxHeight: '65vh' }}
                >
                  {event?.video_file ? (
                    <video
                      ref={(el) => { videoRefs.current[event.id] = el }}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={event.video_file} type="video/quicktime" />
                      <source src={event.video_file} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Event text - shares top border with video bottom */}
              <div className="border border-stone-300 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">{formatDate(event?.date)}</p>
                <h3 className="text-sm">{event?.title}</h3>

                {event?.description && (
                  <div
                    className="text-sm mt-3"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Progress dots - dynamically centered in remaining space */}
          <div className="flex-1 flex justify-center items-center gap-2.5 px-6">
            {reversedEvents.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentEvent ? 'w-8 bg-stone-900' : 'w-1.5 bg-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Asset Details button - same width as content */}
          <div className="flex-shrink-0 px-6 pb-6">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => {
                  setViewKey((k) => k + 1)
                  setView('details')
                }}
                className="w-full py-5 border border-stone-900 text-stone-900 bg-[#F5F5F0] text-sm uppercase tracking-[0.2em] transition-colors hover:bg-stone-900 hover:text-white active:bg-stone-800 active:text-white"
              >
                Asset Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
