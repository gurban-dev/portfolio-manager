'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts'
import { format } from 'date-fns'
import { ESGDataPoint } from '@/lib/types'

interface ESGChartProps {
  data: ESGDataPoint[]
}

export default function ESGChart({ data }: ESGChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    date: format(new Date(point.date), 'MMM dd'),
    co2_kg: Number(point.co2_kg.toFixed(2)),
    rating: Number(point.rating.toFixed(2))
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            domain={[0, 10]}
            label={{ value: 'ESG Rating', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'CO₂ Impact') {
                return [`${value.toFixed(2)} kg`, name]
              }
              return [`${value.toFixed(2)} / 10`, name]
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="co2_kg" 
            fill="#f59e0b" 
            fillOpacity={0.6}
            stroke="#f59e0b"
            strokeWidth={2}
            name="CO₂ Impact"
          />
          <Bar 
            yAxisId="right"
            dataKey="rating" 
            fill="#10b981" 
            name="ESG Rating"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

