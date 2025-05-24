import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams  } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Settings, 
  CheckCircle, 
  X, 
  Users, 
  Upload, 
  Eye, 
  Edit,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Lightbulb,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  Save,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { useSocketProgress } from "@/hooks/useSocketProgress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/components/Sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EditCourseModal } from "@/components/courses/EditCourseModal";
import { useQuery } from "@tanstack/react-query";
import { courseService, AddSlidePayload, UpdateSlidePayload, QuizQuestionWithOptions, UpdateClassPayload, CourseResponse, Class, SlideData } from "@/services/courseService";
import QuizManager from "@/components/quiz/QuizManager";
import SlidePreviewModal from "@/components/syllabus/SlidePreviewModal";



interface FAQ {
  question: string;
  answer: string;
}

interface QuizQuestion {
  id?: string | number; // Make id optional for new questions
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  classId?: string | number; // Make classId optional for new questions
  createdAt?: string; // Make createdAt optional for new questions
  updatedAt?: string; // Make updatedAt optional for new questions
}

interface GeneratedClassData {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: SlideData[]; // Now using the updated SlideData interface
  faqs: FAQ[];
  quizzes: QuizQuestionWithOptions[];
}

interface AddSlideFormData {
  title: string;
  content: string;
  visualPrompt: string;
  voiceoverScript: string;
  example: string;
}

const CourseEditor: React.FC = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const navigate = useNavigate();
	const [courseName, setCourseName] = useState("Loading course...");
	const [isPublishing, setIsPublishing] = useState(false);
	const [generatedClasses, setGeneratedClasses] = useState<GeneratedClassData[]>([]);
	const [selectedClass, setSelectedClass] = useState<GeneratedClassData | null>(null);
	const [showMainLoader, setShowMainLoader] = useState(true);
  const [searchParams] = useSearchParams();

  const isEdit = searchParams.get("isEdit") === "true";

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    concepts: true,
    slides: true,
    faqs: true,
    quizzes: true
  });
  const [slideView, setSlideView] = useState<'grid' | 'list'>('grid');
  const [hovered, setHovered] = useState<string | null>(null);
  const [addSlideDialogOpen, setAddSlideDialogOpen] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideFormData, setSlideFormData] = useState<AddSlideFormData>({
    title: "",
    content: "",
    visualPrompt: "",
    voiceoverScript: "",
    example: ""
  });
  const [isSubmittingSlide, setIsSubmittingSlide] = useState(false);
  const [generationNotifications, setGenerationNotifications] = useState<Array<{id: string, message: string}>>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // New state to track whether we're editing an existing course or generating a new one
  const [isEditMode, setIsEditMode] = useState(false);

  // New state for editing functionality
  const [isEditingTitleConcepts, setIsEditingTitleConcepts] = useState(false);
  const [editedClassTitle, setEditedClassTitle] = useState("");
  const [editedConcepts, setEditedConcepts] = useState<string[]>([]);
  const [newConceptInput, setNewConceptInput] = useState("");

  // Add this for the QuizManager
  const handleQuizChange = (classId: string, newQuizzes: QuizQuestionWithOptions[]) => {
    setGeneratedClasses(prev => 
      prev.map(classData => 
        classData.classId === classId
          ? { ...classData, quizzes: newQuizzes }
          : classData
      )
    );
    
    // Also update the selectedClass if it matches the classId
    if (selectedClass && selectedClass.classId === classId) {
      setSelectedClass(prev => {
        if (!prev) return null;
        return { ...prev, quizzes: newQuizzes };
      });
    }
  };

  // Fetch existing course data for edit mode

  const { data: courseData, isSuccess } = useQuery({
    queryKey: ["course-for-edit", courseId],
    queryFn: () => courseService.getCourseForEdit(courseId!),
    enabled: !!courseId,
  });
  
  useEffect(() => { 
    if (isEdit && isSuccess && courseData?.data?.courseInfo) {
      console.log("Course data loaded for editing:", courseData);
      
      setIsEditMode(true);
      setCourseName(courseData.data.courseInfo.courseTitle);
  
      const formattedClasses: GeneratedClassData[] = courseData.data.classes.map(classData => ({
        classNo: classData.classNo,
        classId: classData.classId,
        classTitle: classData.classTitle,
        concepts: classData.concepts || [],
        slides: classData.slides.map(slide => ({
          slideId: slide.id,
          id: slide.id, // Add id property
          slideNo: slide.slideNo,
          slideTitle: slide.title,
          title: slide.title, // Add title property
          content: slide.content,
          voiceoverScript: slide.voiceoverScript,
          visualPrompt: slide.visualPrompt,
          imageUrl: slide.imageUrl, // Add imageUrl property
          classId: slide.classId, // Add classId property
          example: slide.example || ""
        })),
        faqs: classData.faqs || [],
        quizzes: classData.quizzes || []
      }));
  
      setGeneratedClasses(formattedClasses);
  
      if (formattedClasses.length > 0) {
        setSelectedClass(formattedClasses[0]);
        setEditedClassTitle(formattedClasses[0].classTitle);
        setEditedConcepts([...formattedClasses[0].concepts]);
      }
  
      setShowMainLoader(false);
    }
  }, [isSuccess, courseData, isEdit]);

  console.log(courseData, isEditMode);
  
  // Fetch course details from API when available (this is the existing query)
  const { data: courseDetails } = useQuery({
    queryKey: ["course-editor-details", courseId],
    queryFn: () => courseService.getCourseEditorDetails(courseId!),
    enabled: !!courseId && !isEditMode, // Only fetch if we're not in edit mode
  });
  
  // Update courseName when courseDetails changes
  useEffect(() => {
    if (courseDetails?.course && !isEditMode) {
      setCourseName(courseDetails.course.courseTitle || "Untitled Course");
    }
  }, [courseDetails, isEditMode]);

	// Get socket connection for real-time updates - prevent disconnection by setting dependencies to []
	const { socket, isConnected, progressData } = useSocketProgress();

	// Listen for socket events for course generation
	useEffect(() => {
		if (!socket || !isConnected || isEditMode) {
			console.log("Socket not connected in CourseEditor or in edit mode, waiting...");
			return;
		}
		
		console.log("Setting up class_data listener in CourseEditor");
		
		// Listen for class data generation
		socket.on('class_data', (data: GeneratedClassData) => {
			console.log("Received class data:", data);
			
			setGeneratedClasses(prev => {
				// Check if we already have this class (prevent duplicates)
				const exists = prev.some(c => c.classId === data.classId);
				if (exists) {
					return prev;
				}
				
				// Set the first class as selected by default if we don't have a selected class yet
				if (!selectedClass) {
					setSelectedClass(data);
				}
				
				// Hide main loader after first class is generated
				if (prev.length === 0) {
					setTimeout(() => {
						setShowMainLoader(false);
					}, 500); // Short delay to let animations complete
				}
				
				return [...prev, data];
			});
			
      // Show toast notification that auto-closes
      toast.success(`Class ${data.classNo} generated`, {
        description: data.classTitle,
        duration: 5000
      });
      
      // Add class generation badge notification (will auto-remove after 5 seconds)
      const notificationId = Date.now().toString();
      setGenerationNotifications(prev => [
        ...prev, 
        {
          id: notificationId,
          message: `Class ${data.classNo} generated: ${data.classTitle}`
        }
      ]);
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setGenerationNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      }, 5000);
		});
		
		return () => {
			// Only remove the event listener, but don't disconnect the socket
			if (socket) {
				console.log("Removing class_data listener");
				socket.off('class_data');
			}
		};
	}, [socket, isConnected, selectedClass, isEditMode]);

	const handlePublishCourse = async () => {
		setIsPublishing(true);
		
		try {
			if (!courseId) {
				throw new Error("Course ID is missing");
			}
			
			await courseService.publishCourse(courseId);
			
			toast.success("Course published successfully", {
				description: "Your course is now available to enrolled students",
				duration: 5000
			});
			
			// Update local state if needed
			if (courseDetails?.course) {
				courseDetails.course.isPublished = true;
			}
			
		} catch (error) {
			console.error("Error publishing course:", error);
			toast.error("Failed to publish course", {
				description: "An error occurred while publishing your course",
				duration: 5000
			});
		} finally {
			setIsPublishing(false);
		}
	};
	
	const handleClassSelect = (classData: GeneratedClassData) => {
		setSelectedClass(classData);
    // Initialize edited values when selecting a class
    if (classData) {
      setEditedClassTitle(classData.classTitle);
      setEditedConcepts([...classData.concepts]);
    }
	};

	const calculateProgress = (): number => {
		// If we have socket progress, use that
		if (progressData.status !== 'idle') {
			const match = progressData.progress.match(/(\d+)%/);
			if (match && match[1]) {
				return parseInt(match[1], 10);
			}
		}
		
		// Otherwise calculate based on generated classes
		if (generatedClasses.length === 0) return 5;
		// Assume we'll have 5 classes total
		return Math.min(95, Math.floor((generatedClasses.length / 5) * 100));
	};

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSlideView = () => {
    setSlideView(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Get the exact progress value for display
  const getProgressText = (): string => {
    if (progressData.status !== 'idle') {
      return progressData.progress;
    }
    return `${calculateProgress()}%`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlideFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to open the add slide modal
  const openAddSlideModal = () => {
    setIsEditingSlide(false);
    setEditingSlideId(null);
    setSlideFormData({
      title: "",
      content: "",
      visualPrompt: "",
      voiceoverScript: "",
      example: ""
    });
    setAddSlideDialogOpen(true);
  };

  // Function to open the edit slide modal
  const openEditSlideModal = (slide: SlideData) => {
    if (!slide.slideId) {
      toast.error("Cannot edit slide without ID");
      return;
    }
    
    setIsEditingSlide(true);
    setEditingSlideId(slide.slideId);
    setSlideFormData({
      title: slide.slideTitle || "",
      content: slide.content || "",
      visualPrompt: slide.visualPrompt || "",
      voiceoverScript: slide.voiceoverScript || "",
      example: slide.example || ""
    });
    setAddSlideDialogOpen(true);
  };

  // Function to add a new slide
  const handleAddSlide = async () => {
    if (!selectedClass) return;
    
    setIsSubmittingSlide(true);
    
    try {
      const slidePayload: AddSlidePayload = {
        title: slideFormData.title,
        content: slideFormData.content,
        visualPrompt: slideFormData.visualPrompt,
        voiceoverScript: slideFormData.voiceoverScript,
        example: slideFormData.example
      };
      
      if (isEditingSlide && editingSlideId) {
        // Update slide
        await courseService.updateSlide(editingSlideId, slidePayload);
        toast.success("Slide updated successfully");
        
        // Update the slide in the UI
        setSelectedClass(prev => {
          if (!prev) return null;
          const updatedSlides = prev.slides.map(slide => {
            if (slide.slideId === editingSlideId) {
              return {
                ...slide,
                slideTitle: slideFormData.title,
                title: slideFormData.title, // Add title property
                content: slideFormData.content,
                visualPrompt: slideFormData.visualPrompt,
                voiceoverScript: slideFormData.voiceoverScript,
                example: slideFormData.example
              };
            }
            return slide;
          });
          return { ...prev, slides: updatedSlides };
        });
        
        // Also update the slide in the generatedClasses array
        setGeneratedClasses(prev => 
          prev.map(classData => {
            if (classData.classId === selectedClass.classId) {
              const updatedSlides = classData.slides.map(slide => {
                if (slide.slideId === editingSlideId) {
                  return {
                    ...slide,
                    slideTitle: slideFormData.title,
                    title: slideFormData.title, // Add title property
                    content: slideFormData.content,
                    visualPrompt: slideFormData.visualPrompt,
                    voiceoverScript: slideFormData.voiceoverScript,
                    example: slideFormData.example
                  };
                }
                return slide;
              });
              return { ...classData, slides: updatedSlides };
            }
            return classData;
          })
        );
      } else {
        // Add new slide
        const response = await courseService.addSlide(selectedClass.classId, slidePayload);
        const newSlideId = response.data?.id || `temp-${Date.now()}`;
        
        // Create a new slide with the response data
        const newSlide: SlideData = {
          slideId: newSlideId,
          id: newSlideId, // Add id property
          slideNo: selectedClass.slides.length + 1,
          slideTitle: slideFormData.title,
          title: slideFormData.title, // Add title property
          content: slideFormData.content,
          voiceoverScript: slideFormData.voiceoverScript,
          visualPrompt: slideFormData.visualPrompt,
          imageUrl: null, // Add imageUrl property
          classId: selectedClass.classId, // Add classId property
          example: slideFormData.example
        };
        
        // Add the new slide to the selected class
        setSelectedClass(prev => {
          if (!prev) return null;
          return {
            ...prev,
            slides: [...prev.slides, newSlide]
          };
        });
        
        // Also update the slide in the generatedClasses array
        setGeneratedClasses(prev => 
          prev.map(classData => 
            classData.classId === selectedClass.classId
              ? { ...classData, slides: [...classData.slides, newSlide] }
              : classData
          )
        );
        
        toast.success("New slide added successfully");
      }
      
      // Reset form data and close dialog
      setSlideFormData({
        title: "",
        content: "",
        visualPrompt: "",
        voiceoverScript: "",
        example: ""
      });
      setAddSlideDialogOpen(false);
      
    } catch (error) {
      console.error("Error handling slide:", error);
      toast.error(isEditingSlide ? "Failed to update slide" : "Failed to add slide", {
        description: "An error occurred while processing your request"
      });
    } finally {
      setIsSubmittingSlide(false);
    }
  };

  const handleCourseUpdate = () => {
    // Refetch course details
    if (courseDetails?.course && !isEditMode) {
      setCourseName(courseDetails.course.courseTitle);
    }
  };

  // Check if we should show the processing screen
  const shouldShowProcessing = !isEditMode && (progressData.status === 'processing' || 
    progressData.status === 'starting' || 
    (sessionStorage.getItem('processingActive') === 'true' && progressData.status !== 'completed'));

  // Function to save changes
  const handleSaveChanges = async () => {
    if (!selectedClass) return;
    
    setIsEditingTitleConcepts(false);
    
    // Show loading indicator
    const payload: UpdateClassPayload = {
      classTitle: editedClassTitle,
      concepts: editedConcepts
    };
    
    try {
      // Call the API to update the class
      await courseService.updateClassDetails(selectedClass.classId, payload);
      
      // Update the class title and concepts in generatedClasses
      setGeneratedClasses(prev => 
        prev.map(classData => 
          classData.classId === selectedClass.classId
            ? { ...classData, classTitle: editedClassTitle, concepts: editedConcepts }
            : classData
        )
      );
      
      // Also update selectedClass
      setSelectedClass(prev => {
        if (!prev) return null;
        return {
          ...prev,
          classTitle: editedClassTitle,
          concepts: editedConcepts
        };
      });
      
      toast.success("Class details updated successfully");
    } catch (error) {
      console.error('Error updating class:', error);
	  toast.error("Failed to update class");

      
      // Reset to original values if update failed
      if (selectedClass) {
        setEditedClassTitle(selectedClass.classTitle);
        setEditedConcepts([...selectedClass.concepts]);
      }
    }
  };

  // Function to toggle edit mode for title and concepts
  const toggleEditMode = () => {
    if (isEditingTitleConcepts) {
      // Save changes
      handleSaveChanges();
    } else {
      // Enter edit mode
      if (selectedClass) {
        setEditedClassTitle(selectedClass.classTitle);
        setEditedConcepts([...selectedClass.concepts]);
      }
    }
    
    setIsEditingTitleConcepts(!isEditingTitleConcepts);
  };
  
  // Function to cancel editing without saving changes
  const handleCancelEdit = () => {
    if (selectedClass) {
      setEditedClassTitle(selectedClass.classTitle);
      setEditedConcepts([...selectedClass.concepts]);
    }
    setIsEditingTitleConcepts(false);
    setNewConceptInput("");
  };
  
  // Function to remove a concept
  const handleRemoveConcept = (index: number) => {
    setEditedConcepts(prev => prev.filter((_, i) => i !== index));
  };
  
  // Function to handle key press in the new concept input
  const handleNewConceptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newConceptInput.trim()) {
      e.preventDefault();
      handleAddConcept();
    }
  };
  
  // Function to add a new concept
  const handleAddConcept = () => {
    if (newConceptInput.trim()) {
      setEditedConcepts(prev => [...prev, newConceptInput.trim()]);
      setNewConceptInput("");
    }
  };

  // Add new state for slide preview modal
  const [isSlidePreviewOpen, setIsSlidePreviewOpen] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<SlideData | null>(null);

  // Function to handle opening the slide preview modal
  const handlePreviewSlide = (slide: SlideData) => {
    // Make sure the slide has all the properties required by SlidePreviewModal
    const previewSlideData: SlideData = {
      ...slide,
      id: slide.id || slide.slideId, // Use id or slideId
      title: slide.title || slide.slideTitle, // Use title or slideTitle
      imageUrl: slide.imageUrl || null, // Provide default value for imageUrl
      classId: slide.classId || selectedClass?.classId || "", // Provide default value for classId
    };
    
    setPreviewSlide(previewSlideData);
    setIsSlidePreviewOpen(true);
  };

  const handlePreview = () => {
    navigate(`/course/${courseId}/preview`);
  };

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
			{/* Custom sidebar for course editing */}
			<div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-md transition-all duration-300">
				<div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
					<Link 
						to="/courses"
						className="flex items-center text-sm text-white/80 hover:text-white mb-4 transition-colors"
					>
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to courses
					</Link>
					<h1 className="text-xl font-bold truncate">
						{courseName}
					</h1>
					<p className="text-xs text-white/80 mt-1 flex items-center">
						<Sparkles className="h-3 w-3 mr-1" />
						{isEditMode ? "Edit course" : "Course being generated"}
					</p>
				</div>
				
				<div className="p-4 bg-gradient-to-b from-indigo-500/10 to-transparent">
        {courseData?.data?.courseInfo?.isPublished === false && 
            <Button 
            className="w-full mb-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
            onClick={handlePublishCourse}
            disabled={(isPublishing || generatedClasses.length === 0) && progressData.status === 'completed'}
          >
            {isPublishing ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {isPublishing ? "Publishing..." : "Publish Course"}
          </Button>
         }
					
					
					<div className="flex space-x-2 mb-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" onClick={() => handlePreview()}	disabled={generatedClasses.length === 0 && progressData.status === 'completed'} size="sm" className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
										<Eye className="h-4 w-4 mr-1" />
										Preview
									</Button>
								</TooltipTrigger>
								<TooltipContent>Preview course as student</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setIsSettingsModalOpen(true)}
                  >
										<Settings className="h-4 w-4 mr-1" />
										Settings
									</Button>
								</TooltipTrigger>
								<TooltipContent>Course settings</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
				
				<Separator />
				
				<div className="flex-1 overflow-auto p-4">
					<h2 className="text-sm font-medium mb-2 text-slate-500 dark:text-slate-400 flex items-center">
						<BookOpen className="h-4 w-4 mr-1 text-indigo-500" />
						Course Content
					</h2>
					
					{generatedClasses.length > 0 ? (
						<div className="space-y-1 animate-fade-in">
							{generatedClasses.map((classData, index) => (
								<div 
									key={index} 
									className={`text-sm py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between group transition-all duration-200 ${selectedClass?.classId === classData.classId ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300' : 'border border-transparent'}`}
									onClick={() => handleClassSelect(classData)}
                  onMouseEnter={() => setHovered(`class-${classData.classId}`)}
                  onMouseLeave={() => setHovered(null)}
								>
									<div className="flex items-center overflow-hidden">
										<div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-medium ${selectedClass?.classId === classData.classId ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200'}`}>
											{index + 1}
										</div>
										<span className="truncate">
											{classData.classTitle}
										</span>
									</div>
									{hovered === `class-${classData.classId}` && (
										<Button 
											variant="ghost" 
											size="icon" 
											className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-opacity"
										>
											<Edit className="h-3.5 w-3.5" />
										</Button>
									)}
								</div>
							))}
						</div>
					) : showMainLoader ? (
						<div className="text-center text-sm text-slate-500 mt-4">
							<div className="flex justify-center mb-3">
								<Spinner size="md" color="secondary" className="opacity-50" />
							</div>
							<p className="text-sm text-slate-400">The first class will appear here soon</p>
						</div>
					) : (
            <div className="text-center text-sm text-slate-500 mt-4 animate-fade-in">
              <GraduationCap className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">Waiting for generated classes...</p>
            </div>
          )}
				</div>
				
				{/* Loader in sidebar for upcoming class generation - Only show if not in edit mode */}
				{!isEditMode && socket && isConnected && progressData.status !== 'idle' && !showMainLoader && (
					<div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-slate-600 dark:text-slate-300">Generating next class</span>
							<Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                {progressData.progress}
              </Badge>
						</div>
						<Progress value={calculateProgress()} className="h-1.5 bg-blue-100 dark:bg-blue-900/30" />
						<p className="text-xs text-slate-400 mt-2 text-center italic">
							{progressData.message || "Processing..."}
						</p>
					</div>
				)}
        
        {/* Class generation notification badges - Only show if not in edit mode */}
        {!isEditMode && generationNotifications.length > 0 && (
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {generationNotifications.map(notification => (
              <Badge
                key={notification.id}
                className="w-full py-1.5 px-2 flex items-center justify-between bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30 animate-fade-in"
              >
                <span className="truncate text-xs">{notification.message}</span>
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-full p-0"
                  onClick={() => setGenerationNotifications(prev => 
                    prev.filter(n => n.id !== notification.id)
                  )}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
			</div>

			{/* Main content area */}
			<div className="flex-1 overflow-y-auto">
				<header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm bg-opacity-80 backdrop-blur-sm">
					<div className="flex items-center justify-between h-16 px-6">
						<h1 className="text-xl font-semibold text-slate-900 dark:text-white">
							Course Editor {isEditMode && <span className="text-indigo-500">(Edit Mode)</span>}
						</h1>
						<div className="flex items-center space-x-3">
							<Badge variant="outline" className="bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
								<div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
								Auto-saving
							</Badge>
						</div>
					</div>
				</header>

				<div className="max-w-5xl mx-auto p-6">
					{/* Show loader for first class generation, but only if not in edit mode */}
          {showMainLoader && !isEditMode ? (
						<div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/30 shadow-sm animate-fade-in">
							<div className="relative inline-flex mb-6">
								<div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
								<Spinner className="relative z-10" size="xl" />
							</div>
							<h3 className="text-xl font-medium mb-3 text-slate-700 dark:text-slate-300">Creating Your Course</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center">
								Our AI is generating comprehensive course content based on your requirements. The first class will appear shortly.
							</p>
              <div className="mt-8 flex flex-col items-center">
                <Progress value={calculateProgress()} className="h-1.5 w-64 mb-2" />
                <p className="text-xs text-slate-400">{progressData.message || "Starting generation..."}</p>
              </div>
						</div>
					) : selectedClass ? (
						<div className="animate-fade-in">
							<div className="mb-6">
								<div className="flex items-center justify-between">
                  {isEditingTitleConcepts ? (
                    <div className="flex-1 mr-2">
                      <Input 
                        value={editedClassTitle}
                        onChange={(e) => setEditedClassTitle(e.target.value)}
                        className="text-2xl font-bold py-2 px-3 border-2 border-indigo-300 focus:border-indigo-500 rounded-md bg-white/90 dark:bg-slate-800/90 shadow-sm transition-all duration-200"
                        placeholder="Enter class title"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {selectedClass.classTitle}
                    </h2>
                  )}
                  <div className="flex space-x-2">
                    {isEditingTitleConcepts ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={toggleEditMode}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={toggleEditMode}
                              className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-400 transition-all duration-200 hover:scale-105"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit title and key concepts</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
								<div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none dark:bg-indigo-900/30 dark:text-indigo-300">
                    Class {selectedClass.classNo}
                  </Badge>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {selectedClass.slides.length} slides
                  </p>
                </div>
							</div>
							
							{/* Key Concepts Section */}
							<Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mb-8 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow duration-300 group">
								<CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
									<div className="flex justify-between items-center">
										<CardTitle className="text-lg flex items-center gap-2">
											<Lightbulb className="h-5 w-5 text-amber-500" />
											Key Concepts
										</CardTitle>
									</div>
								</CardHeader>
								
								<CardContent className="p-6">
                  {isEditingTitleConcepts ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {editedConcepts.map((concept, i) => (
                          <div 
                            key={i} 
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded-full border border-blue-100 dark:border-blue-800/50 flex items-center gap-1.5 group/concept"
                          >
                            {concept}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-blue-200 dark:hover:bg-blue-800"
                              onClick={() => handleRemoveConcept(i)}
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newConceptInput}
                          onChange={(e) => setNewConceptInput(e.target.value)}
                          onKeyDown={handleNewConceptKeyDown}
                          placeholder="Add new concept"
                          className="flex-1"
                        />
                        <Button
                          type="button" 
                          onClick={handleAddConcept}
                          disabled={!newConceptInput.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedClass.concepts.map((concept, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded-full hover:shadow-sm transition-shadow border border-blue-100 dark:border-blue-800/50 hover:scale-105 transition-transform"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
								</CardContent>
							</Card>
							
							{/* Slides Section */}
							<Collapsible 
                open={openSections.slides} 
                className="mb-8"
                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, slides: open }))}
              >
                <div className="flex justify-between items-center mb-4">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Slides ({selectedClass.slides.length})
                      </h3>
                      {openSections.slides ? 
                        <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" /> : 
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <Button 
                        variant={slideView === 'grid' ? "default" : "ghost"} 
                        size="sm" 
                        className={`rounded-none px-3 ${slideView === 'grid' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-200' : ''}`}
                        onClick={() => setSlideView('grid')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={slideView === 'list' ? "default" : "ghost"} 
                        size="sm" 
                        className={`rounded-none px-3 ${slideView === 'list' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 hover:bg-indigo-200' : ''}`}
                        onClick={() => setSlideView('list')}
                      >
                        <LayoutList className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button variant="outline" size="sm" className="text-xs" onClick={openAddSlideModal}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Slide
                    </Button>
                  </div>
                </div>
                
                <CollapsibleContent className="animate-accordion-down">
                  {slideView === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {selectedClass.slides.map((slide, i) => (
                        <Card 
                          key={i} 
                          className="overflow-hidden border border-slate-200 hover:border-indigo-200 dark:border-slate-700 dark:hover:border-indigo-800 bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 cursor-pointer group"
                          onMouseEnter={() => setHovered(`slide-${i}`)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <CardHeader className="p-4 pb-2 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                            <div className="flex justify-between items-center">
                              <div className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium dark:bg-indigo-900/30 dark:text-indigo-300">
                                Slide {slide.slideNo}
                              </div>
                              
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => openEditSlideModal(slide)}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviewSlide(slide);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <h5 className="font-medium text-sm mb-2 text-slate-900 dark:text-slate-100">{slide.title}</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{slide.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 mt-2">
                      {selectedClass.slides.map((slide, i) => (
                        <div 
                          key={i} 
                          className="flex items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-sm transition-shadow cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-700/70"
                          onMouseEnter={() => setHovered(`slide-list-${i}`)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mr-3">
                            {slide.slideNo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-slate-900 dark:text-white truncate">{slide.title}</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{slide.content.substring(0, 60)}...</p>
                          </div>
                          <div className={`flex space-x-1 ${hovered === `slide-list-${i}` ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => openEditSlideModal(slide)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewSlide(slide);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
							
							{/* FAQs Section */}
							{selectedClass.faqs && selectedClass.faqs.length > 0 && (
								<Collapsible 
                  open={openSections.faqs} 
                  className="mb-8"
                  onOpenChange={(open) => setOpenSections(prev => ({ ...prev, faqs: open }))}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 mb-4 cursor-pointer group">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-teal-500" />
                        FAQs ({selectedClass.faqs.length})
                      </h3>
                      {openSections.faqs ? 
                        <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" /> : 
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="animate-accordion-down">
                    <Accordion type="single" collapsible className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {selectedClass.faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                          <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CollapsibleContent>
                </Collapsible>
							)}
							
							{/* Quiz Questions Section */}
							{selectedClass && selectedClass.quizzes && (
								<Collapsible 
                  open={openSections.quizzes} 
                  className="mb-8"
                  onOpenChange={(open) => setOpenSections(prev => ({ ...prev, quizzes: open }))}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 mb-4 cursor-pointer group">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-orange-500" />
                        Quiz Questions ({selectedClass.quizzes ? selectedClass.quizzes.length : 0})
                      </h3>
                      {openSections.quizzes ? 
                        <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" /> : 
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="animate-accordion-down">
                    <QuizManager 
                      classId={selectedClass.classId} 
                      quizzes={selectedClass.quizzes || []}
                      onQuizChange={(newQuizzes) => handleQuizChange(selectedClass.classId, newQuizzes)}
                    />
                  </CollapsibleContent>
                </Collapsible>
							)}
							
							{/* Button to add manual content */}
							
						</div>
					) : (
						<div className="flex items-center justify-center py-16 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/30">
							<div className="text-center">
								<div className="h-16 w-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
								<h3 className="text-lg font-medium mb-2 text-slate-700 dark:text-slate-300">No Class Selected</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
									Please select a class from the sidebar to view its content.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
      
      {/* Add/Edit Slide Dialog */}
      <Dialog open={addSlideDialogOpen} onOpenChange={setAddSlideDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Slide Title</Label>
              <Input 
                id="title" 
                name="title"
                value={slideFormData.title} 
                onChange={handleInputChange} 
                placeholder="Enter slide title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                name="content"
                value={slideFormData.content} 
                onChange={handleInputChange} 
                placeholder="Main content of the slide"
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visualPrompt">Visual Prompt</Label>
              <Textarea 
                id="visualPrompt" 
                name="visualPrompt"
                value={slideFormData.visualPrompt} 
                onChange={handleInputChange} 
                placeholder="Description of visuals for the slide"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="voiceoverScript">Voiceover Script</Label>
              <Textarea 
                id="voiceoverScript" 
                name="voiceoverScript"
                value={slideFormData.voiceoverScript} 
                onChange={handleInputChange} 
                placeholder="Script for audio narration"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="example">Example (optional)</Label>
              <Textarea 
                id="example" 
                name="example"
                value={slideFormData.example} 
                onChange={handleInputChange} 
                placeholder="Example that illustrates the concept"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddSlideDialogOpen(false)}
              disabled={isSubmittingSlide}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleAddSlide}
              disabled={isSubmittingSlide || !slideFormData.title || !slideFormData.content}
            >
              {isSubmittingSlide ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isEditingSlide ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditingSlide ? 'Update Slide' : 'Add Slide'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Modal */}
      {courseId && (
        <EditCourseModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          courseId={courseId}
          onCourseUpdate={handleCourseUpdate}
        />
      )}
      
      {/* Add slide preview modal */}
      {previewSlide && (
        <SlidePreviewModal
          isOpen={isSlidePreviewOpen}
          onClose={() => setIsSlidePreviewOpen(false)}
          slide={previewSlide}
        />
      )}
    </div>
  );
};

export default CourseEditor;
