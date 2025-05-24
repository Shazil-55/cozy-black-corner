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
import { CalendarIcon, Upload, Zap, X, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Assignment } from "./AssignmentsTab";
import { courseService } from "@/services/courseService";
import { uploadFile } from "@/services/api";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ClassOption } from "./AssignmentsTab";

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

// Type for API responses
interface CourseFileUploadResponse {
  data: {
    name: string;
    size: number;
    url: string;
  };
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  initialFileUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, initialFileUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (initialFileUrl) {
      const filename = initialFileUrl.split('/').pop() || 'Current file';
      setFileName(filename);
    }
  }, [initialFileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm font-semibold">
          {initialFileUrl ? 'Replace current file' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or TXT (max 10MB)</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.txt"
        />
      </div>
      
      {fileName && (
        <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
          <span className="text-sm truncate">{fileName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setFileName(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Remove
          </Button>
        </div>
      )}
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [classIds, setClassIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileChanged, setFileChanged] = useState(false);
  
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
      setSelectedFile(null);
      setFileChanged(false);
    }
  }, [assignment, form]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFileChanged(true);
  };

  const handleSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    try {
      // For manual assignments, file is required for new assignments
      if (activeTab === "manual" && !isEditMode && !selectedFile) {
        toast.error("Please upload an assignment file");
        setIsSubmitting(false);
        return;
      }

      // For AI generation, class IDs are required
      if (activeTab === "ai" && classIds.length === 0) {
        toast.error("Please select at least one class for AI generation");
        setIsSubmitting(false);
        return;
      }

      // Upload file for manual assignments if it's changed or new
      let fileUrl = assignment?.fileUrl || '';
      if (activeTab === "manual" && selectedFile && (fileChanged || !isEditMode)) {
        const uploadResponse = await uploadFile(selectedFile);
        fileUrl = uploadResponse.data.url;
      }

      // Prepare assignment data
      const assignmentData = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate.toISOString(),
        fileUrl: activeTab === "manual" ? fileUrl : '',
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
            ? "Assignment uploaded successfully" 
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
      setSelectedFile(null);
      setClassIds([]);
      setFileChanged(false);
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
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
                <TabsTrigger value="manual" disabled={isEditMode}>Manual Upload</TabsTrigger>
                <TabsTrigger value="ai" disabled={isEditMode}>AI Generated</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-4">
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  initialFileUrl={assignment?.fileUrl}
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
