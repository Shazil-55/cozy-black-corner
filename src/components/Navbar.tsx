
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookText, LogIn, UserPlus, LogOut, User, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-talentlms-darkBlue dark:text-white hover:text-talentlms-blue dark:hover:text-talentlms-lightBlue transition-colors">
              <BookText className="h-6 w-6" />
              <span className="text-lg font-medium tracking-tight">AI Syllabus Generator</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "text-talentlms-blue dark:text-talentlms-lightBlue" 
                  : "text-gray-600 dark:text-gray-300 hover:text-talentlms-blue dark:hover:text-talentlms-lightBlue hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/courses"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === "/courses" 
                    ? "text-talentlms-blue dark:text-talentlms-lightBlue" 
                    : "text-gray-600 dark:text-gray-300 hover:text-talentlms-blue dark:hover:text-talentlms-lightBlue hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <span className="flex items-center">
                  <LayoutGrid className="h-4 w-4 mr-1.5" />
                  My Courses
                </span>
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center mr-2 text-sm text-muted-foreground dark:text-gray-300">
                  <User className="mr-1 h-4 w-4 text-talentlms-blue dark:text-talentlms-lightBlue" />
                  <span>{user?.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white hover:text-talentlms-blue"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white hover:text-talentlms-blue"
                  >
                    <LogIn className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-talentlms-blue hover:bg-talentlms-darkBlue dark:bg-talentlms-blue/80 dark:hover:bg-talentlms-blue"
                  >
                    <UserPlus className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
