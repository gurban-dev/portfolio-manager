import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<any>(null)

  // Indicates auth check done.
  const [checked, setChecked] = useState(false)

  const fetchUser = async () => {
    try {
      // Sends an HTTP GET request to your backend at the endpoint /api/v1/users/me/.

      // This endpoint returns the currently authenticated user's data:
      const res = await api.get('/api/v1/users/me/')

      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      setChecked(true)
    }
  }

  useEffect(() => {
    const hasAccessToken =
      typeof window !== 'undefined' && Boolean(localStorage.getItem('access_token'))

    // REST_AUTH uses JWT_AUTH_COOKIE="auth-token"
    const hasAuthCookie =
      typeof window !== 'undefined' && document.cookie.includes('auth-token=')

    if (!hasAccessToken && !hasAuthCookie) {
      setUser(null)
      setChecked(true)
      return
    }

    fetchUser()
  }, [])

  const login = async (credentials: any) => {
    // Persist tokens so subsequent API calls (and WS auth) work reliably.
    const res = await api.post('/api/auth/login/', credentials)
    const access = res.data?.access_token
    const refresh = res.data?.refresh_token

    if (typeof window !== 'undefined' && access && refresh) {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    }

    fetchUser()
  }

  const logout = async () => {
    await api.post('/api/auth/logout/')

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }

    setUser(null)
  }

  return { user, checked, login, logout }
}