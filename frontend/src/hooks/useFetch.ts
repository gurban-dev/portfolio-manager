import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get(endpoint)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [endpoint])

  return { data, loading, error }
}