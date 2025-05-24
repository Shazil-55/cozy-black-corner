
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white/90 dark:bg-violet-900/70 border border-violet-200 dark:border-violet-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-violet-800 dark:text-violet-300 transition-transform duration-500 rotate-0 hover:rotate-12" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-transform duration-500 rotate-0 hover:rotate-12" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}</p>
      </TooltipContent>
    </Tooltip>
  );
};
