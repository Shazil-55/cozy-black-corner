
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Users,
  BookOpen,
  Eye,
  Trash2,
  Edit,
  Plus,
  Calendar,
  Share2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseService } from "@/services/courseService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { EditCourseModal } from "@/components/courses/EditCourseModal";
import { AssignmentsTab } from "@/components/courses/AssignmentsTab";

interface CourseDetailsProps {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  image?: string;
  courseTitle?: string;
}

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    lessons: any[];
    order: number;
  };
  courseId: string;
  onModuleClick: () => void;
  onLessonClick: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{module.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Module {module.order}
        </p>
      </CardContent>
    </Card>
  );
};

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<"overview" | "assignments">("overview");
  
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseDetails(courseId!),
  });

  // Add console log to debug the data structure
  console.log("Course details data:", course);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Course not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The course you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  // Handle the API response structure where course info is nested
  const courseInfo = course.data?.course || course.data || course;
  // Access classes from the course data structure, with fallback to empty array
  const classes = courseInfo?.classes || [];
  
  // Map classes to modules format if needed for compatibility
  const mappedModules = classes.map((classItem: any, index: number) => ({
    id: classItem.id,
    title: classItem.title || classItem.name,
    lessons: [],
    order: index + 1
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          {courseInfo.image && (
            <img
              src={courseInfo.image}
              alt={courseInfo.courseTitle || courseInfo.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {courseInfo.courseTitle || courseInfo.name}
            </h1>
            <p className="text-blue-100">
              {courseInfo.description || "No description available"}
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {classes.length} Classes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  0 Students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Created {new Date(courseInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "assignments"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Assignments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Course Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Course Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {courseInfo.description || "No description available for this course."}
                </p>
              </div>

              {/* Course Modules */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Course Content
                </h3>
                {mappedModules && mappedModules.length > 0 ? (
                  <div className="space-y-4">
                    {mappedModules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        courseId={courseId!}
                        onModuleClick={() => {}}
                        onLessonClick={() => {}}
                        isExpanded={false}
                        onToggleExpand={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No content available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This course doesn't have any modules or classes yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <AssignmentsTab 
              courseId={courseId!} 
              assignments={course.data?.assignments || []}
              onAssignmentAdded={async () => {}}
              classes={classes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
