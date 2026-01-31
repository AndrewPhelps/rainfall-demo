import { NextRequest, NextResponse } from 'next/server'

const RAINFALL_API = 'https://rainf4ll.com/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '20'
  const offset = searchParams.get('offset') || '0'
  const token = process.env.RAINFALL_API_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: 'API token not configured' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `${RAINFALL_API}/assets/?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      }
    )

    const text = await res.text()

    if (text.includes('<!DOCTYPE') || text.includes('Just a moment')) {
      return NextResponse.json(
        { error: 'Cloudflare challenge encountered' },
        { status: 503 }
      )
    }

    const data = JSON.parse(text)
    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch assets', detail: message },
      { status: 500 }
    )
  }
}
