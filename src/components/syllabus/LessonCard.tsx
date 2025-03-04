
import React from 'react';
import { Edit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Lesson {
  id: string;
  title: string;
  description: string;
}

interface LessonCardProps {
  lesson: Lesson;
  onEdit: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onEdit }) => {
  return (
    <div 
      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-grow">
          <Info className="w-4 h-4 text-talentlms-blue mt-1 flex-shrink-0" />
          <div className="space-y-1 min-w-0">
            <h4 className="font-medium text-gray-900 line-clamp-2">
              {lesson.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3">
              {lesson.description}
            </p>
          </div>
        </div>
        <Button
          onClick={onEdit}
          size="sm"
          variant="ghost"
          className="ml-4 text-talentlms-blue hover:bg-talentlms-lightBlue flex-shrink-0"
        >
          <Edit className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default LessonCard;
