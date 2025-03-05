
import React from 'react';
import { Book, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Class {
  id: string;
  title: string;
  corePoints: string[];
  slideCount: number;
}

interface ClassCardProps {
  classItem: Class;
  moduleId: string;
  onSelect: (moduleId: string, classId: string) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, moduleId, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-subtle hover:shadow-md transition-all duration-200 p-5 h-full flex flex-col">
      <div className="flex items-start space-x-3 mb-3">
        <Book className="w-5 h-5 text-talentlms-blue mt-0.5 flex-shrink-0" />
        <h4 className="font-medium text-lg text-talentlms-darkBlue line-clamp-2">
          {classItem.title}
        </h4>
      </div>
      
      <div className="mb-4 flex-grow">
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
          {classItem.corePoints.slice(0, 3).map((point, index) => (
            <li key={index} className="line-clamp-1">{point}</li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {classItem.slideCount} {classItem.slideCount === 1 ? 'slide' : 'slides'}
        </div>
        <Link to={`/class/${moduleId}/${classItem.id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="text-talentlms-blue hover:bg-talentlms-lightBlue"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation if you're handling it differently
              onSelect(moduleId, classItem.id);
            }}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            View
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
