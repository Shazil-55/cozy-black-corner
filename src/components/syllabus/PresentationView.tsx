import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlideData, FAQ } from '@/services/courseService';
import ChatBot from './ChatBot';

export interface PresentationViewProps {
  slides: SlideData[];
  title: string;
  faqs: FAQ[];
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({
  slides,
  title,
  faqs,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    // Reset to the first slide when the slides prop changes
    setCurrentSlideIndex(0);
  }, [slides]);

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slides.length - 1)
    );
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center">
        {currentSlide ? (
          <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl text-gray-800">
            <h3 className="text-2xl font-bold mb-4">{currentSlide.title}</h3>
            <img
              src={currentSlide.imageUrl || undefined}
              alt={currentSlide.title}
              className="w-full h-auto rounded-md mb-4"
            />
            <p className="text-lg">{currentSlide.content}</p>
          </div>
        ) : (
          <div className="text-white text-xl">No slides available.</div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <span className="text-white text-sm">
          Slide {currentSlideIndex + 1} of {slides.length}
        </span>
        <Button
          variant="secondary"
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      
      {/* Add ChatBot component */}
      {faqs && faqs.length > 0 && <ChatBot faqs={faqs} />}
    </div>
  );
};

export default PresentationView;
