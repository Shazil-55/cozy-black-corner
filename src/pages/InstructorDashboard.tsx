
import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, LayoutGrid, BarChart, GraduationCap, CalendarDays, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, InstructorDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

const InstructorDashboard = () => {
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'instructor'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Instructor),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const instructorData = dashboardData?.data as InstructorDashboardData | undefined;

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, Instructor {firstName}!
          </h2>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card className="p-6" key={i}>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-16 mt-4" />
            </Card>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card className="p-6" key={i}>
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-16 w-full rounded-md" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, Instructor {firstName}!
          </h2>
        </div>
        <Separator />
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
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, Instructor {firstName}!
        </h2>
      </div>
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">My Courses</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{instructorData?.myCourses || 0}</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Active Students</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{instructorData?.activeStudents || 0}</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Assignments</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{instructorData?.assignments || 0}</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Avg. Grade</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{instructorData?.avgGrade || 0}%</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Classes</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Introduction to React</h4>
                  <p className="text-sm text-muted-foreground">Today, 2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Join</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Advanced CSS Techniques</h4>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 11:30 AM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Join</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">JavaScript Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">Apr 10, 1:00 PM - 2:30 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Join</Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assignments to Grade</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {instructorData && instructorData.assignmentsList && instructorData.assignmentsList.length > 0 ? (
              instructorData.assignmentsList.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{assignment.assignmentName}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.totalSubmissions} submissions pending</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Grade</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No assignments to grade</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-2">
          <Link to="/courses" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Create a new course</span>
          </Link>
          <Link to="/conferences" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Schedule a conference</span>
          </Link>
          <Link to="/grading-hub" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>View grading hub</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default InstructorDashboard;

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md",
  ...props 
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  [key: string]: any;
}) => {
  return (
    <button 
      className={`
        ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 bg-white hover:bg-gray-50 dark:bg-transparent dark:border-gray-600 dark:hover:bg-gray-800"}
        ${size === "sm" ? "text-xs px-2 py-1" : size === "lg" ? "text-base px-4 py-2" : "text-sm px-3 py-1.5"}
        rounded-md font-medium transition-colors
      `}
      {...props}
    >
      {children}
    </button>
  );
};
