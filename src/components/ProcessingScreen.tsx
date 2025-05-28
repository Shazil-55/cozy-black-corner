
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ProgressStatus } from '@/hooks/useSocketProgress';

interface ProcessingScreenProps {
  progress: number;
  message: string;
  classInfo?: string;
}

export const ProcessingScreen = ({ progress, message, classInfo }: ProcessingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="relative w-36 h-36 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#3b82f6"
            strokeLinecap="round"
            strokeWidth="4"
            strokeDasharray={`${Math.PI * 96}`}
            strokeDashoffset={`${Math.PI * 96 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 text-talentlms-blue animate-spin mx-auto mb-1" />
            <span className="text-xl font-medium text-talentlms-blue">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
        {message}
      </h2>
      
      {classInfo && (
        <p className="text-gray-600 mb-6 text-center">
          {classInfo}
        </p>
      )}

      <div className="w-full max-w-md mt-4">
        <Progress 
          value={progress} 
          className="h-2.5 bg-gray-100"
        />
      </div>
      
      <p className="text-sm text-gray-500 mt-8 text-center max-w-md">
        Please wait while we process your document. You can navigate to other pages and come back - your progress will be saved.
      </p>
    </div>
  );
};
