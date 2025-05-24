
import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Calendar, ArrowRight, User, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Dummy data for children
const dummyChildren = [
  {
    id: "child1",
    name: "Emma Johnson",
    grade: "8th Grade",
    coursesEnrolled: 4,
    profileImage: null,
    lastActive: "2 hours ago",
    progress: 68,
  },
  {
    id: "child2",
    name: "Noah Smith",
    grade: "10th Grade",
    coursesEnrolled: 5,
    profileImage: null,
    lastActive: "Yesterday",
    progress: 92,
  },
  {
    id: "child3",
    name: "Olivia Davis",
    grade: "6th Grade",
    coursesEnrolled: 3,
    profileImage: null,
    lastActive: "Just now",
    progress: 45,
  }
];

const ParentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardData', 'parent'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Parent),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
          </div>
          <Separator className="bg-purple-100 dark:bg-purple-800" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
              Welcome, {firstName}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Monitor your children's academic progress
            </p>
          </div>
          <Link to="/profile">
            <Button variant="outline" className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50">
              Parent Profile
            </Button>
          </Link>
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Children</h3>
          </div>
          
          <div className="grid gap-5">
            {dummyChildren.map((child) => (
              <Link key={child.id} to={`/parent/child/${child.id}`}>
                <Card className={cn(
                  "p-5 hover:shadow-md transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80",
                  "border-l-4 border-purple-400 hover:border-purple-500",
                  "flex items-center justify-between"
                )}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-purple-100 dark:border-purple-800">
                      <AvatarImage src={child.profileImage || ""} alt={child.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{child.name}</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>{child.grade}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{child.coursesEnrolled} Courses</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-green-600 dark:text-green-400">{child.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {child.progress}% Overall Progress
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
