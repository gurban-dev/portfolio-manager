'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { FileText, Loader } from 'lucide-react'

export default function ReportGenerator() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateReport = async () => {
    setGenerating(true)
    setError(null)

    try {
      const response = await api.get('/api/v1/reports/monthly/', {
        responseType: 'blob',
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `portfolio-report-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Portfolio Report</h3>
      <p className="text-sm text-gray-600 mb-4">
        Generate a comprehensive PDF report of your portfolio performance, ESG impact, and risk analysis for the last 30 days.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerateReport}
        disabled={generating}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </>
        )}
      </button>
    </div>
  )
}

