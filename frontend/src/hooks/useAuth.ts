import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    api.get('/users/me/').then(res => setUser(res.data)).catch(() => setUser(null))
  }, [])

  const login = async (credentials: any) => {
    await api.post('/auth/login/', credentials)
    const res = await api.get('/users/me/')
    setUser(res.data)
  }

  const logout = async () => {
    await api.post('/auth/logout/')
    setUser(null)
  }

  return { user, login, logout }
}