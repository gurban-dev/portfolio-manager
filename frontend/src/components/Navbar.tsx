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
      <h1 className="text-lg font-semibold text-gray-800">
        FinSight Dashboard
      </h1>

      <nav className="flex justify-between items-center px-12 py-4 shadow-sm bg-white/70 backdrop-blur-md">
        {/* Left navigation buttons */}
        <div className="flex gap-4 items-center">
          {["About", "Contact", "Pricing"].map((item) => (
            <button
              key={item}
              className="relative px-4 py-2 text-sm font-medium text-slate-700
                        hover:text-slate-900 transition-all duration-200
                        rounded-lg group"
            >
              {item}
              <span
                className="absolute left-1/2 -bottom-[2px] w-0 h-[2px] bg-gradient-to-r
                          from-indigo-500 via-sky-500 to-blue-500
                          group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"
              ></span>
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="flex gap-5 items-center">
          {/* If auth check not done yet, show nothing */}
          {!checked && null}

          {/* Logged-out links */}
          {checked && !user && (
            <>
              <Link
                href="/auth/login"
                className="relative text-sm font-medium text-gray-700
                          hover:text-slate-900 transition-all duration-200
                          hover:bg-slate-100 px-3 py-1 rounded-lg group"
              >
                Login
                <span
                  className="absolute left-1/2 -bottom-[2px] w-0 h-[2px]
                            bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500
                            group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"
                ></span>
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
              <NotificationBell />

              <span className="text-sm font-medium text-gray-700">
                Hi, {user.username}
              </span>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
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