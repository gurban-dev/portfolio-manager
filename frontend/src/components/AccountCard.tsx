'use client'

import React from 'react'
import { BanknoteIcon } from 'lucide-react'

interface AccountCardProps {
  account: {
    id: number
    name: string
    institution: string
    balance: string
    currency: string
  }
  children?: React.ReactNode
}

export default function AccountCard({ account }: AccountCardProps) {
  const { name, institution, balance, currency } = account

  return (
    <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BanknoteIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        </div>
        <span className="text-sm text-gray-500">{institution}</span>
      </div>

      <div className="text-2xl font-bold text-gray-900">
        {Number(balance).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{' '}
        <span className="text-base text-gray-600">{currency}</span>
      </div>
    </div>
  )
}