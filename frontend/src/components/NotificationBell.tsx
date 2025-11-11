'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'

export default function NotificationBell() {
  const { user, checked } = useAuth() // `checked` indicates auth check is done
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch notifications if user is logged in and auth check is done
    if (!checked || !user) return

    const fetchNotifications = async () => {
      setLoading(true)

      try {
        // api is an Axios instance.
        /* ? separates the endpoint path from query parameters.

           unread=true is a key-value pair:

           unread is the name of the filter parameter the backend expects.

           true is the value — meaning: return only notifications that
           are unread. */
        const res = await api.get('/api/v1/notifications/?unread=true')

        setUnreadCount(res.data.length)
      } catch (err: any) {
        console.error('Failed to fetch notifications:', err)
        setError('Unable to load notifications')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Optional: setup polling or WebSocket for real-time notifications
    // const interval = setInterval(fetchNotifications, 60000)
    // return () => clearInterval(interval)
  }, [user, checked])

  // Render nothing if user not logged in
  if (!checked || !user) return null

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />

      {loading && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
      )}

      {unreadCount > 0 && !loading && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      {error && (
        <p className="text-xs text-red-500 absolute mt-6">{error}</p>
      )}
    </div>
  )
}