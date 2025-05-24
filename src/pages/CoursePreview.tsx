import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  MessageCircle, 
  FileText,
  Info,
  ArrowLeft,
  Presentation,
  FileQuestion
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import PresentationView from '@/components/syllabus/PresentationView';

// Define course related interfaces
export interface Slide {
  id: string;
  title: string;
  slideNo: number;
  visualPrompt: string;
  voiceoverScript: string;
  imageUrl: string | null;
  content: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  example: string;
}

export interface Class {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: Slide[];
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CourseInfo {
  id: string;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  courseCode: string | null;
  price: number | null;
  categoryId: string | null;
  description: string | null;
  image: string | null;
  isPublished: boolean | null;
}

export interface CourseResponse {
  data: {
    courseInfo: CourseInfo;
    classes: Class[];
  };
}

const CoursePreview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const { theme } = useTheme();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['course-preview', courseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/user/course/${courseId}`);
        return response.data as CourseResponse;
      } catch (error) {
        console.error('Error fetching course data:', error);
        throw error;
      }
    },
    enabled: !!courseId,
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading course",
        description: "Failed to load course preview. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const startPresentation = () => {
    if (course?.classes[activeClassIndex]?.slides) {
      setIsPresentationMode(true);
    } else {
      toast({
        title: "Cannot start presentation",
        description: "This class doesn't have any slides to present.",
        variant: "destructive",
      });
    }
  };

  const closePresentation = () => {
    setIsPresentationMode(false);
  };

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        theme === 'dark' 
          ? "bg-gradient-to-br from-violet-950 to-indigo-950 text-white" 
          : "bg-gradient-to-br from-violet-50 to-indigo-100"
      )}>
        <div className="text-center animate-fade-in max-w-md">
          <div className={cn(
            "w-20 h-20 border-t-4 border-b-4 border-solid rounded-full animate-spin mx-auto mb-8",
            theme === 'dark' ? "border-violet-400" : "border-violet-600"
          )}></div>
          <h2 className={cn(
            "text-3xl font-bold text-transparent bg-clip-text mb-4",
            theme === 'dark'
              ? "bg-gradient-to-r from-violet-400 to-indigo-300"
              : "bg-gradient-to-r from-violet-600 to-indigo-600"
          )}>Loading your learning journey</h2>
          <p className={cn(
            "mx-auto leading-relaxed",
            theme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            We're preparing an amazing learning experience just for you. This will only take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        theme === 'dark' 
          ? "bg-gradient-to-br from-violet-950 to-indigo-950" 
          : "bg-gradient-to-br from-violet-50 to-indigo-100"
      )}>
        <div className={cn(
          "max-w-lg w-full p-8 rounded-2xl shadow-lg text-center animate-fade-in",
          theme === 'dark'
            ? "bg-gray-800/90 backdrop-blur-md"
            : "bg-white/90 backdrop-blur-md"
        )}>
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            theme === 'dark' ? "bg-red-900/30" : "bg-red-100"
          )}>
            <Info className={cn(
              "h-10 w-10",
              theme === 'dark' ? "text-red-400" : "text-red-600"
            )} />
          </div>
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-4",
            theme === 'dark'
              ? "bg-gradient-to-r from-violet-400 to-indigo-400"
              : "bg-gradient-to-r from-violet-700 to-indigo-700"
          )}>
            Oops! Unable to load course
          </h2>
          <p className={cn(
            "mb-8 leading-relaxed",
            theme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            We encountered an issue while loading this course. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="hover:scale-105 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} className={cn(
              "hover:scale-105 transition-all text-white",
              theme === 'dark'
                ? "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            )}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const course = data.data;
  const classes = course.classes || [];
  const activeClass = classes[activeClassIndex] || null;
  const slides = activeClass?.slides || [];
  const activeSlide = slides[activeSlideIndex] || null;
  const totalClasses = classes.length;
  const totalSlides = slides.length;

  const goToNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    } else if (activeClassIndex < classes.length - 1) {
      setActiveClassIndex(activeClassIndex + 1);
      setActiveSlideIndex(0);
    }
  };

  const goToPreviousSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (activeClassIndex > 0) {
      setActiveClassIndex(activeClassIndex - 1);
      setActiveSlideIndex(classes[activeClassIndex - 1].slides.length - 1);
    }
  };

  const handleClassSelect = (index: number) => {
    setActiveClassIndex(index);
    setActiveSlideIndex(0);
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlideIndex(index);
  };
  
  const getSlideProgress = () => {
    if (!totalSlides) return 0;
    return ((activeSlideIndex + 1) / totalSlides) * 100;
  };

  const renderClassAccordion = (classItem: Class, classIndex: number) => (
    <AccordionItem 
      key={classItem.classId} 
      value={classItem.classId}
      className={cn(
        "border mb-3 overflow-hidden transition-all duration-300 rounded-lg",
        theme === 'dark'
          ? "border-violet-700/40" 
          : "border-violet-100/60",
        classIndex === activeClassIndex 
          ? theme === 'dark'
            ? "bg-gradient-to-br from-violet-900/40 to-indigo-900/50 shadow-lg" 
            : "bg-gradient-to-br from-violet-50 to-indigo-50 shadow-lg"
          : theme === 'dark'
            ? "bg-violet-950/40 hover:bg-violet-900/30"
            : "bg-white/90 hover:bg-violet-50/70"
      )}
    >
      <AccordionTrigger className="py-3 px-4 hover:no-underline group">
        <div className="flex items-center text-left">
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-medium shadow-md transition-colors",
              classIndex === activeClassIndex 
                ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" 
                : theme === 'dark'
                  ? "bg-violet-800 text-violet-200 group-hover:bg-violet-700"
                  : "bg-violet-100 text-violet-700 group-hover:bg-violet-200"
            )}
          >
            {classItem.classNo}
          </div>
          <span className={cn(
            "font-medium transition-colors text-lg",
            classIndex === activeClassIndex 
              ? theme === 'dark'
                ? "text-violet-200" 
                : "text-violet-900"
              : theme === 'dark'
                ? "text-gray-300 group-hover:text-violet-300"
                : "text-gray-700 group-hover:text-violet-700"
          )}>
            {classItem.classTitle}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className={cn(
        "px-4 pt-2 pb-4 backdrop-blur-sm",
        theme === 'dark'
          ? "bg-violet-950/80"
          : "bg-white/80"
      )}>
        <ul className="space-y-1.5">
          {classItem.slides.map((slide, slideIndex) => (
            <li key={slide.id} className="animate-fade-in" style={{ animationDelay: `${slideIndex * 50}ms` }}>
              <button
                onClick={() => {
                  handleClassSelect(classIndex);
                  handleSlideSelect(slideIndex);
                }}
                className={cn(
                  "w-full flex items-center text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 hover:translate-x-1",
                  classIndex === activeClassIndex && slideIndex === activeSlideIndex
                    ? theme === 'dark'
                      ? "bg-gradient-to-r from-violet-800/70 to-indigo-800/70 text-violet-100 font-medium shadow-sm"
                      : "bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-900 font-medium shadow-sm"
                    : theme === 'dark'
                      ? "hover:bg-violet-800/30 text-gray-300"
                      : "hover:bg-violet-50/80 text-gray-700",
                )}
              >
                <span className={cn(
                  "mr-2.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  theme === 'dark'
                    ? "bg-violet-800/50 text-violet-300"
                    : "bg-violet-100 text-violet-700"
                )}>
                  {slide.slideNo}
                </span>
                <span className="truncate">{slide.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <>
      {isPresentationMode && activeClass && (
        <PresentationView
          slides={activeClass.slides}
          title={activeClass.classTitle}
          faqs={activeClass.faqs || []}
          onClose={closePresentation}
          classId={activeClass.classId}
        />
      )}

      <div className={cn(
        "min-h-screen overflow-hidden",
        theme === 'dark'
          ? "bg-gradient-to-br from-violet-950/80 to-indigo-950/80" 
          : "bg-gradient-to-br from-violet-50 to-indigo-100"
      )}>
        {/* Header */}
        <header className={cn(
          "py-4 px-6 sticky top-0 z-30 border-b shadow-sm",
          theme === 'dark'
            ? "bg-violet-950/80 backdrop-blur-md border-violet-700/40"
            : "bg-white/80 backdrop-blur-md border-violet-100/60"
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-fade-in">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)} 
                className={cn(
                  "rounded-full",
                  theme === 'dark'
                    ? "hover:bg-violet-800/50 text-violet-300"
                    : "hover:bg-violet-100/80 text-violet-700"
                )}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className={cn(
                  "text-xl md:text-2xl font-bold text-transparent bg-clip-text truncate max-w-[300px] md:max-w-md animate-fade-in",
                  theme === 'dark'
                    ? "bg-gradient-to-r from-violet-300 to-indigo-300"
                    : "bg-gradient-to-r from-violet-700 to-indigo-700"
                )}>
                  {course?.courseInfo.courseTitle}
                </h1>
                <p className={cn(
                  "text-sm animate-fade-in",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )} style={{ animationDelay: '100ms' }}>
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs mr-2",
                    theme === 'dark'
                      ? "bg-violet-800/40 text-violet-300"
                      : "bg-violet-100/60 text-violet-700"
                  )}>Learning Journey</span> 
                  {totalClasses} Classes • {slides.length} Slides in current class
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Theme toggle button */}
              <ThemeToggle />
              
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "hidden md:flex animate-fade-in",
                  theme === 'dark'
                    ? "border-violet-700 hover:bg-violet-800/60 text-violet-300"
                    : "border-violet-200 hover:bg-violet-100/80 text-violet-700"
                )}
                onClick={() => navigate(-1)}
                style={{ animationDelay: '150ms' }}
              >
                Exit Preview
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "md:hidden",
                  theme === 'dark' ? "text-violet-300" : "text-violet-700"
                )}
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex max-w-7xl mx-auto px-4 py-6 md:py-8 gap-5 md:gap-8">
          {/* Course Content navigation panel - fixed when scrolling */}
          <div 
            className={cn(
              "animate-fade-in transition-all duration-300",
              showSidebar 
                ? "w-80 sticky top-24 self-start max-h-[calc(100vh-96px)] flex-shrink-0 translate-x-0 opacity-100" 
                : "-translate-x-full opacity-0 w-0 md:translate-x-0 md:opacity-100 md:w-0 md:overflow-hidden"
            )}
            style={{ animationDelay: '200ms' }}
          >
            <div className={cn(
              "backdrop-blur-md rounded-2xl shadow-lg border overflow-hidden h-full flex flex-col",
              theme === 'dark'
                ? "bg-gradient-to-br from-violet-950/40 via-indigo-950/60 to-purple-950/40 border-violet-700/40"
                : "bg-white/90 border-violet-100/60"
            )}>
              <div className={cn(
                "p-5 border-b flex items-center space-x-3",
                theme === 'dark' ? "border-violet-700/40" : "border-violet-100/60"
              )}>
                <BookOpen className={cn(
                  "w-5 h-5",
                  theme === 'dark' ? "text-violet-400" : "text-violet-600"
                )} />
                <h2 className={cn(
                  "text-lg font-semibold",
                  theme === 'dark' ? "text-violet-100" : "text-violet-900"
                )}>
                  Course Content
                </h2>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full" 
                  defaultValue={activeClass?.classId}
                >
                  {classes.map((classItem, classIndex) => renderClassAccordion(classItem, classIndex))}
                </Accordion>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className={cn(
            "flex-1 animate-fade-in transition-all duration-300",
            !showSidebar && "md:pl-0"
          )} style={{ animationDelay: '300ms' }}>
            {activeClass && activeSlide ? (
              <div className={cn(
                "backdrop-blur-md rounded-2xl shadow-lg border p-6 md:p-8",
                theme === 'dark'
                  ? "bg-violet-950/60 border-violet-700/40"
                  : "bg-white/90 border-violet-100/60"
              )}>
                <div className="mb-6 md:mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4 gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          theme === 'dark'
                            ? "bg-violet-800/60 text-violet-300"
                            : "bg-violet-100/80 text-violet-700"
                        )}>
                          Class {activeClass.classNo} • Slide {activeSlide.slideNo}/{slides.length}
                        </span>
                        <Progress 
                          value={getSlideProgress()} 
                          className={cn(
                            "w-24 h-1.5",
                            theme === 'dark' ? "bg-violet-900/60" : "bg-violet-100"
                          )}
                        />
                      </div>
                      <h2 className={cn(
                        "text-2xl md:text-3xl font-bold text-transparent bg-clip-text",
                        theme === 'dark'
                          ? "bg-gradient-to-r from-violet-300 to-indigo-300"
                          : "bg-gradient-to-r from-violet-700 to-indigo-700"
                      )}>
                        {activeSlide.title}
                      </h2>
                    </div>
                    
                    {/* Presentation button for current slide */}
                    <Button 
                      onClick={startPresentation}
                      size="sm" 
                      className={cn(
                        "flex items-center space-x-2 transition-all duration-300 hover:scale-105",
                        theme === 'dark'
                          ? "bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 text-white"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                      )}
                    >
                      <Presentation className="h-4 w-4 mr-1" />
                      Start Presentation
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                  <TabsList className={cn(
                    "mb-6 p-1 rounded-xl",
                    theme === 'dark' ? "bg-violet-900/40" : "bg-violet-50/80"
                  )}>
                    <TabsTrigger 
                      value="content" 
                      className={cn(
                        "rounded-lg transition-all",
                        theme === 'dark'
                          ? "data-[state=active]:bg-violet-800/70 data-[state=active]:text-violet-100"
                          : "data-[state=active]:bg-white data-[state=active]:text-violet-700",
                        "data-[state=active]:shadow-sm"
                      )}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quiz" 
                      className={cn(
                        "rounded-lg transition-all",
                        theme === 'dark'
                          ? "data-[state=active]:bg-violet-800/70 data-[state=active]:text-violet-100"
                          : "data-[state=active]:bg-white data-[state=active]:text-violet-700",
                        "data-[state=active]:shadow-sm"
                      )}
                    >
                      <FileQuestion className="w-4 h-4 mr-2" />
                      Attempt Quiz
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="pt-2 pb-6 animate-fade-in focus:outline-none">
                    <div className={cn(
                      "rounded-xl overflow-hidden border shadow-sm",
                      theme === 'dark'
                        ? "border-violet-700/40 bg-violet-900/40"
                        : "border-violet-100/60 bg-white/80"
                    )}>
                      {activeSlide.imageUrl && (
                        <div className="transition-all duration-300 hover:scale-[1.01] transform-gpu overflow-hidden">
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={activeSlide.imageUrl} 
                              alt={activeSlide.title} 
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8 space-y-5">
                        <div className="prose dark:prose-invert max-w-none">
                          <p className={cn(
                            "leading-relaxed text-lg",
                            theme === 'dark' ? "text-gray-300" : "text-gray-700"
                          )}>
                            {activeSlide.content}
                          </p>
                        </div>
                        
                        {activeSlide.example && (
                          <div className={cn(
                            "mt-8 p-5 md:p-6 rounded-xl border-l-4 animate-fade-in shadow-inner",
                            theme === 'dark'
                              ? "bg-gradient-to-r from-violet-900/40 to-indigo-900/30 border-violet-500"
                              : "bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-400"
                          )}
                            style={{ animationDelay: '400ms' }}
                          >
                            <h4 className={cn(
                              "text-lg font-medium mb-3 flex items-center",
                              theme === 'dark' ? "text-violet-300" : "text-violet-700"
                            )}>
                              <span className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold",
                                theme === 'dark'
                                  ? "bg-violet-700 text-violet-200"
                                  : "bg-violet-200 text-violet-700"
                              )}>!</span>
                              Example
                            </h4>
                            <p className={theme === 'dark' ? "text-gray-300" : "text-gray-700"}>
                              {activeSlide.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quiz" className="pt-2 pb-6 animate-fade-in focus:outline-none">
                    <div className={cn(
                      "flex flex-col items-center justify-center p-8 md:p-12 rounded-xl border text-center",
                      theme === 'dark'
                        ? "border-violet-700/40 bg-gradient-to-br from-violet-900/30 to-indigo-900/30"
                        : "border-violet-100/60 bg-gradient-to-br from-violet-50/80 to-indigo-50/80"
                    )}>
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-6", 
                        theme === 'dark' ? "bg-violet-800/50" : "bg-violet-100"
                      )}>
                        <FileQuestion className={cn(
                          "w-8 h-8", 
                          theme === 'dark' ? "text-violet-300" : "text-violet-600"
                        )} />
                      </div>
                      <h3 className={cn(
                        "text-2xl font-bold mb-3",
                        theme === 'dark' ? "text-violet-100" : "text-violet-800"
                      )}>
                        Ready to test your knowledge?
                      </h3>
                      <p className={cn(
                        "max-w-md mb-8",
                        theme === 'dark' ? "text-gray-300" : "text-gray-600"
                      )}>
                        Take a quiz to assess your understanding of the concepts covered in this class.
                      </p>
                      <Button 
                        onClick={() => navigate(`/quiz/${activeClass.classId}`)}
                        className={cn(
                          "px-8 py-6 text-white font-medium text-lg transition-all duration-300 hover:scale-105",
                          theme === 'dark'
                            ? "bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                        )}
                      >
                        <FileQuestion className="mr-2 h-5 w-5" />
                        Start Quiz
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className={cn(
                  "flex items-center justify-between pt-4 border-t",
                  theme === 'dark' ? "border-violet-700/40" : "border-violet-100/60"
                )}>
                  <Button
                    variant="outline"
                    onClick={goToPreviousSlide}
                    disabled={activeClassIndex === 0 && activeSlideIndex === 0}
                    className={cn(
                      "flex items-center space-x-2 transition-transform hover:translate-x-[-2px]",
                      theme === 'dark'
                        ? "border-violet-700 hover:bg-violet-800/60 text-violet-300"
                        : "border-violet-200 hover:bg-violet-100/80 text-violet-700"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className={cn(
                    "px-3 py-1 rounded-full hidden md:flex items-center shadow-inner",
                    theme === 'dark' ? "bg-violet-800/40" : "bg-violet-50/80"
                  )}>
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-violet-300" : "text-violet-700"
                    )}>
                      {activeSlideIndex + 1} of {slides.length}
                    </span>
                  </div>
                  
                  <Button
                    onClick={goToNextSlide}
                    disabled={activeClassIndex === classes.length - 1 && activeSlideIndex === slides.length - 1}
                    className={cn(
                      "flex items-center space-x-2 transition-transform hover:translate-x-[2px] hover:shadow-md text-white",
                      theme === 'dark'
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    )}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className={cn(
                "h-full flex items-center justify-center backdrop-blur-md rounded-2xl shadow-lg border p-12 animate-fade-in",
                theme === 'dark'
                  ? "bg-violet-950/60 border-violet-700/40"
                  : "bg-white/90 border-violet-100/60"
              )}>
                <div className="text-center max-w-md">
                  <div className="mb-8">
                    <BookOpen className={cn(
                      "h-24 w-24 mx-auto",
                      theme === 'dark' ? "text-violet-700" : "text-violet-300"
                    )} />
                  </div>
                  <h3 className={cn(
                    "text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-4",
                    theme === 'dark'
                      ? "bg-gradient-to-r from-violet-300 to-indigo-300"
                      : "bg-gradient-to-r from-violet-700 to-indigo-700"
                  )}>No content available</h3>
                  <p className={cn(
                    "mb-8",
                    theme === 'dark' ? "text-gray-400" : "text-gray-600"
                  )}>
                    This course doesn't have any content yet. Please check back later or explore other courses.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)} 
                    className={cn(
                      "hover:scale-105 transition-transform",
                      theme === 'dark'
                        ? "border-violet-700 hover:bg-violet-800/60 text-violet-300"
                        : "border-violet-200 hover:bg-violet-100/80 text-violet-700"
                    )}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePreview;
