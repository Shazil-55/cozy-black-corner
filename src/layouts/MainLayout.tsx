
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LearnerSidebar } from "@/components/dashboard/LearnerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const { role } = useRole();
  const location = useLocation();
  
  // Check if this is a learner route or parent dashboard
  const isLearnerRoute = role === 'learner' || location.pathname.includes('learner-dashboard');
  const isParentDashboard = location.pathname.includes('parent-dashboard');
  // Check if this is a course preview page
  const isCoursePreview = location.pathname.includes('/preview');
  
  // For course preview, return just the outlet without any navigation
  if (isCoursePreview) {
    return (
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
    );
  }
  
  if (isParentDashboard) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-all duration-500",
        "bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-indigo-950/50"
      )}>
        <div className="fixed inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent dark:from-transparent dark:via-purple-900/10 dark:to-transparent pointer-events-none" />
        <Navbar hideDropdown={true} />
        <main className="flex-1 p-5 md:p-8 relative z-10">
          <div className="fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-all duration-500",
        isLearnerRoute 
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/50" 
          : "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-gray-950/50 dark:via-slate-950/30 dark:to-zinc-950/50"
      )}>
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl floating-animation" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-300/15 dark:bg-indigo-600/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }} />
        </div>
        
        <Navbar />
        <div className="flex flex-1 relative z-10">
          {isLearnerRoute ? <LearnerSidebar /> : <DashboardSidebar />}
          <main className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            isLearnerRoute ? "p-5 md:p-8" : "p-4 md:p-6"
          )}>
            <div className="fade-in-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
