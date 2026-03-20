'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import ErrorMessage from '@/components/ErrorMessage'

export default function ReportGenerator() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerateReport = async () => {
    setGenerating(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.get('/api/v1/reports/monthly/', {
        responseType: 'blob',
        timeout: 60000, // 60 second timeout for large reports
      })

      // Check if response is actually a PDF
      if (response.data.type && !response.data.type.includes('pdf')) {
        // Might be an error JSON response
        const text = await response.data.text()
        try {
          const errorData = JSON.parse(text)
          throw new Error(errorData.error || 'Failed to generate report')
        } catch {
          throw new Error('Received invalid response from server')
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      const today = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `portfolio-report-${today}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Report generation error:', err)
      
      // Try to parse error if it's a blob
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const errorData = JSON.parse(text)
          setError(errorData.error || 'Failed to generate report')
        } catch {
          setError(err.message || 'Failed to generate report. Please try again.')
        }
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to generate report')
      }
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
        <div className="mb-4">
          <ErrorMessage error={error} />
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Report generated successfully! Check your downloads.</span>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
        >
          {generating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate PDF Report</span>
            </>
          )}
        </button>
        
        {generating && (
          <p className="text-xs text-gray-500 text-center">
            This may take a few moments for large portfolios...
          </p>
        )}
      </div>
    </div>
  )
}

