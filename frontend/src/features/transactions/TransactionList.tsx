'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Transaction } from '@/lib/types'
import { format } from 'date-fns'
import { FilterState } from '@/components/transactions/TransactionFilters'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TransactionListProps {
  filters?: FilterState
}

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Transaction[]
}

export default function TransactionList({ filters }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  const buildQueryParams = () => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    
    if (filters) {
      if (filters.search) params.append('search', filters.search)
      if (filters.accountId) params.append('account_id', filters.accountId.toString())
      if (filters.category) params.append('category', filters.category)
      if (filters.transactionType) params.append('transaction_type', filters.transactionType)
      if (filters.startDate) params.append('start_date', filters.startDate)
      if (filters.endDate) params.append('end_date', filters.endDate)
    }
    
    return params.toString()
  }

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1)
  }, [filters?.search, filters?.accountId, filters?.category, filters?.transactionType, filters?.startDate, filters?.endDate])

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      setError(null)
      
      try {
        const queryParams = buildQueryParams()
        const response = await api.get<PaginatedResponse>(`/api/v1/transactions/?${queryParams}`)
        
        setTransactions(response.data.results || [])
        setTotalCount(response.data.count || 0)
        setHasNext(!!response.data.next)
        setHasPrevious(!!response.data.previous)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load transactions')
        console.error('Failed to fetch transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [page, pageSize, filters])

  if (loading && transactions.length === 0) {
    return <LoadingSpinner text="Loading transactions..." className="py-12" />
  }

  if (error && transactions.length === 0) {
    return <ErrorMessage error={error} />
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No transactions found
      </div>
    )
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(tx => {
                const account = typeof tx.account === 'object' ? tx.account : null
                const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount
                const isCredit = tx.transaction_type === 'credit'
                
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.category || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}{Math.abs(amount).toFixed(2)} {account?.currency || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isCredit 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} transactions
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrevious}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={!hasNext}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
