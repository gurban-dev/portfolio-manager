'use client'
import { useFetch } from '@/hooks/useFetch'
import { Transaction } from '@/lib/types'

export default function TransactionList() {
  const { data: transactions, loading, error } = useFetch<Transaction[]>('/api/v1/transactions/')

  if (loading) return <p>Loading transactions...</p>
  if (error) return <p>Error loading transactions.</p>

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th>Date</th><th>Description</th><th>Amount</th><th>Type</th>
        </tr>
      </thead>
      <tbody>
        {transactions?.map(tx => (
          <tr key={tx.id} className="border-b hover:bg-gray-50">
            <td>{tx.date}</td>
            <td>{tx.description}</td>
            <td>{tx.amount}</td>
            <td>{tx.transaction_type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}