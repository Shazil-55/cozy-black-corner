
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { useSocketProgress } from "./hooks/useSocketProgress";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ClassDetails from "./pages/ClassDetails";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Quiz from "./pages/Quiz";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize the socket progress hook at the app level
  useSocketProgress();
  
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/class/:moduleId/:classId" element={<ClassDetails />} />
          <Route path="/quiz/:classId" element={<Quiz />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            position="top-right"
            toastOptions={{
              duration: 4000,
              classNames: {
                toast: "dynamic-toast !rounded-lg !border !shadow-subtle",
                title: "text-foreground",
                description: "text-muted-foreground"
              }
            }}
          />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
