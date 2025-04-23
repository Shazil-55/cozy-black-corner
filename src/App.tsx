
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { RoleProvider } from "./context/RoleContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import UploadSyllabus from "./pages/UploadSyllabus";
import CourseDetails from "./pages/CourseDetails";
import ClassDetails from "./pages/ClassDetails";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Categories from "./pages/Categories";

// Onboarding steps
import Step1Goals from "./pages/onboarding/Step1Goals";
import Step2Users from "./pages/onboarding/Step2Users";
import Step3Industry from "./pages/onboarding/Step3Industry";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Auth protection wrapper
import { AuthLayout } from "./components/auth/AuthLayout";

// Create a custom hook for localStorage
const useLocalStorage = <T,>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] => {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T): void => {
    try {
      // Save state
      setStoredValue(value);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

import "./App.css";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Define AuthContextType to match what's expected
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (emailOrUsername: string, password: string, domain?: string) => Promise<boolean>;
  logout: () => void;
  register?: (name: string, email: string, password: string, username: string, domain: string, profileImage?: string) => Promise<boolean>;
  forgotPassword?: (email: string) => Promise<boolean>;
  resetPassword?: (token: string, newPassword: string) => Promise<boolean>;
  updateUserData?: (userData: any) => Promise<boolean>;
  refreshUserData?: () => Promise<boolean>;
  isLoading?: boolean;
}

function App() {
  // Mock authentication state (replace with actual auth logic)
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage(
    "isAuthenticated",
    false
  );

  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  const login = async (emailOrUsername: string, password: string, domain?: string): Promise<boolean> => {
    try {
      // Mock login for now - this would be replaced with an actual API call
      setUser({
        id: "user-123",
        name: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
        email: emailOrUsername,
        role: "admin"
      });
      setToken("mock-token-123");
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, username: string, domain: string, profileImage?: string): Promise<boolean> => {
    try {
      // Mock registration
      setUser({
        id: "user-123",
        name: name,
        email: email,
        username: username,
        role: "admin",
        profileImage: profileImage
      });
      setToken("mock-token-123");
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Mock implementation
    return true;
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // Mock implementation
    return true;
  };

  const updateUserData = async (userData: any): Promise<boolean> => {
    // Mock implementation
    setUser({...user, ...userData});
    return true;
  };

  const refreshUserData = async (): Promise<boolean> => {
    // Mock implementation
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Check if token exists on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  // Get user role from stored user data
  const role = user?.role || "visitor";

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateUserData,
    refreshUserData,
    isLoading: false
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthContext.Provider value={authContextValue}>
          <BrowserRouter>
            <RoleProvider initialRole={role}>
              <OnboardingProvider>
                <Routes>
                  {/* Public routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>

                  {/* Protected routes */}
                  <Route
                    element={
                      <AuthLayout>
                        <MainLayout />
                      </AuthLayout>
                    }
                  >
                    {/* Onboarding routes */}
                    <Route path="/onboarding">
                      <Route path="step1" element={<Step1Goals />} />
                      <Route path="step2" element={<Step2Users />} />
                      <Route path="step3" element={<Step3Industry />} />
                    </Route>

                    {/* Dashboard routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/instructor-dashboard"
                      element={<InstructorDashboard />}
                    />
                    <Route
                      path="/learner-dashboard"
                      element={<LearnerDashboard />}
                    />

                    {/* User profile */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Course management */}
                    <Route path="/upload-syllabus" element={<UploadSyllabus />} />
                    <Route path="/course/:courseId" element={<CourseDetail />} />
                    <Route path="/course/:courseId/edit" element={<UploadSyllabus />} />
                    <Route path="/course/:courseId/detail" element={<CourseDetails />} />
                    <Route path="/class/:classId" element={<ClassDetails />} />
                    <Route path="/quiz/:classId" element={<Quiz />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/categories" element={<Categories />} />

                    {/* User management */}
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserDetails />} />
                    
                  </Route>

                  {/* Fallback routes */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster position="top-right" />
              </OnboardingProvider>
            </RoleProvider>
          </BrowserRouter>
        </AuthContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
