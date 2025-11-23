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

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  // Get analytics data for last 30 days
  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  
  const { data: performanceData, loading: performanceLoading } = usePerformanceAnalytics(startDate, endDate, 'daily')
  const { data: esgData, loading: esgLoading } = useESGAnalytics(startDate, endDate, 'daily')

  useEffect(() => {
    console.log('DashboardPage mounted.');

    async function fetchData() {
      try {
        const [accountsRes, transactionsRes, riskRes] = await Promise.all([
          api.get('/api/v1/accounts/'),

          api.get('/api/v1/transactions/?limit=5'),

          // Risk endpoint may not exist yet.
          api.get('/api/v1/analytics/risk/').catch(() => null),
        ])

        setAccounts(accountsRes.data)

        setTransactions(transactionsRes.data.results || transactionsRes.data)

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
  }, [])

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
          ) : performanceData ? (
            <PerformanceChart data={performanceData.series} currency={performanceData.currency} />
          ) : (
            <p className="text-gray-500 text-center py-20">No performance data available</p>
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
          ) : esgData ? (
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
            <p className="text-gray-500 text-center py-20">No ESG data available</p>
          )}
        </div>
      </section>

      {/* Risk & Reward */}
      {riskMetrics && (
        <section>
          <h2 className="text-xl font-medium mb-4">Risk Analysis</h2>
          <RiskRewardCard metrics={riskMetrics} />
        </section>
      )}

      {/* Report Generator */}
      <section>
        <h2 className="text-xl font-medium mb-4">Reports</h2>
        <ReportGenerator />
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>
        <TransactionTable
          transactions={
            transactions.map(t => ({
              ...t,
              amount: t.amount.toString(),
              category: t.category ?? undefined
            }))}
        />
      </section>
    </div>
  )
}