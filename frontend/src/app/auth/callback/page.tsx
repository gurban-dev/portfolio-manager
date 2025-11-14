'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth/authService';

export default function AuthCallbackPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Callback URL in browser:", window.location.href);
    }

    const handleCallback = async () => {
      try {
        // Null check.
        if (!searchParams) {
          throw new Error('Search parameters not available');
        }else{
          console.log('searchParams.toString():', searchParams.toString());
        }

        const code = searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code received from Google');
        }else{
          console.log('✅ Authorization code received:', code);
        }

        const state = searchParams.get('state');

        // State is optional - just log if present.
        if (state) {
          console.log('📋 State parameter:', state);
          // Optionally verify state matches what you sent
        } else {
          console.log('ℹ️ No state parameter (optional)');
        }

        // Send the code to your backend.
        const { user, created } = await authService.loginWithGoogleAuthCode(code);

        console.log('✅ Login successful:', user);

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err: any) {
        console.error('❌ Authentication error:', err);

        setError(err.message || 'Authentication failed');

        setLoading(false);
      }
    };

    if (searchParams) {
      handleCallback();
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Authenticating with Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}