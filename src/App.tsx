
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { RoleProvider } from "./context/RoleContext";
import { LoadingState } from "./components/LoadingState";
import { useSocketProgress } from "./hooks/useSocketProgress";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import UploadSyllabus from "./pages/UploadSyllabus";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ClassDetails from "./pages/ClassDetails";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseDetail from "./pages/CourseDetail";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Step1Goals from "./pages/onboarding/Step1Goals";
import Step2Users from "./pages/onboarding/Step2Users";
import Step3Industry from "./pages/onboarding/Step3Industry";
import Categories from "./pages/Categories";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDetails from "./pages/ChildDetails";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RoleProvider>
              <OnboardingProvider>
                <TooltipProvider>
                  <Sonner 
                    position="top-right"
                    expand={true}
                    closeButton={true}
                    richColors={true}
                    toastOptions={{
                      duration: 5000,
                      classNames: {
                        toast: "group border-b border-border shadow-lg rounded-lg overflow-hidden",
                        title: "font-medium text-foreground",
                        description: "text-muted-foreground text-sm", 
                        actionButton: "bg-primary text-primary-foreground",
                        cancelButton: "bg-muted text-muted-foreground",
                        success: "!bg-green-50 !text-green-600 dark:!bg-green-900/30 dark:!text-green-400 border-l-4 border-green-500",
                        error: "!bg-red-50 !text-red-600 dark:!bg-red-900/30 dark:!text-red-400 border-l-4 border-red-500",
                        warning: "!bg-amber-50 !text-amber-600 dark:!bg-amber-900/30 dark:!text-amber-400 border-l-4 border-amber-500",
                        info: "!bg-blue-50 !text-blue-600 dark:!bg-blue-900/30 dark:!text-blue-400 border-l-4 border-blue-500",
                      }
                    }}
                  />
                  <AppRoutes />
                </TooltipProvider>
              </OnboardingProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  useSocketProgress();
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/upload-syllabus" element={<UploadSyllabus />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/edit" element={<CourseDetails />} />
          <Route path="/class/:moduleId/:classId" element={<ClassDetails />} />
          <Route path="/quiz/:classId" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserDetails />} />
        </Route>
        
        {/* New routes outside MainLayout for sidebar-less parent pages */}
        <Route path="/parent/child/:childId" element={<PrivateRoute><ChildDetails /></PrivateRoute>} />
        
        <Route path="/onboarding/step1" element={<PrivateRoute><Step1Goals /></PrivateRoute>} />
        <Route path="/onboarding/step2" element={<PrivateRoute><Step2Users /></PrivateRoute>} />
        <Route path="/onboarding/step3" element={<PrivateRoute><Step3Industry /></PrivateRoute>} />
        
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState 
          message="Loading your dashboard" 
          progress={75} 
          variant="spinner" 
          className="py-8 max-w-md"
        />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState 
          message="Checking authentication" 
          progress={60} 
          variant="spinner" 
          className="py-8 max-w-md"
        />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default App;
