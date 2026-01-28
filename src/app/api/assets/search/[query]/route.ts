import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const RAINFALL_API = 'https://rainf4ll.com/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params
  const token = process.env.RAINFALL_API_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: 'API token not configured' },
      { status: 500 }
    )
  }

  try {
    const { stdout } = await execAsync(
      `curl -s -H "Authorization: Token ${token}" -H "Content-Type: application/json" -H "Accept: application/json" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" "${RAINFALL_API}/assets/search/${encodeURIComponent(query)}/"`,
      { timeout: 15000 }
    )

    // Check for Cloudflare HTML response
    if (stdout.includes('<!DOCTYPE') || stdout.includes('Just a moment')) {
      return NextResponse.json(
        { error: 'Cloudflare challenge encountered' },
        { status: 503 }
      )
    }

    const data = JSON.parse(stdout)
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch asset', detail: message },
      { status: 500 }
    )
  }
}
