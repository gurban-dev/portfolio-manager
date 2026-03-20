'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This route is kept for backwards compatibility with older Navbar links.
// The real email login UI lives at `/auth` (frontend/src/app/auth/page.tsx).
export default function Login() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth')
  }, [router])

  return null
}