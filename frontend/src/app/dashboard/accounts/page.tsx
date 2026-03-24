import AccountForm from '@/features/accounts/AccountForm'
import AccountList from '@/features/accounts/AccountList'

export const dynamic = 'force-dynamic'

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Accounts</h1>
      <AccountForm />
      <AccountList />
    </div>
  )
}
