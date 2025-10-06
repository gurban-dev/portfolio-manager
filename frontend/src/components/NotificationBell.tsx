'use client'

import React, { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { api } from '@/lib/api'

interface Notification {
  id: number
  message: string
  read: boolean
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    async function fetchNotifications() {
      try {
        // api is an Axios instance.
        /* ? separates the endpoint path from query parameters.

           unread=true is a key-value pair:

           unread is the name of the filter parameter the backend expects.

           true is the value — meaning: return only notifications that
           are unread. */
        const res = await api.get('/notifications/?unread=true')

        setNotifications(res.data)
      } catch (error) {
        console.error('Failed to fetch notifications', error)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <button className="relative hover:opacity-80 transition">
      {unreadCount > 0 ? (
        <>
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
            {unreadCount}
          </span>
        </>
      ) : (
        <BellOff className="w-6 h-6 text-gray-400" />
      )}
    </button>
  )
}