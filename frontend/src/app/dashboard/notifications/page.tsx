import NotificationList from '@/features/notifications/NotificationList'

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <NotificationList />
    </div>
  )
}
