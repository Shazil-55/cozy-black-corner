
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LearnerSidebar } from "@/components/dashboard/LearnerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { backgroundClasses, interactionClasses } from "@/lib/animation";

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
        "min-h-screen flex flex-col w-full transition-all duration-700 ease-smooth",
        backgroundClasses.premium,
        "bg-gradient-to-br from-purple-50/80 via-indigo-50/80 to-pink-50/80",
        "dark:from-purple-950/80 dark:via-indigo-950/80 dark:to-pink-950/80",
        interactionClasses.pageEnter
      )}>
        <Navbar hideDropdown={true} />
        <main className="flex-1 p-5 md:p-8 animate-fade-in-delay-200">
          <div className="animate-fade-in-delay-300">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-all duration-700 ease-smooth",
        backgroundClasses.premium,
        backgroundClasses.floating,
        isLearnerRoute 
          ? "bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80 dark:from-indigo-950/80 dark:via-purple-950/80 dark:to-blue-950/80" 
          : "bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 dark:from-slate-950/80 dark:via-blue-950/80 dark:to-indigo-950/80",
        interactionClasses.pageEnter
      )}>
        <div className="animate-slide-in-down">
          <Navbar />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="animate-slide-in-left">
            {isLearnerRoute ? <LearnerSidebar /> : <DashboardSidebar />}
          </div>
          <main className={cn(
            "flex-1 overflow-auto animate-fade-in-delay-300",
            isLearnerRoute ? "p-5 md:p-8" : "p-4 md:p-6"
          )}>
            <div className="animate-scale-in-delay-200">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
