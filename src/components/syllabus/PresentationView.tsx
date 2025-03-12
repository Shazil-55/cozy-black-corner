
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SlideData, FAQ } from '@/services/courseService';
import ChatBot from './ChatBot';

interface PresentationViewProps {
  slides: SlideData[];
  title: string;
  faqs: FAQ[];
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ slides, title, faqs = [], onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;
  
  useEffect(() => {
    // Reset image loading state when slide changes
    if (currentSlide?.imageUrl) {
      setIsImageLoading(true);
    } else {
      setIsImageLoading(false);
    }
  }, [currentSlideIndex, currentSlide]);
  
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
      'from-blue-600 to-blue-800',
      'from-emerald-600 to-teal-800',
      'from-indigo-600 to-purple-800',
      'from-rose-600 to-pink-800',
      'from-amber-600 to-orange-800',
      'from-cyan-600 to-sky-800',
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
      <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-5 h-5 mr-2" />
          Exit
        </Button>
        <h1 className="text-lg font-semibold truncate max-w-md">{title}</h1>
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
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-blue-800 text-sm font-medium shadow-md border border-white/30">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Main slide container - adjusted width and height */}
        <div className={cn(
          "w-full max-w-4xl mx-auto my-6 h-auto rounded-xl shadow-2xl overflow-hidden",
          "border border-white/10"
        )}>
          {/* Slide title bar */}
          <div className={cn(
            "bg-gradient-to-r text-white p-5",
            getSlideGradient(currentSlideIndex)
          )}>
            <h2 className="text-2xl font-bold">{currentSlide?.title}</h2>
          </div>
          
          {/* Slide content area */}
          <div className="flex flex-col md:flex-row bg-white p-0">
            {/* Text content */}
            <div className="w-full md:w-[60%] p-6 h-[500px] overflow-auto">
              <div className="prose max-w-none">
                <div className="text-lg leading-relaxed text-gray-700">
                  {currentSlide?.content}
                </div>
              </div>
            </div>
            
            {/* Image area - right side, fixed size */}
            <div className="w-full md:w-[40%] p-6 flex items-center justify-center bg-gray-50 border-l border-gray-100">
              {currentSlide?.imageUrl ? (
                isImageLoading ? (
                  <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded animate-pulse">
                    <div className="text-gray-400">Loading image...</div>
                  </div>
                ) : (
                  <img 
                    src={currentSlide.imageUrl} 
                    alt={currentSlide.title}
                    className="max-w-full max-h-[300px] object-contain rounded"
                    onLoad={handleImageLoad}
                    onError={() => setIsImageLoading(false)}
                  />
                )
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center p-6 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-500 text-center italic">
                    {currentSlide?.visualPrompt || "No image available for this slide."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <Button 
            variant="default"
            onClick={goToPrevSlide} 
            disabled={currentSlideIndex === 0}
            className="shadow-lg bg-white text-blue-800 border border-blue-100 hover:bg-blue-50"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button 
            variant="default"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="shadow-lg bg-blue-700 text-white hover:bg-blue-800"
            size="lg"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Add the ChatBot component */}
      <ChatBot faqs={faqs} />
    </div>
  );
};

export default PresentationView;
