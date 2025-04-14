
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  number?: number;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  isSelected,
  onClick,
  number
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "border rounded-lg p-5 cursor-pointer transition-colors relative overflow-hidden",
        isSelected 
          ? "border-[#1B68B3] bg-blue-50 dark:bg-blue-900/20" 
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        
        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-[#1B68B3] flex items-center justify-center">
            {number ? (
              <span className="text-white text-xs font-semibold">{number}</span>
            ) : (
              <Check className="h-4 w-4 text-white" />
            )}
          </div>
        )}
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-tl-xl bg-[#1B68B3]"
        />
      )}
    </motion.div>
  );
};
