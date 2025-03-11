
import React from 'react';
import { ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassCard from './ClassCard';

export interface Class {
  id: string;
  title: string;
  corePoints: string[];
  slideCount: number;
}

export interface Module {
  id: string;
  title: string;
  classes: Class[];
}

interface ModuleCardProps {
  module: Module;
  expanded: boolean;
  onToggle: () => void;
  onEdit: (moduleId: string, title: string) => void;
  onClassSelect: (moduleId: string, classId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  expanded,
  onToggle,
  onEdit,
  onClassSelect,
}) => {
  return (
    <div className="mb-4 border-b border-gray-100 pb-4">
      <div 
        className="flex items-center justify-between py-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/10 rounded-md px-2"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          {expanded ? 
            <ChevronDown className="w-5 h-5 text-talentlms-blue flex-shrink-0" /> : 
            <ChevronRight className="w-5 h-5 text-talentlms-blue flex-shrink-0" />
          }
          <h3 className="font-medium text-lg text-talentlms-darkBlue dark:text-white">{module.title}</h3>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent's onClick
            onEdit(module.id, module.title);
          }}
          size="sm"
          variant="ghost"
          className="flex items-center text-talentlms-blue hover:bg-talentlms-lightBlue"
        >
          <Edit className="w-4 h-4 mr-1.5" />
          Edit
        </Button>
      </div>
      
      {expanded && (
        <div className="pl-8 mt-2 space-y-3 animate-fade-in">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {module.classes.map((classItem) => (
              <ClassCard 
                key={classItem.id}
                classItem={classItem}
                moduleId={module.id}
                onSelect={onClassSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
