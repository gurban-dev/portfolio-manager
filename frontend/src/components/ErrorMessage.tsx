'use client'

import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

interface ErrorMessageProps {
  error: string | Error | null
  onDismiss?: () => void
  className?: string
}

export default function ErrorMessage({ error, onDismiss, className = '' }: ErrorMessageProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!error || dismissed) return null

  const errorMessage = error instanceof Error ? error.message : error

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) onDismiss()
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

