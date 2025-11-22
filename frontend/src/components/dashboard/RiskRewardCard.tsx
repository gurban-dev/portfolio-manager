'use client'

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { RiskMetrics } from '@/lib/types'

interface RiskRewardCardProps {
  metrics: RiskMetrics | null
  loading?: boolean
}

export default function RiskRewardCard({ metrics, loading }: RiskRewardCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No risk metrics available</p>
      </div>
    )
  }

  const riskColor = metrics.risk_score > 7 ? 'text-red-600' : metrics.risk_score > 4 ? 'text-yellow-600' : 'text-green-600'
  const returnColor = metrics.expected_return > 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Risk & Reward Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Risk Score</span>
          </div>
          <p className={`text-2xl font-bold ${riskColor}`}>
            {metrics.risk_score.toFixed(2)} / 10
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {metrics.expected_return > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm text-gray-600">Expected Return</span>
          </div>
          <p className={`text-2xl font-bold ${returnColor}`}>
            {metrics.expected_return > 0 ? '+' : ''}{metrics.expected_return.toFixed(2)}%
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sharpe Ratio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {metrics.sharpe_ratio.toFixed(2)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Volatility</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {metrics.volatility.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}

