'use client'
import { useFetch } from '@/hooks/useFetch'
import { ESGScore } from '@/lib/types'

export default function ESGScoreList() {
  const { data: scores, loading, error } = useFetch<ESGScore[]>('/api/v1/investments/esg-scores/')

  if (loading) return <p>Loading ESG scores...</p>
  if (error) return <p>Error loading ESG scores.</p>

  return (
    <div className="space-y-2">
      {scores?.map(s => (
        <div key={s.id} className="p-3 border rounded">
          <p>CO₂ Impact: {s.co2_impact} kg</p>
          <p>Rating: {s.sustainability_rating}/10</p>
        </div>
      ))}
    </div>
  )
}