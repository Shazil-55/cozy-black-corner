
import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    data: any;
    token: {
      accessToken: string;
      refreshToken: string;
    };
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
