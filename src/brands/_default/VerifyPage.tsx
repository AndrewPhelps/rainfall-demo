'use client'

import type { Asset } from '@/shared/types'
import { formatDate } from '@/shared/utils'

interface VerifyPageProps {
  asset: Asset
}

export default function DefaultVerifyPage({ asset }: VerifyPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-400">
            Verified by Rainfall
          </div>
          {asset.merchant.logo_light && (
            <img
              src={asset.merchant.logo_light}
              alt={asset.merchant.name}
              className="h-8 opacity-60"
            />
          )}
        </div>

        {/* Product Image */}
        <div className="bg-white border border-gray-200 p-4 mb-8">
          <img
            src={asset.image_url}
            alt={asset.name}
            className="w-full h-auto object-contain max-h-[400px]"
          />
        </div>

        {/* Product Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{asset.name}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-green-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Authentic
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 font-mono">{asset.serial}</span>
          </div>
        </div>

        {/* Attributes */}
        {Object.keys(asset.attributes).length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              {Object.entries(asset.attributes).map(([key, attr]) => (
                <div key={key}>
                  <dt className="text-xs text-gray-400 uppercase">{attr.name}</dt>
                  <dd className="text-sm text-gray-900">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Featured Event */}
        {asset.featured_event && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">About</h2>
            <div
              className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: asset.featured_event.description }}
            />
          </div>
        )}

        {/* Timeline */}
        {asset.events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-6">History</h2>
            <div className="space-y-6">
              {asset.events.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 p-4">
                  <p className="text-xs text-gray-400 mb-1">{formatDate(event.date)}</p>
                  <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>

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

                  {event.video_file && (
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full mt-3"
                    >
                      <source src={event.video_file} type="video/quicktime" />
                      <source src={event.video_file} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {asset.call_to_action && asset.call_to_action.length > 0 && (
          <div className="text-center mb-8">
            {asset.call_to_action.map((cta, i) => (
              <a
                key={i}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                {cta.text}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs pt-8 border-t border-gray-200">
          <p>Powered by Rainfall Digital</p>
        </div>
      </div>
    </main>
  )
}
