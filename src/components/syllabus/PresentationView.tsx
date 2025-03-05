
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slide } from '@/hooks/useSyllabusGenerator';
import { useImageGenerator } from '@/hooks/useImageGenerator';

interface PresentationViewProps {
  slides: Slide[];
  title: string;
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ slides, title, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { generateImage, results } = useImageGenerator();
  
  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;
  
  // Generate image for the current slide
  useEffect(() => {
    if (currentSlide?.visualPrompt) {
      const slideId = `slide-${currentSlideIndex}`;
      generateImage(currentSlide.visualPrompt, slideId);
    }
  }, [currentSlideIndex, currentSlide?.visualPrompt, generateImage]);
  
  // Get current slide image data
  const currentSlideId = `slide-${currentSlideIndex}`;
  const currentImageData = results[currentSlideId] || { 
    loading: false, 
    imageUrl: null, 
    error: null 
  };
  
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
  
  return (
    <div 
      id="presentation-container"
      className={cn(
        "fixed inset-0 bg-gray-900 z-50 flex flex-col",
        isFullScreen ? "fullscreen" : ""
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-talentlms-darkBlue text-white">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-talentlms-blue/30"
          onClick={onClose}
        >
          <X className="w-5 h-5 mr-2" />
          Exit
        </Button>
        <h1 className="text-lg font-medium truncate max-w-md">{title}</h1>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-talentlms-blue/30"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
      
      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-0 left-0 m-4 text-white text-sm flex items-center">
          <span className="px-3 py-1 bg-talentlms-blue rounded-full">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>
        
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg flex flex-col h-full">
          {/* Slide header */}
          <div className="bg-talentlms-blue text-white p-6 rounded-t-lg">
            <h2 className="text-3xl font-bold">{currentSlide?.title}</h2>
          </div>
          
          {/* Slide body */}
          <div className="p-8 flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="text-xl leading-relaxed text-gray-700 mb-6">{currentSlide?.content}</p>
              
              {/* Generated Image Area */}
              <div className="mt-4 flex-1">
                <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                  {currentImageData.loading ? (
                    <div className="p-8 h-64 flex flex-col items-center justify-center text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p>Generating image...</p>
                    </div>
                  ) : currentImageData.imageUrl ? (
                    <img 
                      src={currentImageData.imageUrl} 
                      alt={currentSlide?.title || "Slide visualization"} 
                      className="w-full h-auto object-contain max-h-[400px]"
                    />
                  ) : (
                    <div className="p-8 h-64 flex items-center justify-center text-gray-500 bg-gray-100">
                      <p className="text-center">{currentImageData.error || "No image available"}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Visual Prompt:</h3>
                  <p className="text-gray-700 italic">{currentSlide?.visualPrompt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          <Button 
            variant="secondary"
            onClick={goToPrevSlide} 
            disabled={currentSlideIndex === 0}
            className="bg-white/90 text-gray-800 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button 
            variant="secondary"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="bg-white/90 text-gray-800 hover:bg-white"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Footer - Voiceover script */}
      <div className="bg-gray-800 text-white p-4 max-h-36 overflow-y-auto">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-medium text-gray-300">Voiceover Script:</h3>
        </div>
        <p className="text-base text-gray-300 whitespace-pre-line">{currentSlide?.voiceoverScript}</p>
      </div>
    </div>
  );
};

export default PresentationView;
