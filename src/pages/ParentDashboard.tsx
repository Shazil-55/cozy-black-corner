
import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, Star, Clock, ChevronRight, Award, BarChart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, ParentDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const ParentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'parent'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Parent),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const parentData = dashboardData?.data as ParentDashboardData | undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
          Welcome back, {firstName}! 👋
        </h2>
      </div>
      <Separator className="bg-purple-100 dark:bg-purple-800" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<Users className="h-6 w-6" />} 
          title="Active Children" 
          value={parentData?.activeChildren.toString() || "0"} 
          color="from-blue-400 to-indigo-500"
        />
        <StatCard 
          icon={<BookOpen className="h-6 w-6" />} 
          title="Total Courses" 
          value={parentData?.totalCourses.toString() || "0"} 
          color="from-green-400 to-emerald-500"
        />
        <StatCard 
          icon={<Award className="h-6 w-6" />} 
          title="Children" 
          value={parentData?.children.toString() || "0"} 
          color="from-yellow-400 to-orange-500"
        />
        <StatCard 
          icon={<BarChart className="h-6 w-6" />} 
          title="Avg. Grade" 
          value={`${parentData?.avgGrade || 0}%`} 
          color="from-pink-400 to-purple-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Children's Progress</h3>
            <Link to="/my-children" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {parentData?.childrenProgress.map((child, index) => (
              <div key={index} className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">{child.childName}</h4>
                  <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-700 dark:text-purple-200">
                    {child.overallProgress}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-purple-600 dark:text-purple-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Active: {child.coursesInProgress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Completed: {child.completedCourses}</span>
                  </div>
                </div>
                <Progress value={child.overallProgress} className="bg-purple-100 dark:bg-purple-800" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Upcoming Assignments</h3>
          </div>
          
          <div className="space-y-4">
            {parentData?.upcomingAssignments.map((assignment, index) => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-300">Student: {assignment.childName}</p>
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
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <Card className="p-6 transition-all hover:shadow-lg">
    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
      {React.cloneElement(icon, { className: "text-white" })}
    </div>
    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">{title}</h3>
    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{value}</p>
  </Card>
);

export default ParentDashboard;
