
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X, Book, Star, Award, Clock, Calendar, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dummy assignments data
const dummyAssignments = [
  {
    id: "a1",
    name: "Midterm Examination",
    type: "Exam",
    grade: 94,
    dueDate: "May 15, 2023",
    submitted: true,
    feedback: "Excellent work! Your analysis showed deep understanding."
  },
  {
    id: "a2",
    name: "Research Paper: Topic Analysis",
    type: "Assignment",
    grade: 88,
    dueDate: "April 30, 2023",
    submitted: true,
    feedback: "Good research, but could improve on citations."
  },
  {
    id: "a3",
    name: "Weekly Quiz #8",
    type: "Quiz",
    grade: 85,
    dueDate: "May 5, 2023",
    submitted: true,
    feedback: "Solid understanding of core concepts."
  },
  {
    id: "a4",
    name: "Final Project Proposal",
    type: "Assignment",
    grade: null,
    dueDate: "June 28, 2023",
    submitted: false,
    feedback: null
  }
];

interface CourseModalProps {
  course: {
    id: string;
    name: string;
    instructor: string;
    progress: number;
    category: string;
    avgAssignmentGrade: number;
    avgQuizGrade: number;
    lastAccessed: string;
  };
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export const CourseModal = ({ course, isOpen, onClose, studentName }: CourseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{course.name}</span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Student: {studentName}</span>
            <span>•</span>
            <span>Instructor: {course.instructor}</span>
            <span>•</span>
            <Badge variant="outline">{course.category}</Badge>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Performance overview */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Course Progress
                </h3>
                
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2.5 mb-4" />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                      <Star className="h-4 w-4" />
                      <span>Assignment Grades</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {course.avgAssignmentGrade}%
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Award className="h-4 w-4" />
                      <span>Quiz Grades</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {course.avgQuizGrade}%
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex gap-1.5 items-center">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last accessed {course.lastAccessed}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Performance Trends</span>
                </h3>
                
                <div className="h-40 flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Performance chart visualization would appear here<br />
                  (Showing improvement over time)</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Assignments & Tasks */}
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Book className="h-4 w-4" />
                Recent Assessments
              </h3>
              
              <div className="space-y-3">
                {dummyAssignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm border-l-4"
                    style={{ 
                      borderLeftColor: assignment.submitted 
                        ? (assignment.grade >= 90 ? '#10B981' : assignment.grade >= 80 ? '#3B82F6' : '#F59E0B') 
                        : '#6B7280' 
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{assignment.name}</h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-3">
                          <span className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs py-0">
                              {assignment.type}
                            </Badge>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {assignment.dueDate}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        {assignment.submitted ? (
                          <Badge className={
                            assignment.grade >= 90 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                              : assignment.grade >= 80
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                          }>
                            {assignment.grade}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {assignment.feedback && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                        <span className="font-medium">Feedback: </span>
                        {assignment.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
                  Resources
                </h3>
                
                <div className="space-y-2 text-sm">
                  <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    Course Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-gray-300">
                    <Book className="h-4 w-4 mr-2" />
                    Study Materials
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-gray-300">
                    <BarChart className="h-4 w-4 mr-2" />
                    Full Progress Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-gray-800">
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
