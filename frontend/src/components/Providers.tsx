'use client'

import { GoogleAuthProvider } from '@/lib/auth/GoogleAuthProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
      {children}
    </GoogleAuthProvider>
  )
}