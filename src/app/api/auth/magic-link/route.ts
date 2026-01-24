import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch('https://rainf4ll.com/api/auth/magic-link/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })

  // 201 = success (no response body)
  if (res.status === 201) {
    return NextResponse.json({ success: true })
  }

  const text = await res.text()

  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    return NextResponse.json(
      { detail: 'API is temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }

  try {
    const data = JSON.parse(text)
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { detail: 'Invalid response from API' },
      { status: 500 }
    )
  }
}
