'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { Save, CheckCircle } from 'lucide-react'
import DataExportButton from './DataExportButton'

interface UserPreferences {
  preferred_currency: string
  risk_tolerance: string
  esg_preference: number
}

export default function SettingsPage() {
  const { user, checked } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_currency: 'EUR',
    risk_tolerance: 'moderate',
    esg_preference: 70,
  })

  useEffect(() => {
    if (user) {
      setPreferences({
        preferred_currency: user.preferred_currency || 'EUR',
        risk_tolerance: user.risk_tolerance || 'moderate',
        esg_preference: user.esg_preference || 70,
      })
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await api.patch('/api/v1/users/me/', preferences)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
      // Refresh user data
      if (user) {
        const response = await api.get('/api/v1/users/me/')
        // Update user context if needed
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (!checked) {
    return <LoadingSpinner text="Loading..." className="py-12" />
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access settings.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      {error && <ErrorMessage error={error} />}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">Preferences saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Preferred Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Currency
          </label>
          <select
            id="currency"
            value={preferences.preferred_currency}
            onChange={(e) => setPreferences({ ...preferences, preferred_currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="EUR">Euro (EUR)</option>
            <option value="NOK">Norwegian Krone (NOK)</option>
            <option value="SEK">Swedish Krona (SEK)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="CHF">Swiss Franc (CHF)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This currency will be used for portfolio calculations and reports.
          </p>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label htmlFor="risk" className="block text-sm font-medium text-gray-700 mb-2">
            Risk Tolerance
          </label>
          <select
            id="risk"
            value={preferences.risk_tolerance}
            onChange={(e) => setPreferences({ ...preferences, risk_tolerance: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Your risk tolerance affects investment recommendations and portfolio analysis.
          </p>
        </div>

        {/* ESG Preference */}
        <div>
          <label htmlFor="esg" className="block text-sm font-medium text-gray-700 mb-2">
            ESG Preference Score
          </label>
          <div className="space-y-2">
            <input
              type="range"
              id="esg"
              min="0"
              max="100"
              value={preferences.esg_preference}
              onChange={(e) => setPreferences({ ...preferences, esg_preference: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 (Not Important)</span>
              <span className="font-semibold text-green-600">{preferences.esg_preference}%</span>
              <span>100 (Very Important)</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            How important is ESG (Environmental, Social, Governance) in your investment decisions?
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Data Export Section */}
      <div className="mt-8">
        <DataExportButton />
      </div>
    </div>
  )
}

