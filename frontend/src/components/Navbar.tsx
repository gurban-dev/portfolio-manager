'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, checked, logout } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">FinTrack Dashboard</h1>
        <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white/70 backdrop-blur-md">
          {/* <h1 className="text-2xl font-bold text-slate-800">FinSight</h1> */}

          <div className="flex gap-4 items-center">
            {/* If auth check not done yet, show nothing */}
            {!checked && null}

            {/* Logged-out links */}
            {checked && !user && (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Logged-in links */}
            {checked && user && (
              <>
                {/* Only mounts for logged-in users */}
                <NotificationBell />

                <span className="text-sm font-medium text-gray-700">
                  Hi, {user.username}
                </span>

                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
    </header>
  )
}