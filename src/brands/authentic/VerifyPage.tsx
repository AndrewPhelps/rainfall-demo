'use client'

import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

// Placeholder - to be customized with sports memorabilia aesthetic
export default function AuthenticVerifyPage({ asset }: VerifyPageProps) {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {asset.merchant.logo_light && (
            <img
              src={asset.merchant.logo_light}
              alt={asset.merchant.name}
              className="h-10"
            />
          )}
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="uppercase tracking-wider font-semibold">Verified</span>
          </div>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 border border-white/10 p-6">
            <img
              src={asset.image_url}
              alt={asset.name}
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{asset.name}</h1>
            <p className="text-gray-400 font-mono text-sm mb-6">Serial: {asset.serial}</p>

            {Object.keys(asset.attributes).length > 0 && (
              <div className="space-y-3">
                {Object.entries(asset.attributes).map(([key, attr]) => (
                  <div key={key} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 text-sm">{attr.name}</span>
                    <span className="text-sm font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Event */}
        {asset.featured_event && (
          <div className="bg-white/5 border border-white/10 p-6 mb-12">
            <h2 className="text-lg font-semibold mb-4">{asset.featured_event.title}</h2>
            <div
              className="text-gray-300 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
            />
          </div>
        )}

        {/* Gallery */}
        {asset.events.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {asset.events.flatMap(event =>
                event.images.map((img, i) => (
                  <div key={`${event.id}-${i}`} className="aspect-square bg-white/5 border border-white/10 overflow-hidden">
                    <img
                      src={img}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {asset.events.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-6">History</h2>
            <div className="space-y-4">
              {asset.events.map((event) => (
                <div key={event.id} className="flex gap-4 items-start">
                  <div className="text-gray-500 text-sm w-32 flex-shrink-0">{formatDate(event.date)}</div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    {event.address && <p className="text-gray-400 text-sm">{event.address}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {asset.call_to_action && asset.call_to_action.length > 0 && (
          <div className="text-center mb-12">
            {asset.call_to_action.map((cta, i) => (
              <a
                key={i}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-gray-900 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors"
              >
                {cta.text}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pt-8 border-t border-white/10">
          <p>Powered by Rainfall Digital</p>
        </div>
      </div>
    </main>
  )
}
