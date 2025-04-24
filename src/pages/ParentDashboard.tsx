
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, ChevronRight, Award, BarChart, User, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, ParentDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || '';
  const [selectedChildId, setSelectedChildId] = useState(null);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'parent'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Parent),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const parentData = dashboardData?.data as ParentDashboardData | undefined;
  
  // State for the course details modal
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  // Mock course data for each child
  const childrenCourses = {
    child1: [
      { id: 1, name: "Mathematics 101", progress: 75, assignmentGrade: 82, quizGrade: 78 },
      { id: 2, name: "Introduction to Science", progress: 60, assignmentGrade: 88, quizGrade: 92 },
      { id: 3, name: "English Literature", progress: 45, assignmentGrade: 76, quizGrade: 81 }
    ],
    child2: [
      { id: 4, name: "History", progress: 90, assignmentGrade: 95, quizGrade: 88 },
      { id: 5, name: "Geography", progress: 50, assignmentGrade: 72, quizGrade: 69 }
    ]
  };

  // Handle selecting a child to view their details
  const handleViewChild = (childId) => {
    setSelectedChildId(childId);
  };

  // Handle opening the course modal
  const handleOpenCourseModal = (course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        <div className="grid gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
            Hello, {firstName}! 👋
          </h2>
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error loading dashboard data</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
    );
  }

  // If a child is selected, show their detailed view
  if (selectedChildId) {
    const childData = parentData?.childrenProgress.find(child => 
      child.childName === `Child ${selectedChildId.replace('child', '')}`
    );
    const childCourses = childrenCourses[selectedChildId] || [];
    
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedChildId(null)}
              className="flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>Back</span>
            </Button>
            <h2 className="text-2xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
              {childData?.childName}'s Dashboard
            </h2>
          </div>
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        
        {/* Child overview stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-none shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="mt-2 font-bold text-lg text-blue-800 dark:text-blue-300">Courses</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{childCourses.length}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30 border-none shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="mt-2 font-bold text-lg text-purple-800 dark:text-purple-300">Overall Progress</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{childData?.overallProgress}%</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-none shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                <BarChart className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="mt-2 font-bold text-lg text-emerald-800 dark:text-emerald-300">Average Grade</h3>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {childCourses.reduce((sum, course) => sum + (course.assignmentGrade + course.quizGrade)/2, 0) / childCourses.length}%
              </p>
            </div>
          </Card>
        </div>
        
        {/* Courses list */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-purple-100 dark:bg-purple-900 p-4">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Enrolled Courses</h3>
          </div>
          <div className="p-4">
            {childCourses.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No courses enrolled yet</p>
            ) : (
              <div className="space-y-4">
                {childCourses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="p-4 transition-all hover:shadow-md cursor-pointer"
                    onClick={() => handleOpenCourseModal(course)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{course.name}</h4>
                          <div className="flex items-center mt-1">
                            <div className="w-36 mr-2">
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{course.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {/* Upcoming assignments */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-amber-100 dark:bg-amber-900 p-4">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">Upcoming Assignments</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {parentData?.upcomingAssignments
                .filter(assignment => assignment.childName === childData?.childName)
                .map((assignment, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    assignment.completed
                      ? "border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-900/30"
                      : "border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/30"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{assignment.assignmentName}</h4>
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-sm rounded-full",
                      assignment.completed
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    )}>
                      {assignment.completed ? "Completed" : format(new Date(assignment.dueDate), "MMM d")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Course Details Modal */}
        <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedCourse?.name}</DialogTitle>
              <DialogDescription>
                Course performance details
              </DialogDescription>
            </DialogHeader>
            
            {selectedCourse && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/30">
                    <h4 className="text-center text-sm font-medium text-blue-800 dark:text-blue-300">Assignment Grade</h4>
                    <p className="text-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedCourse.assignmentGrade}%
                    </p>
                  </Card>
                  
                  <Card className="p-4 bg-purple-50 dark:bg-purple-900/30">
                    <h4 className="text-center text-sm font-medium text-purple-800 dark:text-purple-300">Quiz Grade</h4>
                    <p className="text-center text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedCourse.quizGrade}%
                    </p>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h4 className="text-sm font-medium mb-2">Course Completion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{selectedCourse.progress}%</span>
                    </div>
                    <Progress value={selectedCourse.progress} className="h-2" />
                  </div>
                </Card>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                      {Math.floor(Math.random() * 10) + 1} assignments completed
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30">
                      {Math.floor(Math.random() * 5) + 1} quizzes taken
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30">
                      {Math.floor(Math.random() * 20) + 5} hours spent
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main dashboard view with list of children
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
          Welcome, {firstName}! 👋
        </h2>
      </div>
      <Separator className="bg-purple-100 dark:bg-purple-800" />
      
      {/* Children list */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-6">
          <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300">Your Children</h3>
          <p className="text-purple-600 dark:text-purple-400 mt-1">Select a child to view their academic progress</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {parentData?.childrenProgress.map((child, index) => (
              <Card 
                key={index} 
                className="p-4 hover:shadow-md transition-all cursor-pointer border border-purple-100 dark:border-purple-900"
                onClick={() => handleViewChild(`child${index+1}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-purple-200 dark:border-purple-800">
                      <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${child.childName}`} />
                      <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {child.childName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{child.childName}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 text-purple-500" />
                          <span>{child.coursesInProgress} courses in progress</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{child.completedCourses} completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">Overall Progress</div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 text-sm font-medium text-purple-700 dark:text-purple-400">
                          {child.overallProgress}%
                        </span>
                        <Progress value={child.overallProgress} className="w-24 h-2" />
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Upcoming assignments overview */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 p-6">
          <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300">Upcoming Assignments</h3>
          <p className="text-amber-600 dark:text-amber-400 mt-1">Keep track of your children's assignments</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {parentData?.upcomingAssignments.slice(0, 3).map((assignment, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  assignment.completed
                    ? "border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-900/30"
                    : "border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/30"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{assignment.assignmentName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Student: {assignment.childName}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    assignment.completed
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  )}>
                    {assignment.completed ? "Completed" : format(new Date(assignment.dueDate), "MMM d")}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Button 
                variant="ghost" 
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                onClick={() => navigate('/assignments')}
              >
                View all assignments
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ParentDashboard;
