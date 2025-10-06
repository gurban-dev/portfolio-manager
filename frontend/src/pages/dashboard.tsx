import AccountList from '@/features/accounts/AccountList'
import TransactionList from '@/features/transactions/TransactionList'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AccountList />
      <TransactionList />
    </div>
  )
}