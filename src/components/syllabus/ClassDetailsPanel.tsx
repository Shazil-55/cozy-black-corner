
import React from "react";
import { ArrowLeft, Presentation, FileQuestion, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlideCard from "./SlideCard";
import { SlideData, FAQ, UserTest } from "@/services/courseService";
import { Link } from "react-router-dom";

interface ClassDetailsPanelProps {
  title: string;
  corePoints: string[];
  slides: SlideData[];
  faqs?: FAQ[];
  userTest?: UserTest;
  onBack: () => void;
  onStartPresentation: () => void;
}

const ClassDetailsPanel: React.FC<ClassDetailsPanelProps> = ({
  title,
  corePoints,
  slides,
  faqs = [],
  userTest,
  onBack,
  onStartPresentation,
}) => {
  // Extract classId from the first slide if available
  const classId = slides.length > 0 ? slides[0].classId : "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-talentlms-blue p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onStartPresentation}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            disabled={slides.length === 0}
          >
            <Presentation className="w-4 h-4 mr-2" />
            Start Presentation
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-3 text-talentlms-darkBlue dark:text-white">
            Core Points
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700 dark:text-gray-300">
            {corePoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-talentlms-darkBlue dark:text-white">
            Slides
          </h4>
          <div className="space-y-4">
            {slides.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No slides available.
              </p>
            ) : (
              slides.map((slide, index) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  slideNumber={index + 1}
                />
              ))
            )}
          </div>
        </div>

        {/* Quiz Button at the bottom - conditionally show based on userTest */}
        {slides.length > 0 && (
          <div className="mt-8 flex justify-center">
            {userTest ? (
              <Link to={`/quiz/${classId}?view=results`}>
                <Button className="bg-amber-500 hover:bg-amber-600 px-6 py-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  View Results
                </Button>
              </Link>
            ) : (
              <Link to={`/quiz/${classId}`}>
                <Button className="bg-green-600 hover:bg-green-700 px-6 py-2 flex items-center gap-2">
                  <FileQuestion className="w-5 h-5" />
                  Start Quiz
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailsPanel;
