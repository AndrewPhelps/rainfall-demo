'use client'

import { useState, useRef, useEffect } from 'react'
import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Placeholder - to be customized with music/streetwear aesthetic
export default function RobertGlasperVerifyPage({ asset }: VerifyPageProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})
  const [imageSliderIndex, setImageSliderIndex] = useState<Record<string, number>>({})
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({})
  const [ctaInView, setCtaInView] = useState(false)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const ctaSectionRef = useRef<HTMLDivElement>(null)

  // Scroll-triggered slide-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = document.querySelectorAll('.slide-up')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Autoplay videos on mute when they become visible
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may fail due to browser policies, ignore silently
            })
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe all video elements
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        videoObserver.observe(video)
      }
    })

    return () => videoObserver.disconnect()
  }, [asset.events])

  // Track when CTA section is in view to dock the sticky button
  useEffect(() => {
    if (!ctaSectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setCtaInView(entry.isIntersecting)
        })
      },
      { threshold: 0, rootMargin: '0px 0px 80px 0px' }
    )

    observer.observe(ctaSectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-black text-white" style={{ minHeight: '100vh', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <meta name="theme-color" content="#000000" />
      {/* Jost font + Glitch effect */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Inter:wght@300&display=swap');
        .font-jost { font-family: 'Jost', sans-serif; }
        .font-inter-light { font-family: 'Inter', sans-serif; font-weight: 300; }

        .rotating-text {
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .glitch-container {
          position: relative;
          overflow: hidden;
        }

        .glitch-image {
          width: 100%;
          height: auto;
          animation: spazz 5s steps(1) infinite;
        }

        /* Glitch for 1s (0-20%), then normal for 4s (20-100%) */
        @keyframes spazz {
          0% { filter: hue-rotate(45deg); transform: translate(-2px, 3px) scale(1.08); }
          2% { filter: hue-rotate(120deg) saturate(3); transform: translate(5px, -8px) scale(1.12); }
          4% { filter: hue-rotate(200deg); transform: translate(-10px, 2px) scale(1.06); }
          6% { filter: hue-rotate(80deg) contrast(2); transform: translate(8px, 5px) scale(1.15); }
          8% { filter: hue-rotate(300deg); transform: translate(-5px, -3px) scale(1.09); }
          10% { filter: hue-rotate(15deg) saturate(5); transform: translate(3px, 10px) scale(1.07); }
          12% { filter: hue-rotate(180deg); transform: translate(-8px, -5px) scale(1.11); }
          14% { filter: hue-rotate(270deg) brightness(60%); transform: translate(12px, 0px) scale(1.13); }
          16% { filter: hue-rotate(90deg); transform: translate(-3px, 8px) scale(1.05); }
          18% { filter: hue-rotate(330deg) saturate(7); transform: translate(0px, -12px) scale(1.18); }
          /* Normal image hold for 4 seconds */
          20% { filter: none; transform: none; }
          100% { filter: none; transform: none; }
        }

        /* Logo glitch animation on load */
        .logo-glitch {
          animation: logoGlitch 0.8s ease-out forwards;
        }

        @keyframes logoGlitch {
          0% {
            opacity: 0;
            filter: blur(4px);
            transform: translate(-3px, 2px);
          }
          10% {
            opacity: 0.3;
            filter: blur(2px) hue-rotate(90deg);
            transform: translate(4px, -3px);
          }
          20% {
            opacity: 0.5;
            filter: blur(3px) hue-rotate(180deg);
            transform: translate(-5px, 1px);
          }
          30% {
            opacity: 0.4;
            filter: blur(1px) hue-rotate(270deg);
            transform: translate(2px, -4px);
          }
          40% {
            opacity: 0.7;
            filter: blur(2px) hue-rotate(45deg);
            transform: translate(-2px, 3px);
          }
          50% {
            opacity: 0.6;
            filter: blur(1px);
            transform: translate(3px, -1px);
          }
          60% {
            opacity: 0.8;
            filter: blur(0.5px);
            transform: translate(-1px, 2px);
          }
          70% {
            opacity: 0.9;
            filter: blur(1px);
            transform: translate(1px, -1px);
          }
          80% {
            opacity: 0.95;
            filter: blur(0.5px);
            transform: translate(0px, 1px);
          }
          90% {
            opacity: 1;
            filter: blur(0px);
            transform: translate(0px, 0px);
          }
          100% {
            opacity: 1;
            filter: none;
            transform: none;
          }
        }

        /* Scroll-triggered slide up animation */
        .slide-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        .slide-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Event details expand/collapse transition */
        .event-details {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        }

        .event-details.expanded {
          max-height: 1000px;
          opacity: 1;
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Hero with Glitch Effect */}
        <div className="relative glitch-container">
          {/* Logo - centered over hero image with glitch animation */}
          <div className="absolute top-6 left-0 right-0 z-10 flex justify-center">
            <img
              src="/robert-glasper-logo.svg"
              alt="Robert Glasper"
              className="h-8 w-auto logo-glitch"
            />
          </div>
          <img
            src={asset.image_url}
            alt={asset.name}
            className="glitch-image"
          />
          {/* Halftone strip at bottom with varying dot sizes */}
          <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, rowIndex) => {
              const dotSize = 2 + (rowIndex * 0.8); // 2px at top, ~10px at bottom
              const spacing = 8;
              const y = rowIndex * 6;
              return (
                <div
                  key={rowIndex}
                  className="absolute left-0 right-0 flex justify-around"
                  style={{ top: y }}
                >
                  {[...Array(60)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="rounded-full bg-black"
                      style={{
                        width: dotSize,
                        height: dotSize,
                        marginLeft: colIndex === 0 ? (rowIndex % 2 === 0 ? 0 : spacing / 2) : 0,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          {/* Gradient overlay on top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="px-6 py-8 -mt-24 relative z-10">
          {/* Title */}
          <h1 className="font-jost font-bold tracking-tight mb-6 pt-[30px]" style={{ fontSize: '2rem', lineHeight: '1.15' }}>{asset.name}</h1>

          {/* Auth Badge - Two Column Layout */}
          {/* Auth Badge + Chapter Story + Product Description - animate together */}
          <div className="mb-8 slide-up">
            <div className="flex mb-0">
              {/* Left Column - Rectangle with name and serial */}
              <div className="flex-1 border border-white flex flex-col justify-center px-4 py-4">
                <p className="font-jost text-lg font-bold uppercase" style={{ letterSpacing: '0.1em' }}>{asset.merchant.name}</p>
                <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.1em' }}>Serial Number: {asset.serial}</p>
              </div>
              {/* Right Column - Square with rotating verified text */}
              <div className="w-20 aspect-square border border-white border-l-0 flex items-center justify-center relative bg-white overflow-hidden">
                {/* Rotating text around the circle */}
                <svg className="absolute w-[104px] h-[104px] rotating-text" viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50,50 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0"
                    />
                  </defs>
                  <text fontSize="8" letterSpacing="1.75" fontWeight="800" className="uppercase fill-black">
                    <textPath href="#circlePath">
                      VERIFIED • AUTHENTIC •
                    </textPath>
                  </text>
                </svg>
                {/* Center checkmark */}
                <svg className="w-10 h-10 text-black relative z-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Chapter Story */}
            {asset.attributes['chapter-story'] && (
              <div className="border border-white border-t-0 p-4">
                <h3 className="font-jost text-sm text-gray-500 uppercase mb-1" style={{ letterSpacing: '0.1em' }}>
                  {asset.attributes['chapter-story'].name}
                </h3>
                <p className="font-inter-light text-gray-300 leading-relaxed">
                  {asset.attributes['chapter-story'].value}
                </p>
              </div>
            )}

            {/* Product Description */}
            {asset.attributes['product-description'] && (
              <div className="border border-white border-t-0 p-4">
                <h3 className="font-jost text-sm text-gray-500 uppercase mb-1" style={{ letterSpacing: '0.1em' }}>
                  {asset.attributes['product-description'].name}
                </h3>
                <p className="font-inter-light text-gray-300 leading-relaxed">
                  {asset.attributes['product-description'].value}
                </p>
              </div>
            )}
          </div>


          {/* Events */}
          {asset.events.length > 0 && (
            <div className="space-y-4 mb-8">
              {asset.events.map((event) => (
                <div key={event.id} className="slide-up">
                  <div className={`border border-white p-4 ${event.description ? 'border-b-0' : ''}`}>
                    <h3 className="font-jost text-lg font-bold uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
                      {event.title}
                    </h3>
                    <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.1em' }}>
                      {formatDate(event.date)} //
                    </p>
                    {event.address && (
                      <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.1em' }}>
                        {event.address}
                      </p>
                    )}

                    {event.video_file && (
                      <div className="relative mt-4">
                        <video
                          ref={(el) => { videoRefs.current[event.id] = el }}
                          controls
                          muted
                          preload="metadata"
                          playsInline
                          className="w-full max-h-[500px]"
                          onPlay={() => setPlayingVideos(prev => ({ ...prev, [event.id]: true }))}
                          onPause={() => setPlayingVideos(prev => ({ ...prev, [event.id]: false }))}
                          onEnded={() => setPlayingVideos(prev => ({ ...prev, [event.id]: false }))}
                        >
                          <source src={event.video_file} type="video/mp4" />
                          <source src={event.video_file} type="video/quicktime" />
                        </video>
                        {!playingVideos[event.id] && (
                          <button
                            onClick={() => videoRefs.current[event.id]?.play()}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-12 h-12 border border-white bg-white flex items-center justify-center">
                              <svg className="w-4 h-4 ml-0.5" fill="black" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </button>
                        )}
                      </div>
                    )}

                    {event.images.length > 0 && (
                      <div className="relative mt-4">
                        <img
                          src={event.images[imageSliderIndex[event.id] || 0]}
                          alt={`${event.title} ${(imageSliderIndex[event.id] || 0) + 1}`}
                          className="w-full h-auto"
                        />
                        {event.images.length > 1 && (
                          <>
                            <button
                              onClick={() => setImageSliderIndex(prev => ({
                                ...prev,
                                [event.id]: ((prev[event.id] || 0) - 1 + event.images.length) % event.images.length
                              }))}
                              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 border border-white bg-white flex items-center justify-center"
                              style={{ left: 'calc(-1rem - 1px)' }}
                            >
                              <svg className="w-4 h-4" fill="black" viewBox="0 0 24 24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setImageSliderIndex(prev => ({
                                ...prev,
                                [event.id]: ((prev[event.id] || 0) + 1) % event.images.length
                              }))}
                              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 border border-white bg-white flex items-center justify-center"
                              style={{ right: 'calc(-1rem - 1px)' }}
                            >
                              <svg className="w-4 h-4" fill="black" viewBox="0 0 24 24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                              </svg>
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {event.images.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setImageSliderIndex(prev => ({ ...prev, [event.id]: i }))}
                                  className={`w-2 h-2 rounded-full ${(imageSliderIndex[event.id] || 0) === i ? 'bg-white' : 'bg-white/50'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {event.description && (
                      <div
                        className={`event-details font-inter-light text-gray-300 mt-4 prose prose-invert prose-sm max-w-none [&_a]:text-white [&_a]:underline ${expandedEvents[event.id] ? 'expanded' : ''}`}
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    )}
                  </div>
                  {event.description && (
                    <button
                      onClick={() => setExpandedEvents(prev => ({ ...prev, [event.id]: !prev[event.id] }))}
                      className="w-full flex"
                    >
                      <div className="w-12 h-12 border border-white flex items-center justify-center">
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedEvents[event.id] ? 'rotate-45' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div
                        className="flex-1 h-12 border border-white border-l-0 flex items-center justify-center font-jost text-sm uppercase pr-12"
                        style={{ letterSpacing: '0.1em' }}
                      >
                        {expandedEvents[event.id] ? 'Hide Details' : 'Details'}
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div ref={ctaSectionRef} className="mb-8 space-y-2">
            {asset.call_to_action && asset.call_to_action.length > 0 && (
              <>
                {asset.call_to_action.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white text-black py-4 px-6 font-jost font-bold uppercase text-center hover:bg-gray-200 transition-colors"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    {cta.text}
                  </a>
                ))}
              </>
            )}
            {/* Inline featured event button (shows when scrolled to CTA) */}
            {asset.featured_event && ctaInView && (
              <button
                onClick={() => setModalOpen(!modalOpen)}
                className="w-full bg-white text-black py-4 px-6 font-jost font-bold uppercase text-center"
                style={{ letterSpacing: '0.1em' }}
              >
                {asset.featured_event.title}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs py-8 border-t border-white/10">
            <p>Powered by Rainfall Digital</p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setModalOpen(false)}
        />
      )}

      {/* Modal Card - vertically centered */}
      {asset.featured_event && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
            modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className={`relative bg-black border border-white p-6 max-w-3xl w-full transition-transform duration-300 ease-out ${
            modalOpen ? 'translate-y-0' : 'translate-y-4'
          }`}>
            {/* Close button - positioned at top-right corner of modal */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-0 right-0 w-12 h-12 border-l border-b border-white bg-white flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="font-jost text-xl font-bold mb-4 uppercase" style={{ letterSpacing: '0.1em' }}>
              {asset.featured_event.title}
            </h2>
            <div
              className="font-inter-light text-gray-300 prose prose-invert prose-sm max-w-none [&_a]:text-white [&_a]:underline [&_a:hover]:text-gray-300 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
            />
          </div>
        </div>
      )}

      {/* Floating Sticky Button - hides when CTA section is in view */}
      {asset.featured_event && !ctaInView && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-3xl mx-auto transition-opacity duration-300">
          <button
            onClick={() => setModalOpen(!modalOpen)}
            className="w-full bg-white text-black py-4 px-6 font-jost font-bold uppercase text-center"
            style={{ letterSpacing: '0.1em' }}
          >
            {asset.featured_event.title}
          </button>
        </div>
      )}
    </main>
  )
}
