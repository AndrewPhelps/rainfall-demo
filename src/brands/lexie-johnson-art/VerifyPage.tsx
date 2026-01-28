'use client'

import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Placeholder - to be customized with art gallery aesthetic
export default function LexieJohnsonArtVerifyPage({ asset }: VerifyPageProps) {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Lexie Johnson Art</p>
          <div className="w-12 h-px bg-gray-200 mx-auto" />
        </div>

        {/* Artwork */}
        <div className="mb-12">
          <img
            src={asset.image_url}
            alt={asset.name}
            className="w-full h-auto shadow-2xl"
          />
        </div>

        {/* Title + Auth */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-tight mb-2">{asset.name}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="text-green-600">Verified Authentic</span>
            <span>|</span>
            <span className="font-mono">{asset.serial}</span>
          </div>
        </div>

        {/* Attributes */}
        {Object.keys(asset.attributes).length > 0 && (
          <div className="grid grid-cols-3 gap-8 mb-12 text-center">
            {Object.entries(asset.attributes).map(([key, attr]) => (
              <div key={key}>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{attr.name}</p>
                <p className="text-sm">{attr.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Creation Story (Timeline) */}
        {asset.events.length > 0 && (
          <div className="mb-12">
            <h2 className="text-center text-xs uppercase tracking-[0.2em] text-gray-400 mb-8">Creation Story</h2>
            <div className="space-y-8">
              {asset.events.map((event) => (
                <div key={event.id} className="border-l-2 border-gray-200 pl-6">
                  <p className="text-xs text-gray-400 mb-1">{formatDate(event.date)}</p>
                  <h3 className="font-medium mb-3">{event.title}</h3>

                  {event.video_file && (
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full bg-black mb-3"
                    >
                      <source src={event.video_file} type="video/quicktime" />
                      <source src={event.video_file} type="video/mp4" />
                    </video>
                  )}

                  {event.images.length > 0 && (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-auto mb-3"
                    />
                  )}

                  {event.description && (
                    <div
                      className="text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs pt-8 border-t border-gray-100">
          <p>Powered by Rainfall Digital</p>
        </div>
      </div>
    </main>
  )
}
