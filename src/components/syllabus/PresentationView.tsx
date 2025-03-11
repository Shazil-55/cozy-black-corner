
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Maximize2, Minimize2, Volume2 } from 'lucide-react';
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
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;
  
  useEffect(() => {
    // Reset loading state when slide changes
    if (currentSlide.imageUrl) {
      setIsImageLoading(true);
    }
  }, [currentSlideIndex, currentSlide.imageUrl]);
  
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
  
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);
  
  const getSlideGradient = (index: number) => {
    const gradients = [
      'from-blue-50 to-indigo-100',
      'from-emerald-50 to-teal-100',
      'from-amber-50 to-yellow-100',
      'from-rose-50 to-pink-100',
      'from-violet-50 to-purple-100',
      'from-cyan-50 to-sky-100',
    ];
    return gradients[index % gradients.length];
  };
  
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  return (
    <div 
      id="presentation-container"
      className={cn(
        "fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-50 flex flex-col",
        isFullScreen ? "fullscreen" : ""
      )}
    >
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
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-auto">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-talentlms-darkBlue text-sm shadow-md border border-white/30">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        <div className={cn(
          "w-full max-w-5xl mx-auto my-6 h-auto bg-gradient-to-br rounded-xl shadow-xl overflow-hidden",
          getSlideGradient(currentSlideIndex)
        )}>
          <div className="bg-gradient-to-r from-talentlms-blue to-talentlms-darkBlue text-white p-6">
            <h2 className="text-3xl font-bold">{currentSlide?.title}</h2>
          </div>
          
          <div className="flex flex-col md:flex-row p-6 gap-6 bg-white/90 backdrop-blur-sm">
            <div className="w-full md:w-[60%] overflow-auto">
              <div className="prose max-w-none">
                <div className="text-xl leading-relaxed text-gray-700 bg-white/50 p-5 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
                  {currentSlide?.content}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-[40%] flex items-start justify-center p-4 bg-white/50 rounded-lg">
              {currentSlide?.imageUrl ? (
                isImageLoading ? (
                  <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
                    <div className="text-gray-400">Loading image...</div>
                  </div>
                ) : (
                  <img 
                    src={currentSlide.imageUrl} 
                    alt={currentSlide.title}
                    className="w-full h-auto object-contain rounded-lg shadow-md max-h-[300px]"
                    onLoad={handleImageLoad}
                    onError={() => setIsImageLoading(false)}
                  />
                )
              ) : (
                <div className="w-full h-[250px] flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-center italic">
                    {currentSlide?.visualPrompt || "No image available for this slide."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-6 mb-4">
          <Button 
            variant="default"
            onClick={goToPrevSlide} 
            disabled={currentSlideIndex === 0}
            className="shadow-lg bg-white/90 backdrop-blur-sm text-talentlms-darkBlue hover:bg-white"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button 
            variant="default"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="shadow-lg bg-talentlms-blue/90 backdrop-blur-sm text-white hover:bg-talentlms-blue"
            size="lg"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresentationView;
