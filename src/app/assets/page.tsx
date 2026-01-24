'use client'

import { useEffect, useState } from 'react'

interface Asset {
  id: string
  name: string
  serial: string
  image_url: string | null
  is_owner: boolean
  merchant: {
    slug: string
    name: string
  }
}

interface AssetsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Asset[]
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('/api/assets?limit=20&offset=0')
        const data: AssetsResponse = await res.json()

        if (!res.ok) {
          throw new Error((data as any).detail || 'Failed to load assets')
        }

        setAssets(data.results)
        setTotal(data.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Loading assets...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <h1 className="text-xl font-bold">My Assets</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        <p className="text-gray-600 mb-6">{total} asset{total !== 1 ? 's' : ''} found</p>

        {assets.length === 0 ? (
          <p className="text-gray-500">No assets yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {asset.image_url ? (
                  <img
                    src={asset.image_url}
                    alt={asset.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{asset.name}</h2>
                  <p className="text-gray-500 text-sm mb-2">{asset.merchant?.name}</p>
                  <div className="text-xs text-gray-400">
                    <p>Serial: {asset.serial}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
