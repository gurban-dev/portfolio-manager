'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(form)
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="input"
        />
        <button type="submit" className="btn-primary w-full">Login</button>
      </form>
    </div>
  )
}