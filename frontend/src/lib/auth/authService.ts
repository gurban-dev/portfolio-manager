import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export const authService = {
  // Store tokens in localStorage
  setTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Google OAuth login
  async loginWithGoogle(googleAccessToken: string) {
    try {
      console.log('In lib/auth/authService.ts loginWithGoogle() googleAccessToken:', googleAccessToken);

      const response = await axios.post(`${API_URL}/api/auth/google/`, {
        access_token: googleAccessToken,
      });

      const { access, refresh, user } = response.data;
      
      this.setTokens({ access, refresh });
      
      return { user, created: response.data.created };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Google login failed');
    }
  },

  // Google OAuth login (redirect-based auth-code flow)
  async loginWithGoogleAuthCode(authCode: string) {
    try {
      const url = `${API_URL}/api/auth/google/callback/`;

      console.log('src/lib/auth/authService.ts loginWithGoogleAuthCode() Calling URL:', url);

      const response = await axios.post(`${API_URL}/api/auth/google/callback/`, {
        code: authCode,
      });

      const { access, refresh, user } = response.data;

      this.setTokens({ access, refresh });
      
      return { user, created: response.data.created };
    } catch (error: any) {
      console.log('src/lib/auth/authService.ts typeof error:', typeof error);

      throw new Error(error || 'Google login failed');
    }
  },

  // Traditional email/password login
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        password,
      });

      const { access_token, refresh_token, user } = response.data;
      
      this.setTokens({ access: access_token, refresh: refresh_token });
      
      return { user };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Register new user
  async register(email: string, password1: string, password2: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/registration/`, {
        email,
        password1,
        password2,
      });

      const { access_token, refresh_token, user } = response.data;
      
      this.setTokens({ access: access_token, refresh: refresh_token });
      
      return { user };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Logout
  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await axios.post(`${API_URL}/api/auth/logout/`, {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getAccessToken();
      if (!token) return null;

      const response = await axios.get(`${API_URL}/api/auth/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return null;
    }
  },
};