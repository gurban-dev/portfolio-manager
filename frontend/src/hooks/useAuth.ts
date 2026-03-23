import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { authService } from '@/lib/auth/authService'
import { User } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

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
    await authService.login(credentials.email, credentials.password)
    fetchUser()
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return { user, checked, login, logout }
}
