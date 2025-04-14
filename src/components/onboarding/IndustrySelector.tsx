
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IndustrySelectorProps {
  industry: string;
  onSelectIndustry: (value: string) => void;
  industries: string[];
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industry,
  onSelectIndustry,
  industries
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        What's your industry?
      </label>
      <Select onValueChange={onSelectIndustry} value={industry}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-600 focus:border-blue-500">
          <SelectValue placeholder="Select your industry..." />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {industries.map((ind) => (
            <SelectItem key={ind} value={ind} className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
              {ind}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {industry && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start gap-3"
        >
          <div className="mt-0.5">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1">
              <Check className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 dark:text-blue-300">
              {industry} Industry Selected
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              We'll customize your experience based on common needs in this sector.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
