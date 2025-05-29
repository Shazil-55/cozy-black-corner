
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
export const AuthLayout = ({
  children,
  title,
  subtitle
}: AuthLayoutProps) => {
  return <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background dashboard mockup */}
      <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10">
        <div className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"></div>
        <div className="absolute top-16 left-0 bottom-0 w-16 bg-[#1B68B3] dark:bg-[#1a5da0] border-r border-[#1a5da0] dark:border-[#164e89]"></div>
        
        {/* Mock data visualization */}
        <div className="absolute top-28 right-8 w-56 h-56 rounded-full border-4 border-[#1B68B3]/20 dark:border-[#1B68B3]/40"></div>
        <div className="absolute top-28 right-8 w-56 h-56 rounded-full overflow-hidden">
          <div className="absolute inset-0 border-4 border-[#1B68B3]/20 dark:border-[#1B68B3]/40 bg-blue-500"></div>
          <div className="absolute inset-0 border-t-4 border-r-4 border-[#1B68B3] dark:border-[#1B68B3]" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)'
        }}></div>
          <div className="absolute inset-0 border-b-4 border-l-4 border-[#FF7043] dark:border-[#FF7043]" style={{
          clipPath: 'polygon(0 100%, 100% 100%, 0 100%, 0 0)'
        }}></div>
        </div>
        
        {/* Mock cards grid */}
        <div className="grid grid-cols-3 gap-6 absolute left-24 top-24 right-80">
          <div className="h-32 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
          <div className="h-32 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
          <div className="h-32 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
          <div className="h-40 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
          <div className="h-40 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
          <div className="h-40 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"></div>
        </div>
        
        {/* Mock table */}
        <div className="absolute bottom-24 left-24 right-24 h-48 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="h-10 border-b border-gray-200 dark:border-gray-700"></div>
          <div className="grid grid-cols-6 gap-2 p-2">
            {[...Array(18)].map((_, i) => <div key={i} className="h-6 bg-gray-100 dark:bg-gray-700 rounded"></div>)}
          </div>
        </div>
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Main card with overlapping effect - UPDATED FOR SHORTER HEIGHT */}
      <div className="relative z-40 w-full max-w-md">
        {/* Brand card - back */}
        <div className="absolute -left-6 -right-6 -top-6 -bottom-6 bg-gradient-to-br from-[#1B68B3] to-blue-400 rounded-2xl shadow-xl transform -rotate-2 z-10"></div>
        
        {/* Secondary card - middle */}
        <div className="absolute -left-3 -right-3 -top-3 -bottom-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg transform rotate-1 z-20 border border-blue-100 dark:border-blue-900/20"></div>
        
        {/* Main content card - front - UPDATED HEIGHT */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md z-30 py-7 px-8 border border-gray-100 dark:border-gray-700">
          {/* Logo */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="text-[#1B68B3] text-3xl font-bold">Ilmee</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>;
};
