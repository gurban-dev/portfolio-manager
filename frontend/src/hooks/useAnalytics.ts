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
        setError(null)
        const params = new URLSearchParams()
        if (startDate) params.append('from', startDate)
        if (endDate) params.append('to', endDate)
        params.append('interval', interval)

        const response = await api.get(`/api/v1/analytics/performance/?${params.toString()}`)
        
        // Validate response data
        if (response.data && response.data.series) {
          setData(response.data)
        } else {
          setError('Invalid response format')
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch performance data'
        setError(errorMsg)
        console.error('Performance analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (startDate && endDate) {
      fetchData()
    } else {
      setLoading(false)
    }
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
        setError(null)
        const params = new URLSearchParams()
        if (startDate) params.append('from', startDate)
        if (endDate) params.append('to', endDate)
        params.append('interval', interval)

        const response = await api.get(`/api/v1/analytics/esg/?${params.toString()}`)
        
        // Validate response data
        if (response.data && response.data.series !== undefined) {
          setData(response.data)
        } else {
          setError('Invalid response format')
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch ESG data'
        setError(errorMsg)
        console.error('ESG analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (startDate && endDate) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [startDate, endDate, interval])

  return { data, loading, error }
}

