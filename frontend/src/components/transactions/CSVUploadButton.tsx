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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedAccount) {
      alert('Please select an account and a file')
      return
    }

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
      setResult({
        created: 0,
        errors: [{ error: error.response?.data?.detail || 'Upload failed' }],
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
        </div>

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
                <p className="text-sm font-medium text-yellow-800 mb-1">Errors:</p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {result.errors.slice(0, 5).map((err: any, idx: number) => (
                    <li key={idx}>
                      Row {err.row}: {err.error}
                    </li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>... and {result.errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

