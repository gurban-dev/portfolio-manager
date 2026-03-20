'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Download, CheckCircle, AlertCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'

export default function DataExportButton() {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.get('/api/v1/users/export-data/', {
        responseType: 'blob',
      })

      // Check if response is JSON (error)
      if (response.data.type && response.data.type.includes('json')) {
        const text = await response.data.text()
        const errorData = JSON.parse(text)
        throw new Error(errorData.detail || 'Export failed')
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url
      const today = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `finsight-data-export-${today}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Data export error:', err)
      
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const errorData = JSON.parse(text)
          setError(errorData.detail || errorData.error || 'Failed to export data')
        } catch {
          setError(err.message || 'Failed to export data. Please try again.')
        }
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to export data')
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Data Export (GDPR)</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download all your data in JSON format. This includes your accounts, transactions, 
        ESG scores, and notifications as required by GDPR.
      </p>

      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} />
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Data exported successfully! Check your downloads.</span>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export My Data</span>
          </>
        )}
      </button>
    </div>
  )
}

