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
    // Django cookie
    const hasSession = document.cookie.includes('sessionid')

    if (!hasSession) {
      setUser(null)
      setChecked(true)
      return
    }

    fetchUser()
  }, [])

  const login = async (credentials: any) => {
    await api.post('/api/auth/login/', credentials)

    fetchUser()
  }

  const logout = async () => {
    await api.post('/api/auth/logout/')

    setUser(null)
  }

  return { user, checked, login, logout }
}