import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { PerformanceResponse, ESGResponse } from '@/lib/types'

export function usePerformanceAnalytics(startDate?: string, endDate?: string, interval: string = 'daily') {
  const [data, setData] = useState<PerformanceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (startDate) params.append('from', startDate)
        if (endDate) params.append('to', endDate)
        params.append('interval', interval)

        const response = await api.get(`/api/v1/analytics/performance/?${params.toString()}`)
        setData(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch performance data')
        console.error('Performance analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, interval])

  return { data, loading, error }
}

export function useESGAnalytics(startDate?: string, endDate?: string, interval: string = 'daily') {
  const [data, setData] = useState<ESGResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (startDate) params.append('from', startDate)
        if (endDate) params.append('to', endDate)
        params.append('interval', interval)

        const response = await api.get(`/api/v1/analytics/esg/?${params.toString()}`)
        setData(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch ESG data')
        console.error('ESG analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, interval])

  return { data, loading, error }
}

