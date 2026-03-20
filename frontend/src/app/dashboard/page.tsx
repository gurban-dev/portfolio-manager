'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import AccountCard from '@/components/AccountCard'
import TransactionTable from '@/components/TransactionTable'
import ESGScoreBadge from '@/components/ESGScoreBadge'
import NotificationBell from '@/components/NotificationBell'
import PerformanceChart from '@/components/charts/PerformanceChart'
import ESGChart from '@/components/charts/ESGChart'
import RiskRewardCard from '@/components/dashboard/RiskRewardCard'
import { usePerformanceAnalytics, useESGAnalytics } from '@/hooks/useAnalytics'
import { subDays, format } from 'date-fns'
import { Account, Transaction, RiskMetrics } from '@/lib/types'
import ReportGenerator from '@/components/reports/ReportGenerator'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuth } from '@/hooks/useAuth'
import { WEBSOCKET_URL } from '@/lib/constants'

export default function DashboardPage() {
  const { user, checked } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  // Get analytics data for last 30 days
  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  
  const { data: performanceData, loading: performanceLoading } = usePerformanceAnalytics(startDate, endDate, 'daily')
  const { data: esgData, loading: esgLoading } = useESGAnalytics(startDate, endDate, 'daily')

  // WebSocket connection - must be at top level, only connect when user is available
  // Backend routing expects numeric user_id (user.id), not UUID (user.uid)
  // Get JWT token from localStorage for authentication
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }
  
  const wsUrl = user?.id ? `${WEBSOCKET_URL}${user.id}/?token=${getAuthToken() || ''}` : null
  useWebSocket(wsUrl || '', {
    onOpen: () => console.log('WebSocket connected!'),
    onMessage: (data) => {
      console.log('Received notification:', data)
      // Refresh notifications when new one arrives
      // TODO: Update notification state
    },
    onClose: () => console.log('WebSocket disconnected'),
    onError: (err) => console.error('WebSocket error', err),
    reconnect: user?.id ? true : false, // Only reconnect if user is authenticated
    reconnectInterval: 5000
  })

  useEffect(() => {
    if (!checked) return // Wait for auth check

    async function fetchData() {
      try {
        const [accountsRes, transactionsRes, riskRes] = await Promise.all([
          api.get('/api/v1/accounts/'),
          api.get('/api/v1/transactions/?page_size=5')
            .then(res => ({ data: res.data.results || res.data || [] }))
            .catch((err) => {
              console.error('Failed to fetch recent transactions:', err)
              return { data: [] }
            }),
          api.get('/api/v1/analytics/risk/')
            .then(res => ({ data: res.data }))
            .catch((err) => {
              console.error('Failed to fetch risk metrics:', err)
              return null
            }),
        ])

        setAccounts(accountsRes.data.results || accountsRes.data || [])
        setTransactions(transactionsRes.data)

        if (riskRes?.data) {
          setRiskMetrics(riskRes.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [checked])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <NotificationBell />
      </div>

      {/* Accounts Overview */}
      <section>
        <h2 className="text-xl font-medium mb-4">Your Accounts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={{ ...acc, balance: acc.balance.toString() }} />
          ))}
        </div>
      </section>

      {/* Performance Chart */}
      <section>
        <h2 className="text-xl font-medium mb-4">Portfolio Performance</h2>

        <div className="bg-white rounded-lg shadow p-6">
          {performanceLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : performanceData?.series && performanceData.series.length > 0 ? (
            <PerformanceChart data={performanceData.series} currency={performanceData.currency} />
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg font-medium">No Performance Data Available</p>
                <p className="text-gray-400 text-sm mt-2">Create some transactions to see your portfolio performance.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ESG Chart */}
      <section>
        <h2 className="text-xl font-medium mb-4">ESG Impact Over Time</h2>

        <div className="bg-white rounded-lg shadow p-6">
          {esgLoading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : esgData?.series && esgData.series.length > 0 ? (
            <>
              <ESGChart data={esgData.series} />

              <div className="mt-4 flex gap-4 justify-center">
                <ESGScoreBadge 
                  label="Total CO₂ Impact" 
                  value={`${esgData.total_co2_kg.toFixed(2)} kg`} 
                  variant="warning" 
                />

                <ESGScoreBadge 
                  label="Average ESG Rating" 
                  value={`${esgData.avg_rating.toFixed(2)} / 10`} 
                  variant="success" 
                />
              </div>
            </>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg font-medium">No ESG Data Available</p>
                <p className="text-gray-400 text-sm mt-2">Create investment transactions to see your ESG impact.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Risk & Reward */}
      <section>
        <h2 className="text-xl font-medium mb-4">Risk Analysis</h2>
        {riskMetrics ? (
          <RiskRewardCard metrics={riskMetrics} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center">Risk metrics will be calculated once you have transaction data.</p>
          </div>
        )}
      </section>

      {/* Report Generator */}
      <section>
        <h2 className="text-xl font-medium mb-4">Reports</h2>

        <ReportGenerator />
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No recent transactions found.</p>
            <p className="text-sm text-gray-400 mt-2">Create a transaction to get started.</p>
          </div>
        ) : (
          <TransactionTable
            transactions={
              transactions.map(t => ({
                ...t,
                amount: t.amount.toString(),
                category: t.category ?? undefined
              }))}
          />
        )}
      </section>
    </div>
  )
}