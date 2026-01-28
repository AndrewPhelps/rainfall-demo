import Link from 'next/link'

const SHOWCASE_ASSETS = [
  {
    serial: 'EW3H-MRPQ',
    name: 'MJ 1995-96 Jersey',
    brand: 'Mitchell & Ness',
    image: 'https://media.rainf4ll.com/main_1612554908/images/webp/60af47888d87e13f4051619590a00bdff945d15533090003db8f04df.webp',
  },
  {
    serial: 'gdvnQDrdJkj3Q',
    name: 'Tom Brady - G.O.A.T. Series',
    brand: 'Lexie Johnson Art',
    image: 'https://media.rainf4ll.com/lexie-johnson-art_1728689502/images/webp/003dca1e9e5af23f8668035b4974eaf60520950cf70660_GBiH7y1.webp',
  },
  {
    serial: 'QUV7wjmssR9GzYfivQvkrT',
    name: 'Venus Williams Signed Racket',
    brand: 'Authentic',
    image: 'https://media.rainf4ll.com/main_1612554908/images/webp/10876dcca87e10422da5a671c282b00913731167a5ddbbcb7e45889d.webp',
  },
  {
    serial: 'VBDhQ9CCrbKubHih4idd6U',
    name: 'Black Radio X Unknown Union Tee',
    brand: 'Robert Glasper',
    image: 'https://media.rainf4ll.com/robertglasper_1724336146/images/webp/7c6da89e78ed7c8f756e9fadb542cfc8eecfd5309fbd55d0d2faf039.webp',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Branded Verification
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium, white-label verification experiences for brands. Each asset below
            demonstrates a unique branded frontend powered by Rainfall Digital&apos;s
            authentication infrastructure.
          </p>
        </div>

        {/* Asset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHOWCASE_ASSETS.map((asset) => (
            <Link
              key={asset.serial}
              href={`/verify/${asset.serial}`}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {asset.brand}
                </p>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {asset.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>Powered by Rainfall Digital</p>
        </div>
      </div>
    </main>
  )
}
