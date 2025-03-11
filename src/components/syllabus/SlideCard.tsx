
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Presentation, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SlideData } from '@/services/courseService';

interface SlideCardProps {
  slide: SlideData;
  slideNumber: number;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, slideNumber }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-subtle hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-talentlms-lightBlue rounded-full flex items-center justify-center text-talentlms-blue font-medium text-sm">
              {slideNumber}
            </div>
            <h3 className="font-medium text-xl text-talentlms-darkBlue">{slide.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-talentlms-blue"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        <div className="mt-4 pl-11">
          <p className="text-gray-600 text-base">{slide.content}</p>
        </div>
        
        {expanded && (
          <div className={cn("mt-5 pt-5 border-t border-gray-100 space-y-5 animate-fade-in pl-11")}>
            {/* Display image if available */}
            {slide.imageUrl && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Image className="w-4 h-4 text-talentlms-blue" />
                  <h4 className="text-base font-medium text-gray-700">Slide Image</h4>
                </div>
                <div className="mt-2 pl-6">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="rounded-md max-h-48 object-contain border border-gray-200" 
                  />
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Image className="w-4 h-4 text-talentlms-blue" />
                <h4 className="text-base font-medium text-gray-700">Visual Prompt</h4>
              </div>
              <p className="text-base text-gray-600 pl-6">{slide.visualPrompt}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="w-4 h-4 text-talentlms-blue" />
                <h4 className="text-base font-medium text-gray-700">Voiceover Script</h4>
              </div>
              <p className="text-base text-gray-600 pl-6 whitespace-pre-line">{slide.voiceoverScript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideCard;
