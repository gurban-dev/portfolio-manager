'use client'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/auth/register/', form)
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input" />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input" />
        <button type="submit" className="btn-primary w-full">Register</button>
      </form>
    </div>
  )
}