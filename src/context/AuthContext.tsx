import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, LoginRequest, RegisterRequest } from '../services/authService';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = { email, password };
      const response = await authService.login(loginData);
      
      // Extract tokens from the response - note the corrected structure
      const accessToken = response?.data?.data?.token?.accessToken;
      const refreshToken = response?.data?.data?.token?.refreshToken;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        const basicUser = {
          id: 'temp-id', // You might want to extract this from the JWT or get it from a user endpoint
          name: email.split('@')[0],
          email: email
        };
        localStorage.setItem('user', JSON.stringify(basicUser));
        
        setUser(basicUser);
        setIsAuthenticated(true);
        toast.success('Successfully logged in!');
        return true;
      } else {
        console.error('Login response missing token:', response);
        toast.error('Login failed: Invalid response from server');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registerData: RegisterRequest = { name, email, password };
      const response = await authService.register(registerData);
      
      // Extract tokens from the response - note the corrected structure
      const accessToken = response?.data?.data?.token?.accessToken;
      const refreshToken = response?.data?.data?.token?.refreshToken;
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        const basicUser = {
          id: 'temp-id',
          name: name,
          email: email
        };
        localStorage.setItem('user', JSON.stringify(basicUser));
        
        setUser(basicUser);
        setIsAuthenticated(true);
        toast.success('Successfully registered!');
        return true;
      } else {
        console.error('Registration response missing token:', response);
        toast.error('Registration failed: Invalid response from server');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};