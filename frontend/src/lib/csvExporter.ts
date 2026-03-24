import Papa from 'papaparse'

import { Transaction } from '@/lib/types'

export function exportTransactionsToCSV(transactions: Transaction[], filename: string) {
  const rows = transactions.map((transaction) => ({
    date: transaction.date,
    amount: transaction.amount,
    description: transaction.description,
    category: transaction.category ?? '',
    transaction_type: transaction.transaction_type,
    account:
      typeof transaction.account === 'object'
        ? transaction.account.name
        : transaction.account,
  }))

  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
