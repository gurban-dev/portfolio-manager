'use client'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function TransactionForm() {
  const [form, setForm] = useState({
    account: '',
    amount: '',
    date: '',
    description: '',
    transaction_type: 'debit'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/v1/transactions/', form)
    setForm({ account: '', amount: '', date: '', description: '', transaction_type: 'debit' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
        className="input"
      />
      <input
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className="input"
      />
      <input
        type="number"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
        placeholder="Amount"
        className="input"
      />
      <select
        value={form.transaction_type}
        onChange={e => setForm({ ...form, transaction_type: e.target.value })}
        className="input"
      >
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>
      <button type="submit" className="btn-primary w-full">Add Transaction</button>
    </form>
  )
}