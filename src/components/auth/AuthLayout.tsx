
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { backgroundClasses, interactionClasses } from '@/lib/animation';

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
  return (
    <div className={cn(
      "min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden",
      backgroundClasses.premium,
      backgroundClasses.floating,
      "bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-indigo-50/90",
      "dark:from-blue-950/90 dark:via-purple-950/90 dark:to-indigo-950/90",
      interactionClasses.pageEnter
    )}>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 animate-slide-in-down"></div>
        
        {/* Sidebar */}
        <div className="absolute top-16 left-0 bottom-0 w-16 bg-gradient-to-b from-blue-600/90 to-indigo-700/90 dark:from-blue-700/90 dark:to-indigo-800/90 border-r border-blue-500/30 dark:border-blue-600/30 animate-slide-in-left"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-r from-pink-400/20 to-indigo-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:50px_50px] opacity-50"></div>
        
        {/* Mock dashboard elements */}
        <div className="grid grid-cols-3 gap-6 absolute left-24 top-24 right-80 animate-fade-in-delay-500">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-32 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-glass border border-white/30 dark:border-gray-700/30",
                "animate-fade-in-delay-300"
              )}
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            ></div>
          ))}
        </div>
        
        {/* Mock table */}
        <div className="absolute bottom-24 left-24 right-24 h-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-glass border border-white/30 dark:border-gray-700/30 animate-fade-in-delay-700">
          <div className="h-12 border-b border-gray-200/50 dark:border-gray-700/50 rounded-t-xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-600/80"></div>
          <div className="grid grid-cols-6 gap-2 p-4">
            {[...Array(18)].map((_, i) => (
              <div 
                key={i} 
                className="h-6 bg-gray-100/80 dark:bg-gray-700/80 rounded animate-pulse"
                style={{ animationDelay: `${1 + i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in-delay-200">
        <ThemeToggle />
      </div>
      
      {/* Main authentication card with enhanced animations */}
      <div className="relative z-40 w-full max-w-md animate-scale-in">
        {/* Background cards with staggered animations */}
        <div className="absolute -left-6 -right-6 -top-6 -bottom-6 bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-indigo-600/90 rounded-3xl shadow-premium transform -rotate-2 z-10 animate-scale-in-delay-100"></div>
        
        <div className="absolute -left-3 -right-3 -top-3 -bottom-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-glass transform rotate-1 z-20 border border-blue-100/50 dark:border-blue-900/30 animate-scale-in-delay-200"></div>
        
        {/* Main content card */}
        <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-premium z-30 py-8 px-8 border border-gray-100/50 dark:border-gray-700/50 animate-fade-in-delay-300">
          {/* Logo section */}
          <div className="text-center mb-6 animate-fade-in-delay-500">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-glow">
                Ilmee
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in-delay-700">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm animate-fade-in-delay-700">
              {subtitle}
            </p>
          </div>
          
          {/* Content with staggered animation */}
          <div className="animate-fade-in-delay-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
