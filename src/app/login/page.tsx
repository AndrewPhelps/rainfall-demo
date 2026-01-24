'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  async function handleRequestLink(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send magic link')
      }

      setLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  async function handleValidateToken(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/magic-link/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Invalid token')
      }

      // Store tokens
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/assets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Rainfall Demo</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to view your assets</p>

        {!linkSent ? (
          <form onSubmit={handleRequestLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleValidateToken} className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm mb-4">
              Check your email for a magic link! Enter the token from the link below, or click the link directly.
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Token from email
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste token here"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setLinkSent(false)
                setError('')
                setToken('')
              }}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
