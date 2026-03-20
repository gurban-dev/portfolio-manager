import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { handleApiError, getErrorMessage } from '@/lib/errorHandler'

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get(endpoint)
      .then(res => {
        setData(res.data)
        setError(null)
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err)
        setError(errorMessage)
        console.error(`[useFetch] Failed to fetch ${endpoint}:`, errorMessage)
      })
      .finally(() => setLoading(false))
  }, [endpoint])

  return { data, loading, error }
}