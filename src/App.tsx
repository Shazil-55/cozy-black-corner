
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { RoleProvider } from "./context/RoleContext";
import { LoadingState } from "./components/LoadingState";
import { useSocketProgress } from "./hooks/useSocketProgress";
import { useEffect } from "react";
import { authService } from "./services/authService";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import UploadSyllabus from "./pages/UploadSyllabus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ClassDetails from "./pages/ClassDetails";
import Courses from "./pages/Courses";
import CourseEditor from "./pages/CourseEditor";
import CourseDetail from "./pages/CourseDetail";
import CoursePreview from "./pages/CoursePreview"; // Add the import for CoursePreview
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
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import CourseStore from "./pages/CourseStore";
import CourseStoreDetails from "./pages/CourseStoreDetails";
import Subscription from "./pages/Subscription";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  // Check for subdomain on initial app load
  useEffect(() => {
    // Only check on production domains, not localhost
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Check if there's a domain in localStorage and we're not on the correct subdomain
      const storedDomain = localStorage.getItem('userDomain');
      if (storedDomain && !window.location.hostname.startsWith(`${storedDomain}.`)) {
        const currentPath = window.location.pathname;
        // If we're not on the login or register pages, redirect to the subdomain
        if (currentPath !== '/login' && currentPath !== '/register') {
          authService.redirectToSubdomain();
        }
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RoleProvider>
            <AuthProvider>
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
                  <SubdomainHandler>
                    <AppRoutes />
                  </SubdomainHandler>
                </TooltipProvider>
              </OnboardingProvider>
            </AuthProvider>
          </RoleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const SubdomainHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Only check for subdomain redirects if the user is authenticated
    if (isAuthenticated) {
      // Don't redirect on login/register pages
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        authService.redirectToSubdomain();
      }
    }
    
    // Add subdomain info to document title
    const domain = authService.getUserDomain();
    if (domain && domain !== 'ilmee') {
      document.title = `${domain} | Ilmee`;
    }
  }, [isAuthenticated, location.pathname]);
  
  return <>{children}</>;
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
          <Route path="/course/:courseId/preview" element={<CoursePreview />} /> {/* Add the new route */}
          <Route path="/class/:moduleId/:classId" element={<ClassDetails />} />
          <Route path="/quiz/:classId" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserDetails />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/course-store" element={<CourseStore />} />
          <Route path="/course-store/course/:courseId" element={<CourseStoreDetails />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Route for course editor - outside MainLayout because we want a custom sidebar */}
        <Route path="/course/:courseId/edit" element={<PrivateRoute><CourseEditor /></PrivateRoute>} />
        
        {/* Routes outside MainLayout for sidebar-less parent pages */}
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
