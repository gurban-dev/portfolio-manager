'use client'

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProvider } from '@/lib/auth/GoogleAuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAuthProvider>
        {children}
      </GoogleAuthProvider>
    </GoogleOAuthProvider>
  )
}