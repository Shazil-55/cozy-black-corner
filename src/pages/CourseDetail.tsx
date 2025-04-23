
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  UserPlus,
  Book,
  Users,
  FileText,
  UsersIcon,
  Filter,
  Search,
} from "lucide-react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EnrollUserDialog } from "@/components/courses/EnrollUserDialog";
import { CourseUsersTab } from "@/components/courses/CourseUsersTab";
import { CourseFilesTab } from "@/components/courses/CourseFilesTab";
import { CourseGroupsTab } from "@/components/courses/CourseGroupsTab";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseDetail {
  id: string;
  name: string;
  description: string;
  courseCode: string;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  // Fetch course details
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      try {
        // This would be replaced by your actual API endpoint
        const response = await api.get(`/user/course/${courseId}`);
        
        // For demo purposes, let's enhance the data with mock fields if they don't exist
        const courseData = response.data.data || {};
        return {
          ...courseData,
          courseCode: courseData.courseCode || `CRS-${Math.floor(Math.random() * 10000)}`,
          category: courseData.category || ["Mathematics", "English", "Science"][Math.floor(Math.random() * 3)],
          description: courseData.description || "This course provides comprehensive coverage of key concepts and practical applications.",
          price: courseData.price || Math.floor(Math.random() * 100) * 10 + 99,
        };
      } catch (error) {
        console.error("Error fetching course details:", error);
        throw error;
      }
    },
    enabled: !!courseId,
    meta: {
      onError: () => {
        toast.error("Failed to fetch course details", {
          description: "There was a problem loading course information.",
        });
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="flex p-6 justify-between items-start">
            <div className="space-y-4">
              <div className="h-8 w-80 bg-muted rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-40 bg-muted rounded animate-pulse" />
              <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
          
          <div className="border-t">
            <div className="px-6 pt-4">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-10 w-64 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-36 bg-muted rounded animate-pulse" />
                </div>
                <div className="border rounded-lg">
                  <div className="border-b p-3">
                    <div className="grid grid-cols-6 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b p-3">
                      <div className="grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, j) => (
                          <div key={j} className="h-5 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>
        </div>
        
        <div className="border rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Course not found</h2>
            <p className="text-muted-foreground mb-6">
              The course you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link to="/courses">Return to courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price?: number) => {
    if (price === undefined) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleEnrollUsers = () => {
    setIsEnrollDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="flex p-6 justify-between items-start">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{course.name}</h1>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="outline" className="text-xs px-2 py-0.5 border bg-primary/5 text-primary">
                {course.courseCode}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {course.category}
              </Badge>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(course.updatedAt), "MMM d, yyyy")}
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">{course.description}</p>
            <p className="text-lg font-medium">{formatPrice(course.price)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-1" onClick={handleEnrollUsers}>
              <UserPlus className="h-4 w-4" /> Enroll user
            </Button>
            <Button className="flex gap-1" onClick={() => navigate(`/course/${courseId}/edit`)}>
              <Pencil className="h-4 w-4" /> Edit course
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="border-t">
          <div className="px-6 pt-4">
            <TabsList className="h-10 p-1 bg-muted/30 rounded-xl">
              <TabsTrigger 
                value="users" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all gap-2"
              >
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="files" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all gap-2"
              >
                <FileText className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all gap-2"
              >
                <UsersIcon className="h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="p-6">
            <CourseUsersTab courseId={courseId as string} onEnrollUser={handleEnrollUsers} />
          </TabsContent>
          <TabsContent value="files" className="p-6">
            <CourseFilesTab courseId={courseId as string} />
          </TabsContent>
          <TabsContent value="groups" className="p-6">
            <CourseGroupsTab courseId={courseId as string} />
          </TabsContent>
        </Tabs>
      </div>

      <EnrollUserDialog
        courseId={courseId as string}
        open={isEnrollDialogOpen}
        onOpenChange={setIsEnrollDialogOpen}
        onSuccess={() => {
          refetch();
          toast.success("Users enrolled successfully");
        }}
      />
    </div>
  );
};

export default CourseDetail;
