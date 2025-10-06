import TransactionList from '@/features/transactions/TransactionList'
import TransactionForm from '@/features/transactions/TransactionForm'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <TransactionForm />
      <TransactionList />
    </div>
  )
}