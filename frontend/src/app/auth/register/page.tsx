'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { authService } from '@/lib/auth/authService'
import { Leaf, Check, X, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'text-red-500' }
    if (strength <= 3) return { strength, label: 'Fair', color: 'text-yellow-500' }
    if (strength <= 4) return { strength, label: 'Good', color: 'text-blue-500' }
    return { strength, label: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password1)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password1) {
      errors.password1 = 'Password is required'
    } else if (formData.password1.length < 8) {
      errors.password1 = 'Password must be at least 8 characters'
    } else if (!/[a-z]/.test(formData.password1) || !/[A-Z]/.test(formData.password1)) {
      errors.password1 = 'Password must contain both uppercase and lowercase letters'
    } else if (!/\d/.test(formData.password1)) {
      errors.password1 = 'Password must contain at least one number'
    }

    // Password confirmation
    if (!formData.password2) {
      errors.password2 = 'Please confirm your password'
    } else if (formData.password1 !== formData.password2) {
      errors.password2 = 'Passwords do not match'
    }

    // Terms acceptance
    if (!acceptedTerms) {
      errors.terms = 'You must accept the Terms of Service and Privacy Policy'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await authService.register(
        formData.email,
        formData.password1,
        formData.password2
      )

      router.push('/dashboard')
  
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed'
      setError(errorMessage)
      
      // Handle field-specific errors from backend
      if (err.response?.data) {
        const backendErrors = err.response.data
        const fieldErrors: Record<string, string> = {}
        
        if (backendErrors.email) fieldErrors.email = Array.isArray(backendErrors.email) ? backendErrors.email[0] : backendErrors.email
        if (backendErrors.password1) fieldErrors.password1 = Array.isArray(backendErrors.password1) ? backendErrors.password1[0] : backendErrors.password1
        if (backendErrors.password2) fieldErrors.password2 = Array.isArray(backendErrors.password2) ? backendErrors.password2[0] : backendErrors.password2
        if (backendErrors.non_field_errors) fieldErrors.general = Array.isArray(backendErrors.non_field_errors) ? backendErrors.non_field_errors[0] : backendErrors.non_field_errors

        setValidationErrors(fieldErrors)
        if (fieldErrors.general) {
          setError(fieldErrors.general)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-lg">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-lg text-gray-600">Create your FinSight account</p>
          <p className="text-sm text-gray-500 mt-1">Start managing your sustainable portfolio today</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Google Registration Button */}
          <GoogleLoginButton />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">Or register with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    validationErrors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
                {formData.email && !validationErrors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {validationErrors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {validationErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password1" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password1"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password1}
                  onChange={(e) => handleInputChange('password1', e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${
                    validationErrors.password1 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Create a strong password"
                  aria-invalid={!!validationErrors.password1}
                  aria-describedby={validationErrors.password1 ? 'password1-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password1 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 2 
                          ? 'bg-red-500' 
                          : passwordStrength.strength <= 3
                          ? 'bg-yellow-500'
                          : passwordStrength.strength <= 4
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {validationErrors.password1 && (
                <p id="password1-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {validationErrors.password1}
                </p>
              )}
              
              {/* Password Requirements */}
              {formData.password1 && (
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li className={`flex items-center gap-2 ${formData.password1.length >= 8 ? 'text-green-600' : ''}`}>
                    {formData.password1.length >= 8 ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password1) && /[A-Z]/.test(formData.password1) ? 'text-green-600' : ''}`}>
                    {/[a-z]/.test(formData.password1) && /[A-Z]/.test(formData.password1) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    Uppercase and lowercase letters
                  </li>
                  <li className={`flex items-center gap-2 ${/\d/.test(formData.password1) ? 'text-green-600' : ''}`}>
                    {/\d/.test(formData.password1) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    At least one number
                  </li>
                </ul>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password2" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password2}
                  onChange={(e) => handleInputChange('password2', e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${
                    validationErrors.password2 
                      ? 'border-red-300 bg-red-50' 
                      : formData.password2 && formData.password1 === formData.password2
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Re-enter your password"
                  aria-invalid={!!validationErrors.password2}
                  aria-describedby={validationErrors.password2 ? 'password2-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {formData.password2 && formData.password1 === formData.password2 && !validationErrors.password2 && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {validationErrors.password2 && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {validationErrors.password2 && (
                <p id="password2-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {validationErrors.password2}
                </p>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked)
                    if (validationErrors.terms) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.terms
                        return newErrors
                      })
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                  aria-invalid={!!validationErrors.terms}
                  aria-describedby={validationErrors.terms ? 'terms-error' : undefined}
                />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-green-600 hover:text-green-700 font-semibold underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 font-semibold underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {validationErrors.terms && (
              <p id="terms-error" className="text-sm text-red-600 flex items-center gap-1 -mt-3 ml-7">
                <X className="w-4 h-4" />
                {validationErrors.terms}
              </p>
            )}

            {/* General Error Display */}
            {error && !Object.keys(validationErrors).some(key => key !== 'general') && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security & Trust Indicators */}
        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR Compliant</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Your data is secure and will never be shared with third parties
          </p>
        </div>
      </div>
    </div>
  )
}