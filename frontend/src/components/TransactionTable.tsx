'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  id: number
  amount: string
  description: string
  date: string
  category?: string
  transaction_type: string
}

interface Props {
  transactions: Transaction[]
}

export default function TransactionTable({ transactions }: Props) {
  if (!transactions?.length) {
    return (
      <div className="text-gray-500 text-sm">
        No recent transactions available.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Description</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">{tx.date}</td>
              <td className="px-4 py-3">{tx.description}</td>
              <td className="px-4 py-3 text-gray-600">
                {tx.category || '—'}
              </td>
              <td
                className={`px-4 py-3 text-right font-medium ${
                  tx.transaction_type === 'credit'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                <div className="flex justify-end items-center gap-1">
                  {tx.transaction_type === 'credit' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {tx.amount}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}