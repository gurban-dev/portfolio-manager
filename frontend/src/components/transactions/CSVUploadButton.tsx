'use client'

import { useState, useRef } from 'react'
import { api } from '@/lib/api'
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react'
import { Account } from '@/lib/types'

interface CSVUploadButtonProps {
  accounts: Account[]
  onSuccess?: () => void
}

export default function CSVUploadButton({ accounts, onSuccess }: CSVUploadButtonProps) {
  const [selectedAccount, setSelectedAccount] = useState<number | ''>('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ created: number; errors: any[] } | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedAccount) {
      alert('Please select an account and a file')
      return
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 5MB`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Preview file (read first few lines)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').slice(0, 6) // First 5 data rows + header
      setFilePreview(lines.join('\n'))
    }
    reader.readAsText(file.slice(0, 1000)) // Read first 1KB for preview

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('account', selectedAccount.toString())

      const response = await api.post('/api/v1/transactions/import_csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(response.data)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      const errorData = error.response?.data || {}
      setResult({
        created: 0,
        errors: errorData.errors || [{ 
          row: 0, 
          error: errorData.detail || error.message || 'Upload failed',
          message: errorData.detail || 'Upload failed'
        }],
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Import Transactions from CSV</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(Number(e.target.value) || '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={uploading}
          >
            <option value="">Choose an account...</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.currency})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={uploading || !selectedAccount}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            CSV format: date, amount, description, category, transaction_type (credit/debit)
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Maximum file size: 5MB
          </p>
        </div>

        {filePreview && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">File Preview (first 5 rows):</p>
            <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap overflow-x-auto max-h-32">
              {filePreview}
            </pre>
          </div>
        )}

        {uploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Uploading and processing...</span>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg ${result.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.errors.length === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-medium ${result.errors.length === 0 ? 'text-green-800' : 'text-yellow-800'}`}>
                {result.created} transactions imported
              </span>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-yellow-800 mb-1">Errors ({result.errors.length}):</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.errors.slice(0, 10).map((err: any, idx: number) => (
                    <div key={idx} className="bg-yellow-100 rounded p-2 text-xs">
                      <p className="font-semibold text-yellow-900">
                        Row {err.row || 'N/A'}: {err.message || err.error || 'Validation error'}
                      </p>
                      {err.errors && Array.isArray(err.errors) && err.errors.length > 0 && (
                        <ul className="mt-1 ml-4 list-disc text-yellow-800">
                          {err.errors.map((fieldErr: any, fieldIdx: number) => (
                            <li key={fieldIdx}>
                              <span className="font-medium">{fieldErr.field}</span>: {fieldErr.message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {result.errors.length > 10 && (
                    <p className="text-xs text-yellow-700 italic">
                      ... and {result.errors.length - 10} more errors (showing first 10)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

