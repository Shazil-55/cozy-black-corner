
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
        <div className="page-transition">
          <Outlet />
        </div>
      </div>
    );
  }
  
  if (isParentDashboard) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-all duration-500",
        "relative"
      )}>
        {/* Enhanced background overlay for parent dashboard */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-pink-50/80 dark:from-purple-950/80 dark:via-indigo-950/60 dark:to-pink-950/80 -z-10" />
        
        <Navbar hideDropdown={true} />
        <main className="flex-1 p-5 md:p-8 page-transition">
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
        "relative"
      )}>
        {/* Enhanced background overlay */}
        <div className={cn(
          "fixed inset-0 -z-10",
          isLearnerRoute 
            ? "bg-gradient-to-br from-blue-50/70 via-purple-50/50 to-indigo-50/70 dark:from-indigo-950/70 dark:via-purple-950/50 dark:to-blue-950/70" 
            : "bg-gradient-to-br from-slate-50/70 via-gray-50/50 to-blue-50/70 dark:from-gray-950/70 dark:via-slate-950/50 dark:to-gray-900/70"
        )} />
        
        <Navbar />
        <div className="flex flex-1">
          {isLearnerRoute ? <LearnerSidebar /> : <DashboardSidebar />}
          <main className={cn(
            "flex-1 overflow-auto",
            isLearnerRoute ? "p-5 md:p-8" : "p-4 md:p-6"
          )}>
            <div className="page-transition">
              <div className="fade-in-up">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
