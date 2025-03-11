
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SlideData } from '@/services/courseService';

interface PresentationViewProps {
  slides: SlideData[];
  title: string;
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ slides, title, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'Escape') {
        if (isFullScreen) {
          exitFullScreen();
        } else {
          onClose();
        }
      } else if (e.key === 'f') {
        toggleFullScreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isFullScreen, slides.length]);
  
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  
  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };
  
  const enterFullScreen = () => {
    const element = document.getElementById('presentation-container');
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
        setIsFullScreen(true);
      }
    }
  };
  
  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  
  // Handle fullscreen changes from browser
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);
  
  // Get gradient background based on index
  const getSlideGradient = (index: number) => {
    const gradients = [
      'from-blue-100 to-violet-200',
      'from-green-100 to-emerald-200',
      'from-amber-100 to-yellow-200',
      'from-rose-100 to-pink-200',
      'from-sky-100 to-indigo-200',
      'from-teal-100 to-cyan-200',
      'from-purple-100 to-fuchsia-200',
      'from-orange-100 to-amber-200',
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <div 
      id="presentation-container"
      className={cn(
        "fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-50 flex flex-col",
        isFullScreen ? "fullscreen" : ""
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-r from-talentlms-darkBlue to-talentlms-blue text-white shadow-md">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-5 h-5 mr-2" />
          Exit
        </Button>
        <h1 className="text-lg font-medium truncate max-w-md">{title}</h1>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
      
      {/* Main Content - Made scrollable */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Slide Number Indicator */}
        <div className="sticky top-4 left-4 z-10 flex justify-center w-full">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-talentlms-darkBlue text-sm shadow-md border border-white/30">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>
        
        {/* Slide Content */}
        <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-full pb-32">
          <div className={cn(
            "bg-gradient-to-br w-full max-w-5xl rounded-xl shadow-xl flex flex-col transform transition-all duration-500",
            getSlideGradient(currentSlideIndex)
          )}>
            {/* Slide header */}
            <div className="bg-gradient-to-r from-talentlms-blue to-talentlms-darkBlue text-white p-6 rounded-t-xl">
              <h2 className="text-3xl font-bold">{currentSlide?.title}</h2>
            </div>
            
            {/* Slide body - Improved layout */}
            <div className="p-6 flex flex-col gap-6 bg-white/90 backdrop-blur-sm rounded-b-xl">
              {/* Content */}
              <div className="text-xl leading-relaxed text-gray-700 bg-white/50 p-5 rounded-lg shadow-inner">
                {currentSlide?.content}
              </div>
              
              {/* Image Area - Using backend image if available */}
              {currentSlide?.imageUrl ? (
                <div className="mt-2 flex justify-center">
                  <div className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-md max-h-[350px]">
                    <img 
                      src={currentSlide.imageUrl} 
                      alt={currentSlide.title || "Slide visualization"} 
                      className="object-contain max-h-[350px] w-auto max-w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-6 bg-gray-100 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500 italic">
                    {currentSlide?.visualPrompt || "No image available for this slide."}
                  </p>
                </div>
              )}
              
              {/* Visual Prompt - Only show if there's no image */}
              {!currentSlide?.imageUrl && currentSlide?.visualPrompt && (
                <div className="mt-2 bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-700 mb-2">Visual Description:</h3>
                  <p className="text-gray-700 italic">{currentSlide?.visualPrompt}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Fixed Navigation Controls - Improved styling */}
        <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-4 z-10">
          <Button 
            variant="default"
            onClick={goToPrevSlide} 
            disabled={currentSlideIndex === 0}
            className="shadow-lg bg-white/90 backdrop-blur-sm text-talentlms-darkBlue hover:bg-white border border-white/50 
                      disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button 
            variant="default"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="shadow-lg bg-talentlms-blue/90 backdrop-blur-sm text-white hover:bg-talentlms-blue border border-talentlms-blue/50
                      disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
            size="lg"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Footer - Voiceover script with elegant styling */}
      <div className="bg-gray-800/90 backdrop-blur-md text-white p-4 h-16 hover:h-40 transition-all duration-300 overflow-hidden group border-t border-gray-700">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-medium text-gray-300">Voiceover Script 
            <span className="ml-2 text-xs text-gray-400 group-hover:opacity-0 transition-opacity">
              (Hover to expand)
            </span>
          </h3>
        </div>
        <div className="overflow-y-auto max-h-28 custom-scrollbar pr-4">
          <p className="text-base text-gray-300 whitespace-pre-line">{currentSlide?.voiceoverScript}</p>
        </div>
      </div>
    </div>
  );
};

export default PresentationView;
