
import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Users, LayoutGrid, BookText, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, AdminDashboardData } from "@/types/dashboard";
import { useRole } from "@/context/RoleContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { role } = useRole();
  
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'administrator'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Administrator),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const adminData = dashboardData?.data as AdminDashboardData | undefined;

  // User data for pie chart
  const userData = adminData ? [
    { name: "Admins", value: adminData.adminUsers, color: "#1B68B3" },
    { name: "Instructors", value: adminData.instructorUsers, color: "#4DA1FF" },
    { name: "Learners", value: adminData.learners, color: "#0A2D50" },
  ] : [
    { name: "Admins", value: 0, color: "#1B68B3" },
    { name: "Instructors", value: 0, color: "#4DA1FF" },
    { name: "Learners", value: 0, color: "#0A2D50" },
  ];

  const COLORS = ["#1B68B3", "#4DA1FF", "#0A2D50"];
  
  // Calculate the total number of users
  const totalUsers = adminData?.totalUsers || 0;

  const chartConfig = {
    admin: { color: "#1B68B3", label: "Admins" },
    instructor: { color: "#4DA1FF", label: "Instructors" },
    learner: { color: "#0A2D50", label: "Learners" },
  };

  // Fixed CustomTooltip component with proper TypeScript interface
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        name: string;
        value: number;
        color: string;
      };
    }>;
  }

  // Custom tooltip component with proper type annotations
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
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
          <Card className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
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
          Welcome back, {firstName}!
        </h2>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Total Courses</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{adminData?.totalCourses || 0}</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{adminData?.activeUsers || 0}</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Course Completions</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{adminData?.courseCompletion || 0}%</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Activity Rate</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold">{adminData?.activityRate || 0}%</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Users Donut Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Users</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative h-[200px] w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={4}
                    >
                      {userData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Total count in center */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold">{totalUsers}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
              {userData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Course Progress Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Courses' progress status</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 min-h-[200px] text-center">
            <div className="p-4 mb-3 rounded-full bg-blue-100 text-blue-600">
              <BookText className="h-8 w-8" />
            </div>
            <p className="text-muted-foreground font-medium">
              {adminData?.totalCourses ? `${adminData.totalCourses} courses available` : 'No stats to show'}
            </p>
            <p className="text-sm text-muted-foreground">
              {adminData?.totalCourses ? `${adminData.courseCompletion}% completion rate` : 'Create your first course now'}
            </p>
            
            <Link 
              to="/courses" 
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Go to courses
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-2">
          <Link to="/upload-syllabus" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <BookText className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Upload a new syllabus</span>
          </Link>
          <Link to="/courses" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <LayoutGrid className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>View courses</span>
          </Link>
          <div className="flex items-center p-2 hover:bg-muted rounded-md transition-colors cursor-pointer">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Invite users</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
