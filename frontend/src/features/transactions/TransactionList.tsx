'use client'
import { useState, useEffect, useMemo } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { Transaction } from '@/lib/types'
import { format } from 'date-fns'
import { FilterState } from '@/components/transactions/TransactionFilters'

interface TransactionListProps {
  filters?: FilterState
}

export default function TransactionList({ filters }: TransactionListProps) {
  const { data: transactions, loading, error } = useFetch<Transaction[]>('/api/v1/transactions/')

  const filteredTransactions = useMemo(() => {
    if (!transactions || !filters) return transactions || []

    return transactions.filter(tx => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          tx.description.toLowerCase().includes(searchLower) ||
          tx.category?.toLowerCase().includes(searchLower) ||
          tx.amount.toString().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Account filter
      if (filters.accountId && tx.account) {
        const accountId = typeof tx.account === 'object' ? tx.account.id : tx.account
        if (accountId !== filters.accountId) return false
      }

      // Category filter
      if (filters.category && tx.category?.toLowerCase() !== filters.category.toLowerCase()) {
        return false
      }

      // Transaction type filter
      if (filters.transactionType && tx.transaction_type !== filters.transactionType) {
        return false
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const txDate = new Date(tx.date)
        if (filters.startDate && txDate < new Date(filters.startDate)) return false
        if (filters.endDate && txDate > new Date(filters.endDate)) return false
      }

      return true
    })
  }, [transactions, filters])

  if (loading) return <p className="text-gray-500">Loading transactions...</p>
  if (error) return <p className="text-red-500">Error loading transactions.</p>

  if (!filteredTransactions || filteredTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No transactions found
      </div>
    )
  }

  return (
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
            {filteredTransactions.map(tx => {
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
  )
}