
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from 'sonner';
import { QuizQuestionWithOptions, AddQuizPayload, UpdateQuizPayload, courseService } from '@/services/courseService';

interface QuizManagerProps {
  classId: string;
  quizzes: QuizQuestionWithOptions[];
  onQuizChange: (quizzes: QuizQuestionWithOptions[]) => void;
}

const QuizManager: React.FC<QuizManagerProps> = ({ classId, quizzes, onQuizChange }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedQuiz, setSelectedQuiz] = useState<QuizQuestionWithOptions | null>(null);
  
  const [formData, setFormData] = useState<AddQuizPayload>({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "a"
  });

  const resetForm = () => {
    setFormData({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "a"
    });
    setSelectedQuiz(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCorrectOptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      correctOption: value
    }));
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (quiz: QuizQuestionWithOptions) => {
    setSelectedQuiz(quiz);
    setFormData({
      question: quiz.question,
      option1: quiz.option1,
      option2: quiz.option2,
      option3: quiz.option3,
      option4: quiz.option4,
      correctOption: quiz.correctOption
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (quiz: QuizQuestionWithOptions) => {
    setSelectedQuiz(quiz);
    setIsDeleteDialogOpen(true);
  };

  const handleAddQuiz = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await courseService.addQuizQuestion(classId, formData);
      
      // Create a new quiz object with the response data
      const newQuiz: QuizQuestionWithOptions = {
        id: response.data?.id || `temp-${Date.now()}`,
        question: formData.question,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        correctOption: formData.correctOption,
        classId: classId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update the quizzes array
      const updatedQuizzes = [...quizzes, newQuiz];
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question added successfully");
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding quiz question:", error);
      toast.error("Failed to add quiz question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!selectedQuiz || !validateForm()) return;
    
    setIsLoading(true);
    try {
      const updateData: UpdateQuizPayload = {
        question: formData.question,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        correctOption: formData.correctOption
      };
      
      await courseService.updateQuizQuestion(String(selectedQuiz.id), updateData);
      
      // Update the quizzes array
      const updatedQuizzes = quizzes.map(quiz => 
        quiz.id === selectedQuiz.id 
          ? { ...quiz, ...formData }
          : quiz
      );
      
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question updated successfully");
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating quiz question:", error);
      toast.error("Failed to update quiz question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;
    
    setIsLoading(true);
    try {
      await courseService.deleteQuizQuestion(String(selectedQuiz.id));
      
      // Update the quizzes array
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== selectedQuiz.id);
      onQuizChange(updatedQuizzes);
      
      toast.success("Quiz question deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      toast.error("Failed to delete quiz question");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      toast.error("Question is required");
      return false;
    }
    if (!formData.option1.trim() || !formData.option2.trim() || 
        !formData.option3.trim() || !formData.option4.trim()) {
      toast.error("All options are required");
      return false;
    }
    return true;
  };

  return (
    <div>
      {/* Add Quiz Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea 
                id="question" 
                name="question"
                value={formData.question} 
                onChange={handleInputChange} 
                placeholder="Enter quiz question"
                className="min-h-[80px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="option1">Option A</Label>
              <Input 
                id="option1" 
                name="option1"
                value={formData.option1} 
                onChange={handleInputChange} 
                placeholder="Enter option A"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="option2">Option B</Label>
              <Input 
                id="option2" 
                name="option2"
                value={formData.option2} 
                onChange={handleInputChange} 
                placeholder="Enter option B"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="option3">Option C</Label>
              <Input 
                id="option3" 
                name="option3"
                value={formData.option3} 
                onChange={handleInputChange} 
                placeholder="Enter option C"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="option4">Option D</Label>
              <Input 
                id="option4" 
                name="option4"
                value={formData.option4} 
                onChange={handleInputChange} 
                placeholder="Enter option D"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="correctOption">Correct Option</Label>
              <Select 
                value={formData.correctOption} 
                onValueChange={handleCorrectOptionChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the correct option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">A</SelectItem>
                  <SelectItem value="b">B</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="d">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleAddQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : "Add Quiz Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Question</Label>
              <Textarea 
                id="edit-question" 
                name="question"
                value={formData.question} 
                onChange={handleInputChange} 
                placeholder="Enter quiz question"
                className="min-h-[80px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-option1">Option A</Label>
              <Input 
                id="edit-option1" 
                name="option1"
                value={formData.option1} 
                onChange={handleInputChange} 
                placeholder="Enter option A"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-option2">Option B</Label>
              <Input 
                id="edit-option2" 
                name="option2"
                value={formData.option2} 
                onChange={handleInputChange} 
                placeholder="Enter option B"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-option3">Option C</Label>
              <Input 
                id="edit-option3" 
                name="option3"
                value={formData.option3} 
                onChange={handleInputChange} 
                placeholder="Enter option C"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-option4">Option D</Label>
              <Input 
                id="edit-option4" 
                name="option4"
                value={formData.option4} 
                onChange={handleInputChange} 
                placeholder="Enter option D"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-correctOption">Correct Option</Label>
              <Select 
                value={formData.correctOption} 
                onValueChange={handleCorrectOptionChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the correct option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">A</SelectItem>
                  <SelectItem value="b">B</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="d">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleUpdateQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : "Update Quiz Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Quiz Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Quiz Question</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this quiz question? This action cannot be undone.
            </p>
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-sm font-medium">{selectedQuiz?.question}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : "Delete Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Manager UI */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={openAddDialog}
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 bg-white dark:bg-slate-800"
        >
          <span className="text-lg font-bold">+</span> Add Quiz Question
        </Button>
      </div>

      <div className="space-y-3">
        {quizzes.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-800/50">
            No quiz questions available for this class. Click the button above to add one.
          </p>
        ) : (
          quizzes.map((quiz, index) => (
            <div 
              key={quiz.id}
              className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium dark:bg-orange-900/30 dark:text-orange-300">
                    Q{index + 1}
                  </div>
                  <h5 className="font-medium text-sm">{quiz.question}</h5>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => openEditDialog(quiz)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => openDeleteDialog(quiz)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center space-x-2 p-2 rounded-md ${quiz.correctOption === "a" ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30" : "bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700"}`}>
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-medium">A</div>
                  <span className="truncate">{quiz.option1}</span>
                </div>
                <div className={`flex items-center space-x-2 p-2 rounded-md ${quiz.correctOption === "b" ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30" : "bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700"}`}>
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-medium">B</div>
                  <span className="truncate">{quiz.option2}</span>
                </div>
                <div className={`flex items-center space-x-2 p-2 rounded-md ${quiz.correctOption === "c" ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30" : "bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700"}`}>
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-medium">C</div>
                  <span className="truncate">{quiz.option3}</span>
                </div>
                <div className={`flex items-center space-x-2 p-2 rounded-md ${quiz.correctOption === "d" ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30" : "bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700"}`}>
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-medium">D</div>
                  <span className="truncate">{quiz.option4}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizManager;
