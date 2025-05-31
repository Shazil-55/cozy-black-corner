
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Zap, X, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Assignment } from "./AssignmentsTab";
import { courseService } from "@/services/courseService";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ClassOption } from "./AssignmentsTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Create the schema based on the provided schema
const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  totalMarks: z.coerce.number().min(1, "Total marks are required").max(100, "Total marks cannot exceed 100"),
  published: z.boolean().optional(),
});

// Question types
type QuestionType = 'brief' | 'multiple-choice' | 'fill-blank';

// Question interface
interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Only for multiple choice
  correctAnswer?: number; // Only for multiple choice (index)
  correctText?: string; // Only for fill in the blank
}

// Type for API responses
interface CourseFileUploadResponse {
  data: {
    name: string;
    size: number;
    url: string;
  };
}

interface ManualQuestionsProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

const ManualQuestions: React.FC<ManualQuestionsProps> = ({ questions, onQuestionsChange }) => {
  const addQuestion = () => {
    if (questions.length >= 10) {
      toast.error("You can only add up to 10 questions");
      return;
    }

    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'brief',
      question: "",
    };

    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    onQuestionsChange(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    onQuestionsChange(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionType = (questionId: string, type: QuestionType) => {
    onQuestionsChange(questions.map(q => {
      if (q.id === questionId) {
        const baseQuestion = { ...q, type };
        
        // Reset type-specific fields based on new type
        if (type === 'multiple-choice') {
          return {
            ...baseQuestion,
            options: ["", "", "", ""],
            correctAnswer: 0,
            correctText: undefined
          };
        } else if (type === 'fill-blank') {
          return {
            ...baseQuestion,
            correctText: "",
            options: undefined,
            correctAnswer: undefined
          };
        } else { // brief
          return {
            ...baseQuestion,
            options: undefined,
            correctAnswer: undefined,
            correctText: undefined
          };
        }
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    onQuestionsChange(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const renderQuestionInputs = (question: Question, questionIndex: number) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="space-y-1">
                  <FormLabel className="text-xs">Option {optionIndex + 1}</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                    />
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                        className="h-4 w-4 text-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Correct answer: Option {(question.correctAnswer || 0) + 1}
            </div>
          </>
        );
      
      case 'fill-blank':
        return (
          <div className="space-y-2">
            <FormLabel className="text-xs">Correct Answer</FormLabel>
            <Input
              placeholder="Enter the correct answer for the blank"
              value={question.correctText || ""}
              onChange={(e) => updateQuestion(question.id, 'correctText', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Students will need to fill in the blank with this answer
            </p>
          </div>
        );
      
      case 'brief':
      default:
        return (
          <div className="text-xs text-muted-foreground py-2">
            This is a brief question. Students will provide a written answer.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Manual Questions</h3>
          <p className="text-sm text-muted-foreground">
            Add up to 10 questions manually ({questions.length}/10)
          </p>
        </div>
        <Button 
          type="button" 
          onClick={addQuestion} 
          disabled={questions.length >= 10}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No questions added yet. Click "Add Question" to get started.</p>
        </div>
      )}

      {questions.map((question, questionIndex) => (
        <div key={question.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Question {questionIndex + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(question.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Question Type</FormLabel>
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) => updateQuestionType(question.id, value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief Question</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormLabel>Question</FormLabel>
              <Textarea
                placeholder="Enter your question here..."
                value={question.question}
                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                className="mt-1"
              />
            </div>

            {renderQuestionInputs(question, questionIndex)}
          </div>
        </div>
      ))}
    </div>
  );
};

interface AIGenerationProps {
  onClassIdsChange: (classIds: string[]) => void;
  classes: ClassOption[];
}

const AIGeneration: React.FC<AIGenerationProps> = ({ onClassIdsChange, classes }) => {
  const [selectedClasses, setSelectedClasses] = useState<ClassOption[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if (classes.length) {
      setSelectedClasses(classes);
    }
  }, [classes]);

  const handleSelect = (classItem: ClassOption) => {
    setSelectedClasses(current => {
      // Check if already selected
      if (current.some(item => item.id === classItem.id)) {
        const newSelection = current.filter(item => item.id !== classItem.id);
        onClassIdsChange(newSelection.map(item => item.id));
        return newSelection;
      } 
      // Check if already has 3 items
      if (current.length >= 3) {
        toast.error("You can only select up to 3 classes");
        return current;
      }
      const newSelection = [...current, classItem];
      onClassIdsChange(newSelection.map(item => item.id));
      return newSelection;
    });
  };

  const removeItem = (classId: string) => {
    setSelectedClasses(current => {
      const newSelection = current.filter(item => item.id !== classId);
      onClassIdsChange(newSelection.map(item => item.id));
      return newSelection;
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">AI-Generated Assignment</h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Select up to 3 classes to generate an assignment based on their content.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium">Select Classes (max 3)</FormLabel>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedClasses.map(item => (
            <Badge key={item.id} variant="secondary" className="py-1 pl-2 pr-1 flex items-center gap-1">
              {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 rounded-full"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        
        <Popover open={commandOpen} onOpenChange={setCommandOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              className="w-full justify-between font-normal"
            >
              {selectedClasses.length > 0 
                ? `${selectedClasses.length} class${selectedClasses.length > 1 ? 'es' : ''} selected`
                : "Select classes..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search classes..." />
              <CommandEmpty>No classes found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {classes && classes.length > 0 ? (
                  classes.map(classItem => (
                    <CommandItem
                      key={classItem.id}
                      value={classItem.title}
                      onSelect={() => {
                        handleSelect(classItem);
                        setCommandOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "mr-2", 
                        selectedClasses.some(item => item.id === classItem.id) ? "opacity-100" : "opacity-0"
                      )}>
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="flex-1 truncate">
                        {classItem.title}
                      </span>
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">No classes available</div>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {selectedClasses.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Please select at least one class for AI generation
          </p>
        )}
      </div>
    </div>
  );
};

interface AddAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onAssignmentAdded: () => Promise<void>;
  assignment?: Assignment | null;
  classes?: ClassOption[];
}

export const AddAssignmentDialog: React.FC<AddAssignmentDialogProps> = ({
  isOpen,
  onClose,
  courseId,
  onAssignmentAdded,
  assignment,
  classes = []
}) => {
  const isEditMode = !!assignment;
  const [activeTab, setActiveTab] = useState<string>(assignment?.isAiGenerated ? "ai" : "manual");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classIds, setClassIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values or values from existing assignment
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title || "",
      description: assignment?.description || "",
      dueDate: assignment?.dueDate ? new Date(assignment.dueDate) : undefined,
      totalMarks: assignment?.totalMarks || 10,
      published: assignment?.published || false,
    },
  });

  useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate),
        totalMarks: assignment.totalMarks || 10,
        published: assignment.published || false,
      });
      
      setActiveTab(assignment.isAiGenerated ? "ai" : "manual");
      
      if (assignment.classNumbers?.length) {
        setClassIds(assignment.classNumbers);
      }

      // TODO: If editing, load existing questions from assignment
      // This would require backend API changes to store questions
      setQuestions([]);
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: undefined,
        totalMarks: 10,
        published: false,
      });
      setActiveTab("manual");
      setClassIds([]);
      setQuestions([]);
    }
  }, [assignment, form]);

  const handleSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    try {
      // For manual assignments, questions are required
      if (activeTab === "manual" && questions.length === 0) {
        toast.error("Please add at least one question");
        setIsSubmitting(false);
        return;
      }

      // Validate questions for manual assignments
      if (activeTab === "manual") {
        const invalidQuestions = questions.filter(q => {
          if (!q.question.trim()) return true;
          
          if (q.type === 'multiple-choice') {
            return !q.options || q.options.some(opt => !opt.trim()) || q.correctAnswer === undefined;
          }
          
          if (q.type === 'fill-blank') {
            return !q.correctText || !q.correctText.trim();
          }
          
          return false; // Brief questions only need the question text
        });
        
        if (invalidQuestions.length > 0) {
          toast.error("Please complete all question fields");
          setIsSubmitting(false);
          return;
        }
      }

      // For AI generation, class IDs are required
      if (activeTab === "ai" && classIds.length === 0) {
        toast.error("Please select at least one class for AI generation");
        setIsSubmitting(false);
        return;
      }

      // Prepare assignment data
      const assignmentData = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate.toISOString(),
        questions: activeTab === "manual" ? questions : undefined,
        classNumbers: activeTab === "ai" ? classIds : undefined,
        isAiGenerated: activeTab === "ai",
        published: values.published,
        totalMarks: values.totalMarks,
      };

      // Create or update the assignment
      if (isEditMode && assignment) {
        await courseService.updateAssignment(assignment.id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        await courseService.createAssignment(courseId, assignmentData);
        toast.success(
          activeTab === "manual" 
            ? "Assignment created successfully" 
            : "AI is generating your assignment",
          {
            description: activeTab === "manual" 
              ? "Students can now access this assignment" 
              : "You will be notified when the generation is complete"
          }
        );
      }

      await onAssignmentAdded();
      onClose();
      form.reset();
      setQuestions([]);
      setClassIds([]);
    } catch (error) {
      toast.error(isEditMode ? "Failed to update assignment" : "Failed to create assignment", {
        description: "An error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update assignment details" : "Create a new assignment for your students"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter assignment description" 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter total marks" 
                        min={1} 
                        max={100} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={isEditMode ? undefined : setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" disabled={isEditMode}>Manual Questions</TabsTrigger>
                <TabsTrigger value="ai" disabled={isEditMode}>AI Generated</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-4">
                <ManualQuestions 
                  questions={questions}
                  onQuestionsChange={setQuestions}
                />
              </TabsContent>
              <TabsContent value="ai" className="mt-4">
                <AIGeneration 
                  onClassIdsChange={setClassIds}
                  classes={classes}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Assignment" : "Create Assignment")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
