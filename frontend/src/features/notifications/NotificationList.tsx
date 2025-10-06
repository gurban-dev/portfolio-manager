'use client'
import { useFetch } from '@/hooks/useFetch'
import { Notification } from '@/lib/types'

export default function NotificationList() {
  const { data: notifications, loading, error } = useFetch<Notification[]>('/notifications/')

  if (loading) return <p>Loading notifications...</p>
  if (error) return <p>Error loading notifications.</p>

  return (
    <ul className="space-y-2">
      {notifications?.map(n => (
        <li key={n.id} className={`p-3 border rounded ${n.is_read ? 'opacity-50' : ''}`}>
          <p>{n.message}</p>
          <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}