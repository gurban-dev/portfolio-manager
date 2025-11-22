'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import TransactionList from '@/features/transactions/TransactionList'
import TransactionForm from '@/features/transactions/TransactionForm'
import CSVUploadButton from '@/components/transactions/CSVUploadButton'
import TransactionFilters, { FilterState } from '@/components/transactions/TransactionFilters'
import { exportTransactionsToCSV } from '@/lib/csvExporter'
import { Download } from 'lucide-react'
import { Account, Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    accountId: '',
    category: '',
    transactionType: '',
    startDate: '',
    endDate: '',
  })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await api.get('/api/v1/accounts/')
        setAccounts(response.data)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }
    fetchAccounts()
  }, [])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await api.get('/api/v1/transactions/')
        setTransactions(response.data.results || response.data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      }
    }
    fetchTransactions()
  }, [refreshKey])

  const handleExport = () => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }
    exportTransactionsToCSV(transactions, `transactions-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleImportSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <CSVUploadButton accounts={accounts} onSuccess={handleImportSuccess} />

      <TransactionForm onSuccess={() => setRefreshKey(prev => prev + 1)} />

      <TransactionFilters accounts={accounts} onFilterChange={setFilters} />

      <TransactionList filters={filters} />
    </div>
  )
}