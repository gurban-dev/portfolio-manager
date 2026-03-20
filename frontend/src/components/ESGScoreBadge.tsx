'use client'

import React from 'react'

interface ESGScoreBadgeProps {
  label: string
  value: string
  variant?: 'success' | 'warning' | 'danger'
}

const variantStyles = {
  success: 'bg-green-100 text-green-700 border-green-300',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  danger: 'bg-red-100 text-red-700 border-red-300',
}

export default function ESGScoreBadge({
  label,
  value,
  variant = 'success',
}: ESGScoreBadgeProps) {
  return (
    <div
      className={`flex flex-col items-start border rounded-xl px-4 py-3 w-48 shadow-sm ${variantStyles[variant]}`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  )
}