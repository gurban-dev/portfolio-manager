/**
 * Centralized error handling utilities
 */

export interface ApiError {
  message: string
  detail?: string
  errors?: Array<{ field: string; message: string }>
  status?: number
}

export function handleApiError(error: any): ApiError {
  // Handle network errors
  if (!error.response) {
    return {
      message: error.message || 'Network error. Please check your connection.',
      status: 0,
    }
  }

  // Handle HTTP errors
  const { status, data } = error.response

  // Handle validation errors
  if (status === 400 && data.errors) {
    return {
      message: data.detail || 'Validation failed',
      detail: data.detail,
      errors: Array.isArray(data.errors) ? data.errors : [],
      status,
    }
  }

  // Handle standard error responses
  return {
    message: data.detail || data.error || data.message || `Error ${status}`,
    detail: data.detail,
    status,
  }
}

export function getErrorMessage(error: any): string {
  const apiError = handleApiError(error)
  return apiError.message
}

export function logError(error: any, context?: string) {
  const apiError = handleApiError(error)
  
  console.error(`[${context || 'API'}] Error:`, {
    message: apiError.message,
    status: apiError.status,
    errors: apiError.errors,
    originalError: error,
  })
}

