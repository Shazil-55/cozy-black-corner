
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Presentation, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSyllabusGenerator } from '@/hooks/useSyllabusGenerator';
import SlideCard from '@/components/syllabus/SlideCard';

const ClassDetails = () => {
  const { moduleId, classId } = useParams<{ moduleId: string; classId: string }>();
  const { modules } = useSyllabusGenerator();
  
  const { currentClass, moduleIndex, classIndex, slides } = useMemo(() => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return { currentClass: null, moduleIndex: -1, classIndex: -1, slides: [] };
    
    const classIndex = modules[moduleIndex].classes.findIndex(c => c.id === classId);
    if (classIndex === -1) return { currentClass: null, moduleIndex, classIndex: -1, slides: [] };
    
    return { 
      currentClass: modules[moduleIndex].classes[classIndex],
      moduleIndex,
      classIndex,
      slides: modules[moduleIndex].slides?.[classIndex] || []
    };
  }, [modules, moduleId, classId]);

  if (!currentClass) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-medium mb-4">Class not found</h2>
        <Button asChild>
          <Link to="/">Go back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-talentlms-blue mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Syllabus
          </Link>
          
          <div className="bg-white rounded-lg p-6 shadow-subtle">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-talentlms-blue rounded-full flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-medium text-talentlms-darkBlue">
                {currentClass.title}
              </h1>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Key Points:</h3>
              <ul className="list-disc list-inside space-y-1 pl-1 text-gray-700">
                {currentClass.corePoints.map((point, index) => (
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
    </div>
  );
};

export default ClassDetails;
