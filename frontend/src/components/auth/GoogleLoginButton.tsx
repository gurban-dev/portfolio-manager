'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '@/lib/auth/authService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    onSuccess: async (codeResponse) => {
      console.log('✅ Google OAuth success — codeResponse:', codeResponse);

      setIsLoading(true);
      setError(null);

      try {
        // Send the authorization code to your backend
        const { user, created } = await authService.loginWithGoogleAuthCode(
          codeResponse.code
        );

        console.log('Login successful:', user);

        console.log('✅ Backend response:', { user, created });

        // Redirect to dashboard
        router.push('/dashboard');
        
        if (created) {
          // Show welcome message for new users
          console.log('Welcome! Your account has been created.');
        }
      } catch (err: any) {
        console.error('❌ Backend error:', err);

        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
        }

        setError(err.message || 'Failed to login with Google');
        console.error('Google login error:', err);
      } finally {
        console.log('ℹ️ Google login process finished');

        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('❌ Google OAuth client error:', errorResponse);
      setError('Google login was cancelled or failed');
    },
  });

  return (
    <div className="w-full">
      <button
        onClick={() => googleLogin()}
        disabled={isLoading}
        className="
          w-full flex items-center justify-center
          gap-3 px-4 py-3 bg-white border border-gray-300
          rounded-lg hover:bg-gray-50 transition-colors
          cursor-pointer disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-gray-700 font-medium">
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </span>
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}