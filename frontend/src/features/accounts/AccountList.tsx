'use client'
import { useFetch } from '@/hooks/useFetch'
import { Account } from '@/lib/types'
import AccountCard from '@/components/AccountCard'

export default function AccountList() {
  const { data: accounts, loading, error } = useFetch<Account[]>('/api/v1/accounts/')

  if (loading) return <p>Loading accounts...</p>
  if (error) return <p>Error loading accounts.</p>

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts?.map(acc => (
        <AccountCard account={{
          id: acc.id,
          name: '',
          institution: '',
          balance: '',
          currency: ''
        }}>
          <h3 className="font-semibold">{acc.name}</h3>

          <p>{acc.institution}</p>

          <p className="text-sm text-gray-600">
            {acc.balance} {acc.currency}
          </p>
        </AccountCard>
      ))}
    </div>
  )
}