'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { PerformanceDataPoint } from '@/lib/types'

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
  currency: string
}

export default function PerformanceChart({ data, currency }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No Performance Data Available</p>
          <p className="text-sm mt-2">Create some transactions to see your portfolio performance over time.</p>
        </div>
      </div>
    )
  }

  const formattedData = data.map(point => ({
    ...point,
    date: format(new Date(point.date), 'MMM dd'),
    value: Number(point.value.toFixed(2))
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${currency} ${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number) => [`${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Portfolio Value']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Portfolio Value"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

