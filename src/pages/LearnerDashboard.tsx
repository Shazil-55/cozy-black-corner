import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Trophy, Star, Clock, BarChart, ChevronRight, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, LearnerDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { UserPlus } from "@/components/ui/icons";
import { AddParentDialog } from "@/components/users/AddParentDialog";
import { toast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

const LearnerDashboard = () => {
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || '';

  const [isAddParentOpen, setIsAddParentOpen] = useState(false);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'learner'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Learner),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const learnerData = dashboardData?.data as LearnerDashboardData | undefined;

  const handleAddParent = async (parentData) => {
    try {
      await userService.createParent(parentData);
      toast({
        title: "Success",
        description: "Parent added successfully",
        variant: "default",
      });
      setIsAddParentOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add parent",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator className="bg-indigo-100 dark:bg-indigo-800" />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="kid-stat-card animate-pulse">
              <Skeleton className="kid-icon-container h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-24 mt-2" />
              <Skeleton className="h-6 w-12 mt-2" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1">
          <Card className="kid-card p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>
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
        <Separator className="bg-indigo-100 dark:bg-indigo-800" />
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error loading dashboard data</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
          Hello, {firstName}! 👋
        </h2>
        <Button 
          onClick={() => setIsAddParentOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </div>

      <AddParentDialog
        isOpen={isAddParentOpen}
        onClose={() => setIsAddParentOpen(false)}
        onSubmit={handleAddParent}
        isLoading={false}
        learners={user ? [{ 
          id: user.id,
          name: user.name,
          email: user.email,
          role: "Learner",
          status: "Active",
          registrationDate: user.createdAt || new Date().toISOString(),
        }] : []}
        currentLearnerId={user?.id}
        isLearnerDashboard={true}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<BookOpen className="h-6 w-6" />} 
          title="Active Courses" 
          value={learnerData?.activeCourses.toString() || "0"} 
          color="from-blue-400 to-indigo-500"
        />
        <StatCard 
          icon={<Trophy className="h-6 w-6" />} 
          title="Completed" 
          value={learnerData?.completedCourses.toString() || "0"} 
          color="from-green-400 to-emerald-500"
        />
        <StatCard 
          icon={<Award className="h-6 w-6" />} 
          title="Certificates" 
          value={learnerData?.certificates.toString() || "0"} 
          color="from-yellow-400 to-orange-500"
        />
        <StatCard 
          icon={<BarChart className="h-6 w-6" />} 
          title="Avg. Grade" 
          value={`${learnerData?.avgGrade || 0}%`} 
          color="from-pink-400 to-purple-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card className="kid-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Your Learning Journey</h3>
            <Link to="/my-courses" className="kid-button bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-8">
            {learnerData && learnerData.coursesInProgress && learnerData.coursesInProgress.length > 0 ? (
              learnerData.coursesInProgress.map((course, index) => (
                <div key={index} className="space-y-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300">{course.courseName}</h4>
                    <span className="text-sm font-bold px-3 py-1 bg-white dark:bg-indigo-800 rounded-full shadow-sm text-indigo-600 dark:text-indigo-300">{course.completedPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-indigo-600 dark:text-indigo-400">
                    <span>Teacher: {course.instructorName}</span>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{course.totalHoursLeft} hours left</span>
                    </div>
                  </div>
                  <div className="kid-progress">
                    <div className="kid-progress-bar" style={{ width: `${course.completedPercentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-indigo-600 dark:text-indigo-300">You're not enrolled in any courses yet.</p>
                <Link to="/courses" className="kid-button inline-block mt-4 bg-gradient-to-r from-indigo-500 to-purple-500">
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="kid-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">To-Do List</h3>
            <div className="bg-indigo-100 dark:bg-indigo-800 p-1 rounded-full">
              <ChevronRight className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </div>
          </div>
          
          <div className="space-y-4">
            {learnerData && learnerData.assignmentDeadlines && learnerData.assignmentDeadlines.length > 0 ? (
              learnerData.assignmentDeadlines.map((task, index) => {
                const submissionDate = new Date(task.submissionDate);
                const isToday = new Date().toDateString() === submissionDate.toDateString();
                const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === submissionDate.toDateString();
                
                let dateDisplay;
                if (isToday) {
                  dateDisplay = "Due today";
                } else if (isTomorrow) {
                  dateDisplay = "Due tomorrow";
                } else {
                  dateDisplay = `Due ${format(submissionDate, 'MMM d')}`;
                }
                
                const isUrgent = isToday || isTomorrow;
                
                return (
                  <TaskCard 
                    key={index}
                    icon={<Clock className="h-5 w-5" />} 
                    title={task.assignmentName} 
                    dueDate={dateDisplay} 
                    status={task.isSubmitted ? "Submitted" : isUrgent ? "Urgent" : "Start"} 
                    color={task.isSubmitted ? "bg-gradient-to-r from-green-400 to-emerald-500" : isUrgent ? "bg-gradient-to-r from-orange-400 to-pink-500" : "bg-gradient-to-r from-blue-400 to-indigo-500"}
                    isButton={!task.isSubmitted}
                  />
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-indigo-600 dark:text-indigo-300">No assignments due soon!</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="kid-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Cool New Courses</h3>
            <Link to="/course-catalog" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              See more <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {learnerData && learnerData.recommendedCourses && learnerData.recommendedCourses.length > 0 ? (
              learnerData.recommendedCourses.map((course, index) => (
                <CourseCard 
                  key={index}
                  icon={<BookOpen className="h-5 w-5" />} 
                  title={course.courseName} 
                  rating={course.ratings} 
                  reviews={course.reviews} 
                  color="bg-gradient-to-r from-blue-400 to-indigo-500"
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-indigo-600 dark:text-indigo-300">No recommended courses available.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearnerDashboard;

const StatCard = ({ icon, title, value, color }) => (
  <div className="kid-stat-card animate-float">
    <div className={`kid-icon-container bg-gradient-to-r ${color}`}>
      {React.cloneElement(icon, { className: cn(icon.props.className, "text-white") })}
    </div>
    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">{title}</h3>
    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{value}</p>
  </div>
);

const TaskCard = ({ icon, title, dueDate, status, color, isButton = false }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border-2 border-indigo-50 dark:border-indigo-900 transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} text-white`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-indigo-800 dark:text-indigo-300">{title}</h4>
        <p className="text-sm text-indigo-600 dark:text-indigo-400">{dueDate}</p>
      </div>
    </div>
    {isButton ? (
      <button className="kid-button bg-gradient-to-r from-blue-400 to-indigo-500">
        {status}
      </button>
    ) : (
      <span className={cn(
        "px-3 py-1 font-medium rounded-full",
        status === "Submitted" 
          ? "bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-300" 
          : "bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-300"
      )}>
        {status}
      </span>
    )}
  </div>
);

const CourseCard = ({ icon, title, rating, reviews, color }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border-2 border-indigo-50 dark:border-indigo-900 transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} text-white`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-indigo-800 dark:text-indigo-300">{title}</h4>
        <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
          <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
          <span>{rating} ({reviews} reviews)</span>
        </div>
      </div>
    </div>
    <button className="kid-button bg-gradient-to-r from-indigo-400 to-purple-500">
      Enroll
    </button>
  </div>
);
