import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@/lib/env';

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

  extractTokens(payload: Record<string, unknown>): AuthTokens {
    const access = String(payload.access ?? payload.access_token ?? '');
    const refresh = String(payload.refresh ?? payload.refresh_token ?? '');

    if (!access || !refresh) {
      throw new Error('Authentication response is missing tokens');
    }

    return { access, refresh };
  },

  persistSession(accessToken: string) {
    const decoded: any = jwtDecode(accessToken);
    const expires = new Date(decoded.exp * 1000).toUTCString();
    document.cookie = `auth-token=${accessToken}; Path=/; Expires=${expires}; SameSite=Lax;`;
  },

  // Google OAuth login
  async loginWithGoogle(googleAccessToken: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/google/`, {
        access_token: googleAccessToken,
      });

      const { access, refresh } = this.extractTokens(response.data);
      const { user } = response.data;
      
      this.setTokens({ access, refresh });
      this.persistSession(access);
      
      return { user, created: response.data.created };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Google login failed');
    }
  },

  // Google OAuth login (redirect-based auth-code flow)
  async loginWithGoogleAuthCode(authCode: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/google/callback/`, {
        code: authCode,
      });
    
      const { access, refresh } = this.extractTokens(response.data);
      this.setTokens({ access, refresh });
      this.persistSession(access);
    
      return { user: response.data.user, created: response.data.created };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Google login failed');
    }
  },

  // Traditional email/password login
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        password,
      });

      const { access, refresh } = this.extractTokens(response.data);
      const { user } = response.data;
      
      this.setTokens({ access, refresh });
      this.persistSession(access);
      
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

      const { access, refresh } = this.extractTokens(response.data);
      const { user } = response.data;
      
      this.setTokens({ access, refresh });
      this.persistSession(access);
      
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
      document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;';
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
