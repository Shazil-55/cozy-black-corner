
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAnimationClasses } from '@/lib/animation';

interface ClassSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
}

export const ClassSelector = ({
  value,
  onChange,
  min = 1,
  max = 50,
  className,
  label = "How many classes should this syllabus cover?"
}: ClassSelectorProps) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("w-full", className, getAnimationClasses("slide"))}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-xs">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            className={cn(
              "w-full py-2.5 px-4 rounded-md border border-gray-200 focus-ring",
              "text-center text-lg font-medium appearance-none transition-all",
            )}
          />
          
          <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
            <button
              type="button"
              onClick={increment}
              disabled={value >= max}
              className="flex-1 px-2 hover:bg-gray-50 transition-colors rounded-tr-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp size={16} />
            </button>
            <div className="w-full h-px bg-gray-200" />
            <button
              type="button"
              onClick={decrement}
              disabled={value <= min}
              className="flex-1 px-2 hover:bg-gray-50 transition-colors rounded-br-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        <span className="text-sm text-muted-foreground">
          {value === 1 ? 'class' : 'classes'}
        </span>
      </div>
      
      <div className="mt-3 flex justify-between px-2">
        <span className="text-xs text-gray-500">Min: {min}</span>
        <span className="text-xs text-gray-500">Max: {max}</span>
      </div>
    </div>
  );
};
