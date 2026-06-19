import { apiRequest, setToken, clearToken } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  register: (email: string, password: string) =>
    apiRequest<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: async (email: string, password: string) => {
    const result = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(result.token);
    return result;
  },

  logout: async () => {
    try {
      await apiRequest<null>('/auth/logout', { method: 'POST' });
    } finally {
      clearToken();
    }
  },

  me: () => apiRequest<AuthUser>('/auth/me'),

  forgotPassword: (email: string) =>
    apiRequest<{ message: string; devResetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiRequest<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};
