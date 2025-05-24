
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookText, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from "@/components/user/UserNav";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

interface NavbarProps {
  hideDropdown?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hideDropdown = false }) => {
  // Wrap the useSidebar hook in a try/catch to handle cases where it's used outside a provider
  const sidebarContext = { state: "expanded", toggleSidebar: () => {} };
  try {
    Object.assign(sidebarContext, useSidebar());
  } catch (error) {
    // If there's an error, we'll use the default values defined above
    console.log("Sidebar context not available, using default values");
  }

  const { toggleSidebar, state } = sidebarContext;
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { role } = useRole();
  const location = useLocation();
  
  // Check if this is a learner route
  const isLearnerRoute = role === 'learner' || location.pathname.includes('learner-dashboard');

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-colors duration-200",
      isLearnerRoute 
        ? "border-indigo-100 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-indigo-900/30" 
        : "border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm"
    )}>
      <div className="mx-auto px-3 sm:px-4 lg:px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {!isMobile && !isLearnerRoute && !hideDropdown && (
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-primary/20 text-primary"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLearnerRoute
                  ? "text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                  : "text-talentlms-darkBlue dark:text-white hover:text-talentlms-blue dark:hover:text-talentlms-lightBlue"
              )}
            >
              <BookText className="h-6 w-6" />
              <span className={cn(
                "text-lg font-medium tracking-tight",
                isLearnerRoute && "font-bold"
              )}>
                {isLearnerRoute ? "Learning Portal" : "Ilmee"}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isLearnerRoute && <ThemeToggle />}
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
};
