
import React from 'react';
import { ArrowLeft, Presentation, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SlideCard from '@/components/syllabus/SlideCard';
import { Slide } from '@/hooks/useSyllabusGenerator';

interface ClassDetailsPanelProps {
  title: string;
  corePoints: string[];
  slides: Slide[];
  onBack: () => void;
}

const ClassDetailsPanel: React.FC<ClassDetailsPanelProps> = ({
  title,
  corePoints,
  slides,
  onBack,
}) => {
  return (
    <div className="bg-gray-50 py-6 px-4 rounded-lg animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="inline-flex items-center text-talentlms-blue mb-4 hover:underline p-0 h-auto"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Syllabus
        </Button>
        
        <div className="bg-white rounded-lg p-6 shadow-subtle">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-talentlms-blue rounded-full flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-talentlms-darkBlue">
              {title}
            </h1>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Key Points:</h3>
            <ul className="list-disc list-inside space-y-1 pl-1 text-gray-700">
              {corePoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <BookText className="w-4 h-4 mr-1.5" />
            {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
          </div>
        </div>
      </div>
      
      {/* Slides */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-talentlms-darkBlue pl-2">Slides</h2>
        
        {slides.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            No slides available for this class.
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <SlideCard 
                key={index}
                slide={slide}
                slideNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailsPanel;
