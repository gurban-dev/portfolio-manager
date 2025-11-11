// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import AccountCard from '@/components/AccountCard'
import TransactionTable from '@/components/TransactionTable'
import ESGScoreBadge from '@/components/ESGScoreBadge'
import NotificationBell from '@/components/NotificationBell'

interface Account {
  id: number
  name: string
  institution: string
  balance: string
  currency: string
}

interface Transaction {
  id: number
  amount: string
  description: string
  date: string
  category: string
  transaction_type: string
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          api.get('/api/v1/accounts/'),
          api.get('/api/v1/transactions/?limit=5'),
        ])
        setAccounts(accountsRes.data)
        setTransactions(transactionsRes.data.results || transactionsRes.data)
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
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>
        <TransactionTable transactions={transactions} />
      </section>

      {/* ESG Summary */}
      <section>
        <h2 className="text-xl font-medium mb-4">Sustainability Overview</h2>
        <div className="flex flex-wrap gap-4">
          <ESGScoreBadge label="Average CO₂ Impact" value="12.4 kg" variant="warning" />
          <ESGScoreBadge label="Avg. ESG Rating" value="8.7 / 10" variant="success" />
        </div>
      </section>
    </div>
  )
}