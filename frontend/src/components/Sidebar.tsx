'use client'

import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Leaf,
  Bell,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: CreditCard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/esg', label: 'ESG', icon: Leaf },
  { href: '/notifications', label: 'Notifications', icon: Bell },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 shadow-sm">
      <div className="px-6 py-4 font-semibold text-xl border-b border-gray-100">
        FinTrack
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}