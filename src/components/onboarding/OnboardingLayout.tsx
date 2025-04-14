
import React from 'react';
import { BookText } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type OnboardingLayoutProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-talentlms-darkBlue dark:text-white">
                <BookText className="h-6 w-6" />
                <span className="text-lg font-medium tracking-tight">Ilmee</span>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                index < currentStep 
                  ? 'bg-[#1B68B3]' 
                  : index === currentStep 
                    ? 'bg-blue-400' 
                    : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};
