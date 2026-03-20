'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Lightbulb, AlertCircle, TrendingUp, Target, RefreshCw } from 'lucide-react'

interface Recommendation {
  type: string
  title: string
  message: string
  priority: string
  action?: string
}

export default function RecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/investments/esg-scores/recommendations/')
      setRecommendations(response.data.recommendations || [])
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="w-5 h-5" />
      case 'reduction':
        return <AlertCircle className="w-5 h-5" />
      case 'diversification':
        return <RefreshCw className="w-5 h-5" />
      case 'goal':
        return <Target className="w-5 h-5" />
      default:
        return <Lightbulb className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50'
      case 'medium':
        return 'border-yellow-300 bg-yellow-50'
      default:
        return 'border-blue-300 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">ESG Recommendations</h3>
        <p className="text-gray-500 text-sm">No recommendations available at this time.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">ESG Recommendations</h3>
        <button
          onClick={fetchRecommendations}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`border-l-4 p-4 rounded ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
                {rec.action && (
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                    {rec.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

