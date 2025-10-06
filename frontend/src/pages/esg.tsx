import ESGScoreList from '@/features/esg/ESGScoreList'

export default function ESGPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ESG Scores</h1>
      <ESGScoreList />
    </div>
  )
}