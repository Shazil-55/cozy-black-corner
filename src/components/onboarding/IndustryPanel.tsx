
import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { IndustrySelector } from './IndustrySelector';

interface IndustryPanelProps {
  industry: string;
  onSelectIndustry: (value: string) => void;
  industries: string[];
  children: React.ReactNode;
}

export const IndustryPanel: React.FC<IndustryPanelProps> = ({
  industry,
  onSelectIndustry,
  industries,
  children
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <motion.h2 
          variants={itemVariants} 
          className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2"
        >
          <Building2 className="h-6 w-6 text-blue-600" />
          Tell us about your organization
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          This information helps us personalize your learning experience and content recommendations.
        </motion.p>
        
        <motion.div variants={containerVariants} className="space-y-6">
          <IndustrySelector 
            industry={industry} 
            onSelectIndustry={onSelectIndustry} 
            industries={industries} 
          />
        </motion.div>
        
        {children}
      </motion.div>
    </motion.div>
  );
};
