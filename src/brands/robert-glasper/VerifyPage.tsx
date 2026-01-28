'use client'

import { useState } from 'react'
import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Placeholder - to be customized with music/streetwear aesthetic
export default function RobertGlasperVerifyPage({ asset }: VerifyPageProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white">
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
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Hero with Glitch Effect */}
        <div className="relative glitch-container">
          <img
            src={asset.image_url}
            alt={asset.name}
            className="glitch-image"
          />
          {/* Halftone strip at bottom with varying dot sizes */}
          <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, rowIndex) => {
              const dotSize = 1 + (rowIndex * 0.4); // 1px at top, ~5px at bottom
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
          <h1 className="font-jost text-4xl font-bold tracking-tight mb-6 pt-[30px]">{asset.name}</h1>

          {/* Auth Badge - Two Column Layout */}
          <div className="flex mb-0">
            {/* Left Column - Rectangle with name and serial */}
            <div className="flex-1 border border-white flex flex-col justify-center px-4 py-4">
              <p className="font-jost text-lg font-bold uppercase" style={{ letterSpacing: '0.2em' }}>{asset.merchant.name}</p>
              <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.2em' }}>Serial Number: {asset.serial}</p>
            </div>
            {/* Right Column - Square with rotating verified text */}
            <div className="w-20 aspect-square border border-white border-l-0 flex items-center justify-center relative bg-white">
              {/* Rotating text around the circle */}
              <svg className="absolute w-20 h-20 rotating-text" viewBox="0 0 100 100">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50,50 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0"
                  />
                </defs>
                <text fontSize="8" letterSpacing="2.3" className="uppercase fill-black font-bold">
                  <textPath href="#circlePath">
                    VERIFIED • VERIFIED •
                  </textPath>
                </text>
              </svg>
              {/* Center checkmark */}
              <svg className="w-6 h-6 text-black relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Chapter Story */}
          {asset.attributes['chapter-story'] && (
            <div className="border border-white border-t-0 p-4 mb-0">
              <h3 className="font-jost text-sm text-gray-500 uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
                {asset.attributes['chapter-story'].name}
              </h3>
              <p className="font-inter-light text-gray-300 leading-relaxed">
                {asset.attributes['chapter-story'].value}
              </p>
            </div>
          )}

          {/* Product Description */}
          {asset.attributes['product-description'] && (
            <div className="border border-white border-t-0 p-4 mb-8">
              <h3 className="font-jost text-sm text-gray-500 uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
                {asset.attributes['product-description'].name}
              </h3>
              <p className="font-inter-light text-gray-300 leading-relaxed">
                {asset.attributes['product-description'].value}
              </p>
            </div>
          )}


          {/* Events */}
          {asset.events.length > 0 && (
            <div className="space-y-4 mb-8">
              {asset.events.map((event) => (
                <div key={event.id} className="border border-white p-4">
                  <h3 className="font-jost text-lg font-bold uppercase mb-2" style={{ letterSpacing: '0.2em' }}>
                    {event.title}
                  </h3>
                  <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.2em' }}>
                    {formatDate(event.date)}
                  </p>
                  {event.address && (
                    <p className="font-jost text-sm text-gray-500 uppercase" style={{ letterSpacing: '0.2em' }}>
                      {event.address}
                    </p>
                  )}

                  {event.video_file && (
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full mt-4"
                    >
                      <source src={event.video_file} type="video/mp4" />
                      <source src={event.video_file} type="video/quicktime" />
                    </video>
                  )}

                  {event.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {event.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${event.title} ${i + 1}`}
                          className="w-full h-auto"
                        />
                      ))}
                    </div>
                  )}

                  {event.description && (
                    <div
                      className="font-inter-light text-gray-300 mt-4 prose prose-invert prose-sm max-w-none [&_a]:text-white [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {asset.call_to_action && asset.call_to_action.length > 0 && (
            <div className="mb-8">
              {asset.call_to_action.map((cta, i) => (
                <a
                  key={i}
                  href={cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  {cta.text}
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs py-8 pb-24 border-t border-white/10">
            <p>Powered by Rainfall Digital</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/75 via-black/40 to-transparent pointer-events-none z-30" />

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setModalOpen(false)}
        />
      )}

      {/* Modal Card */}
      {asset.featured_event && (
        <div
          className={`fixed bottom-20 left-4 right-4 z-50 max-w-3xl mx-auto transition-all duration-300 ease-out ${
            modalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-black border border-white p-6">
            <h2 className="font-jost text-xl font-bold mb-4 uppercase" style={{ letterSpacing: '0.2em' }}>
              {asset.featured_event.title}
            </h2>
            <div
              className="font-inter-light text-gray-300 prose prose-invert prose-sm max-w-none [&_a]:text-white [&_a]:underline [&_a:hover]:text-gray-300 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
            />
          </div>
        </div>
      )}

      {/* Floating Sticky Button */}
      {asset.featured_event && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-3xl mx-auto">
          <button
            onClick={() => setModalOpen(!modalOpen)}
            className="w-full bg-white text-black py-4 px-6 font-jost font-bold uppercase text-center"
            style={{ letterSpacing: '0.2em' }}
          >
            {asset.featured_event.title}
          </button>
        </div>
      )}
    </main>
  )
}
