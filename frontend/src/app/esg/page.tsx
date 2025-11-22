import ESGScoreList from '@/features/esg/ESGScoreList'
import RecommendationsPanel from '@/components/esg/RecommendationsPanel'

export default function ESGPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ESG Impact & Recommendations</h1>
      
      <RecommendationsPanel />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">ESG Scores</h2>
        <ESGScoreList />
      </div>
    </div>
  )
}