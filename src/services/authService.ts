
import api from './api';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  domain?: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  domain?: string;
  profileImage?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
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
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Make sure domain is properly formatted if provided
    if (credentials.domain) {
      credentials.domain = credentials.domain.trim().toLowerCase();
    }
    
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Make sure domain is properly formatted if provided
    if (userData.domain) {
      userData.domain = userData.domain.trim().toLowerCase();
    }
    
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<any> {
    try {
      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
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
