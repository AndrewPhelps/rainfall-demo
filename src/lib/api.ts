// Use local API routes to proxy requests (avoids CORS issues)
const API_BASE = '/api'

interface LoginResponse {
  access: string
  refresh: string
  user: {
    pk: number
    email: string
    first_name: string
    last_name: string
  }
}

interface Asset {
  id: string
  product: {
    id: string
    name: string
    description: string
    image_url: string | null
  }
  serial_number: string
  created_at: string
  metadata: Record<string, unknown>
}

interface AssetsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Asset[]
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Login failed' }))
    throw new Error(error.detail || error.errors?.[0]?.detail || 'Login failed')
  }

  return res.json()
}

export async function getAssets(token: string, limit = 20, offset = 0): Promise<AssetsResponse> {
  const res = await fetch(`${API_BASE}/assets?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch assets')
  }

  return res.json()
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) {
    throw new Error('Token refresh failed')
  }

  return res.json()
}

export type { Asset, AssetsResponse, LoginResponse }
