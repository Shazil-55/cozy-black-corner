
import React, { useState } from 'react';
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
  // Internal state to manage input value while typing
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Ensure value is within bounds when min/max change
  React.useEffect(() => {
    if (value < min) {
      onChange(min);
      setInputValue(min.toString());
    } else if (value > max) {
      onChange(max);
      setInputValue(max.toString());
    } else {
      setInputValue(value.toString());
    }
  }, [min, max, value, onChange]);

  const increment = () => {
    if (value < max) {
      const newValue = value + 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const decrement = () => {
    if (value > min) {
      const newValue = value - 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  // Handle input blur to validate the entered value
  const handleBlur = () => {
    const newValue = parseInt(inputValue, 10);
    
    if (isNaN(newValue)) {
      // If the input is not a valid number, revert to the previous value
      setInputValue(value.toString());
      return;
    }
    
    // Apply min/max constraints
    if (newValue < min) {
      onChange(min);
      setInputValue(min.toString());
    } else if (newValue > max) {
      onChange(max);
      setInputValue(max.toString());
    } else {
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  // Handle key press to update on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
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
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
