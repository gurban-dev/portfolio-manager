'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const handleLogout = () => {
    // Replace with actual logout logic
    console.log('Logging out...')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">FinTrack Dashboard</h1>

      <div className="flex items-center gap-6">
        <NotificationBell />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  )
}