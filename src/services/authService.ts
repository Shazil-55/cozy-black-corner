
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
      domain?: string;
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
      
      // Store the domain in localStorage for subdomain routing
      localStorage.setItem('userDomain', credentials.domain);
    }
    
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      
      // If the response includes a domain, store it
      if (response?.data?.data?.user?.domain) {
        localStorage.setItem('userDomain', response.data.data.user.domain);
      }
      
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Make sure domain is properly formatted if provided
    if (userData.domain) {
      userData.domain = userData.domain.trim().toLowerCase();
      
      // Store the domain in localStorage for subdomain routing
      localStorage.setItem('userDomain', userData.domain);
    }
    
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      
      // If the response includes a domain, store it
      if (response?.data?.data?.user?.domain) {
        localStorage.setItem('userDomain', response.data.data.user.domain);
      }
      
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
    
    // Keep the domain for redirecting to the proper subdomain
    const domain = localStorage.getItem('userDomain');
    
    // Clear all localStorage except domain
    localStorage.clear();
    
    // Restore domain for redirect purposes
    if (domain) {
      localStorage.setItem('userDomain', domain);
    }
  },
  
  // Helper method to get the current user's domain
  getUserDomain(): string {
    return localStorage.getItem('userDomain') || 'ilmee';
  },
  
  // Check if we need to redirect to a subdomain
  checkSubdomainRedirect(): boolean {
    const domain = this.getUserDomain();
    const hostname = window.location.hostname;
    
    // Skip for localhost/development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return false;
    }
    
    // If we're not on the correct subdomain, we should redirect
    const isCorrectSubdomain = hostname.startsWith(`${domain}.`);
    return !isCorrectSubdomain;
  },
  
  // Get the proper URL with the subdomain
  getSubdomainUrl(path: string = ''): string {
    const domain = this.getUserDomain();
    
    // For development environments
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${window.location.protocol}//${window.location.host}${path}?domain=${domain}`;
    }
    
    // Extract the base domain (like example.com) from the current hostname
    const parts = window.location.hostname.split('.');
    const baseDomain = parts.length > 1 ? parts.slice(-2).join('.') : window.location.hostname;
    
    return `${window.location.protocol}//${domain}.${baseDomain}${path}`;
  },
  
  // Force redirect to the correct subdomain
  redirectToSubdomain(): void {
    if (this.checkSubdomainRedirect()) {
      const subdomain = this.getUserDomain();
      const redirectUrl = this.getSubdomainUrl(window.location.pathname);
      console.log(`Redirecting to subdomain: ${subdomain} (${redirectUrl})`);
      window.location.href = redirectUrl;
    }
  }
};
