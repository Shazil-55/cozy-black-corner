
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
  
  // Check if this is a learner route
  const isLearnerRoute = role === 'learner' || location.pathname.includes('learner-dashboard');
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-colors duration-200",
        isLearnerRoute 
          ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950" 
          : "bg-gradient-to-br from-background to-muted/50 dark:from-gray-900 dark:to-gray-950"
      )}>
        <Navbar />
        <div className="flex flex-1">
          {isLearnerRoute ? <LearnerSidebar /> : <DashboardSidebar />}
          <main className={cn(
            "flex-1 overflow-auto",
            isLearnerRoute ? "p-5 md:p-8" : "p-4 md:p-6"
          )}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
