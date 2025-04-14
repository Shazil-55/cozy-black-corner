
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface OnboardingNavigationProps {
  onBack: () => void;
  onNext: () => void;
  nextButtonText: string;
  isSubmitting: boolean;
  isNextDisabled?: boolean;
  nextButtonIcon?: React.ReactNode;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  onBack,
  onNext,
  nextButtonText,
  isSubmitting,
  isNextDisabled = false,
  nextButtonIcon = <Check className="h-4 w-4" />
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 flex justify-between"
    >
      <Button 
        variant="outline" 
        onClick={onBack}
        disabled={isSubmitting}
        className="px-6 gap-2 border-gray-300 dark:border-gray-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button 
        onClick={onNext} 
        disabled={isSubmitting || isNextDisabled}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            {nextButtonText}
            {nextButtonIcon}
          </>
        )}
      </Button>
    </motion.div>
  );
};
