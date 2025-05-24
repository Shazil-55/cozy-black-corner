import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  register: (name: string, email: string, password: string, username: string, domain?: string, profileImage?: string) => Promise<{success: boolean, domain?: string}>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSubdomain: () => void;
}

// Export AuthContext so it can be imported in other files
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Function to check if we need to redirect to the correct subdomain
  const checkSubdomain = useCallback(() => {
    authService.redirectToSubdomain();
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      
      // Check if we need to redirect to a subdomain
      checkSubdomain();
      
      // Refresh user data on initial load
      refreshUserData().catch(err => {
        console.error('Failed to refresh user data on init:', err);
      });
    }
    
    setIsLoading(false);
  }, [checkSubdomain]);

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // If domain was updated, update in localStorage
      if (userData.domain) {
        localStorage.setItem('userDomain', userData.domain);
        // Check if we need to redirect to a different subdomain
        checkSubdomain();
      }
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
        
        // Update domain in localStorage if it exists
        if (updatedUser.domain) {
          localStorage.setItem('userDomain', updatedUser.domain);
          
          // Update document title with domain
          if (updatedUser.domain !== 'ilmee') {
            document.title = `${updatedUser.domain} | Ilmee`;
          }
        }
        
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
        
        const userDomain = response?.data?.data?.user?.domain || domain || 'ilmee';
        
        const basicUser = {
          id: 'temp-id',
          name: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
          email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@${userDomain}.ilmee.ai`,
          avatar: localStorage.getItem('userAvatar') || undefined,
          domain: userDomain
        };
        localStorage.setItem('user', JSON.stringify(basicUser));
        localStorage.setItem('userDomain', userDomain);
        
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
  ): Promise<{success: boolean, domain?: string}> => {
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
      
      // Modified to not automatically log the user in
      const response = await authService.register(registerData);
      
      // Get the domain from the response or use the provided domain
      const userDomain = response?.data?.data?.user?.domain || domain || 'ilmee';
      
      // Store just the domain for redirecting to login page
      localStorage.setItem('userDomain', userDomain);
      
      // Don't set isAuthenticated or user data
      toast.success('Successfully registered! Please log in to continue.');
      
      return {
        success: true,
        domain: userDomain
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false };
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
    // Get domain before logout for redirection
    const domain = localStorage.getItem('userDomain');
    
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
    
    // Redirect to login page on the correct subdomain if needed
    if (domain && domain !== 'ilmee' && 
        !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      window.location.href = `https://${domain}.ilmee.ai/login`;
    } else {
      window.location.href = '/login';
    }
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
      isLoading,
      checkSubdomain
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
