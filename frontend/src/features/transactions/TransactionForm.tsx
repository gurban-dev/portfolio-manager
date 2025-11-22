'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Account } from '@/lib/types'

interface TransactionFormProps {
  onSuccess?: () => void
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [form, setForm] = useState({
    account: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    transaction_type: 'debit'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await api.get('/api/v1/accounts/')
        setAccounts(response.data)
        if (response.data.length > 0) {
          setForm(prev => ({ ...prev, account: response.data[0].id.toString() }))
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }
    fetchAccounts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/api/v1/transactions/', {
        ...form,
        account: Number(form.account),
        amount: parseFloat(form.amount),
      })
      setForm({ 
        account: accounts.length > 0 ? accounts[0].id.toString() : '',
        amount: '', 
        date: new Date().toISOString().split('T')[0], 
        description: '', 
        category: '',
        transaction_type: 'debit' 
      })
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <select
              value={form.account}
              onChange={e => setForm({ ...form, account: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select account...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Transaction description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="Category (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={form.transaction_type}
              onChange={e => setForm({ ...form, transaction_type: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
}