
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../services/authService';
import { userService } from '../services/userService';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mainGoal?: string[];
  portalUsers?: string;
  industry?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  username?: string;
  domain?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string, domain?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, domain?: string, profileImage?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Export AuthContext so it can be imported in other files
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      
      // Refresh user data on initial load
      refreshUserData().catch(err => {
        console.error('Failed to refresh user data on init:', err);
      });
    }
    
    setIsLoading(false);
  }, []);

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUserData = async () => {
    try {
      console.log("Refreshing user data...");
      const response = await userService.getUser();
      
      if (response?.data) {
        const userData = response.data;
        console.log("Got user data from API:", userData);
        
        // Update the full user object with all the fields from the API
        const updatedUser = {
          ...(user || {}),
          ...userData,
          // Ensure these fields are properly set
          id: userData.id || user?.id || 'temp-id',
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          // Ensure mainGoal is always an array
          mainGoal: Array.isArray(userData.mainGoal) ? userData.mainGoal : (userData.mainGoal ? [userData.mainGoal] : []),
          portalUsers: userData.portalUsers || user?.portalUsers || '',
          industry: userData.industry || user?.industry || '',
          role: userData.role || user?.role || '',
          username: userData.username || user?.username || '',
          domain: userData.domain || user?.domain || '',
          profileImage: userData.profileImage || user?.profileImage || user?.avatar || '',
          bio: userData.bio || user?.bio || '',
          createdAt: userData.createdAt || user?.createdAt || '',
          updatedAt: userData.updatedAt || user?.updatedAt || '',
        };
        
        console.log("Updated user data:", updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const login = async (emailOrUsername: string, password: string, domain?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = { emailOrUsername, password, domain };
      const response = await authService.login(loginData);
      
      const accessToken = response?.data?.data?.token?.accessToken;
      const refreshToken = response?.data?.data?.token?.refreshToken;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        const basicUser = {
          id: 'temp-id',
          name: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@${domain || 'ilmee.com'}`,
          avatar: localStorage.getItem('userAvatar') || undefined
        };
        localStorage.setItem('user', JSON.stringify(basicUser));
        
        setUser(basicUser);
        setIsAuthenticated(true);
        toast.success('Successfully logged in!');

        // Immediately try to get the full user profile
        try {
          await refreshUserData();
        } catch (err) {
          console.log('Could not fetch complete user data, using basic data');
        }
        
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

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    username: string, 
    domain?: string, 
    profileImage?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registerData: RegisterRequest = { 
        name, 
        email, 
        password, 
        username, 
        domain
      };
      
      if (profileImage) {
        registerData.profileImage = profileImage;
      }
      
      const response = await authService.register(registerData);
      
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
          email: email,
          avatar: profileImage
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

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await authService.forgotPassword({ email });
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to request password reset');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await authService.resetPassword({ token, password });
      toast.success('Password has been reset successfully');
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
    
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      forgotPassword,
      resetPassword,
      logout,
      updateUserData,
      refreshUserData,
      isAuthenticated, 
      isLoading 
    }}>
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
