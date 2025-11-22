import { Transaction } from '@/lib/types'
import Papa from 'papaparse'

export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'transactions.csv') {
  const csvData = transactions.map(tx => ({
    date: tx.date,
    amount: tx.amount,
    description: tx.description,
    category: tx.category || '',
    transaction_type: tx.transaction_type,
  }))

  const csv = Papa.unparse(csvData)
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

