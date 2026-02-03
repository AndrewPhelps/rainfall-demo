'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const ASSET_NAMES: Record<string, string> = {
  'gdvnQDrdJkj3Q': 'Tom Brady - G.O.A.T. Series',
  'QUV7wjmssR9GzYfivQvkrT': 'Venus Williams Signed Racket',
  'VBDhQ9CCrbKubHih4idd6U': 'Black Radio X Unknown Union Tee',
}

export default function ComparePage() {
  const params = useParams<{ brand: string; serial: string }>()
  const { brand, serial } = params

  const assetName = ASSET_NAMES[serial] || 'Asset Comparison'
  const defaultUrl = `https://rainf4ll.com/details/${serial}/`
  const customUrl = `/verify/${brand}/${serial}`

  return (
    <main className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <style>{`
        .phone-wrapper {
          position: relative;
          overflow: hidden;
        }
        .phone-wrapper iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        .phone-wrapper-default iframe {
          width: calc(100% + 17px);
        }
      `}</style>

      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center justify-center gap-8 px-6">
          <div style={{ width: '415px' }} className="flex items-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </Link>
          </div>
          <div style={{ width: '415px' }} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 text-center -mt-8">{assetName}</h1>
      </div>

      {/* Phone frames */}
      <div className="flex-1 flex justify-center items-center gap-8 px-6 pb-6">
        {/* Default */}
        <div className="flex flex-col items-center">
          <div className="phone-wrapper phone-wrapper-default rounded-[2.5rem] border-[3px] border-gray-200 overflow-hidden shadow-lg bg-white" style={{ width: '415px', height: '812px' }}>
            <iframe
              src={defaultUrl}
              title="Default verification page"
              className="h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
          <span className="text-xs uppercase tracking-wider text-gray-400 mt-5">Default</span>
        </div>

        {/* Custom */}
        <div className="flex flex-col items-center">
          <div className="phone-wrapper rounded-[2.5rem] border-[3px] border-gray-200 overflow-hidden shadow-lg bg-white" style={{ width: '415px', height: '812px' }}>
            <iframe
              src={customUrl}
              title="Custom verification page"
              className="h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
          <span className="text-xs uppercase tracking-wider text-gray-400 mt-5">Custom</span>
        </div>
      </div>
    </main>
  )
}
