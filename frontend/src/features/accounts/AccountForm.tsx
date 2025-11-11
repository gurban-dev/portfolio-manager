'use client'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function AccountForm() {
  const [form, setForm] = useState({ name: '', institution: '', balance: '', currency: 'EUR' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/v1/accounts/', form)
    setForm({ name: '', institution: '', balance: '', currency: 'EUR' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Account Name"
        className="input"
      />
      <input
        value={form.institution}
        onChange={e => setForm({ ...form, institution: e.target.value })}
        placeholder="Institution"
        className="input"
      />
      <input
        type="number"
        value={form.balance}
        onChange={e => setForm({ ...form, balance: e.target.value })}
        placeholder="Balance"
        className="input"
      />
      <button type="submit" className="btn-primary w-full">Add Account</button>
    </form>
  )
}