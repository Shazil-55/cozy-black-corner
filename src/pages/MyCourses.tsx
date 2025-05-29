
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Star, ChevronRight, Trophy, PlayCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "sonner";

interface CourseData {
  id: string;
  progress: string;
  courseId: string;
  courseName: string;
  courseDescription: string;
  courseImage: string;
  totalEnrolled: string;
}

interface ClassData {
  classNo: number;
  totalStudents: number;
  totalCourses: number;
  progress: string;
  nextCourse: string;
  courses: CourseData[];
}

interface ApiResponse {
  data: ClassData[];
}

const MyCourses = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['learnerCourses'],
    queryFn: async (): Promise<ApiResponse> => {
      const response = await api.get('/user/learner/courses');
      return response.data;
    },
    retry: 2
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load your courses. Please try again.");
    }
  }, [error]);

  const enrolledClasses = apiData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            My Learning Journey 🎓
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg">
            Keep exploring and learning awesome things!
          </p>
        </div>
        <LoadingSpinner message="Loading your courses..." />
      </div>
    );
  }

  if (selectedClass) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost" 
            onClick={() => setSelectedClass(null)}
            className="kid-button bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">
              Class {selectedClass.classNo}
            </h1>
            <p className="text-purple-600 dark:text-purple-400">
              Progress: {selectedClass.progress} courses completed
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {selectedClass.courses.map((course, index) => (
            <Card key={course.id} className={cn(
              "kid-card hover:shadow-xl transition-all duration-300 overflow-hidden",
              "animate-fade-in",
              `animate-delay-${index * 100}`
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-r from-purple-400 to-pink-500">
                        {course.courseImage ? (
                          <img 
                            src={course.courseImage} 
                            alt={course.courseName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                          {course.courseName}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 text-sm">
                          {course.courseDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-purple-600 dark:text-purple-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.totalEnrolled} enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>Course ID: {course.courseId.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {parseFloat(course.progress) > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Progress
                          </span>
                          <span className="text-sm text-purple-600 dark:text-purple-400">
                            {parseFloat(course.progress).toFixed(0)}%
                          </span>
                        </div>
                        <div className="kid-progress">
                          <div 
                            className="kid-progress-bar transition-all duration-500" 
                            style={{ width: `${parseFloat(course.progress)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    <Button 
                      onClick={() => navigate(`/course/${course.courseId}`)}
                      className={cn(
                        "kid-button",
                        parseFloat(course.progress) === 100 
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600" 
                          : parseFloat(course.progress) > 0 
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
                            : "bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
                      )}
                    >
                      {parseFloat(course.progress) === 100 ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Review
                        </>
                      ) : parseFloat(course.progress) > 0 ? (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
          My Learning Journey 🎓
        </h1>
        <p className="text-purple-600 dark:text-purple-400 text-lg">
          Keep exploring and learning awesome things!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledClasses.map((classData, index) => {
          const progressNumbers = classData.progress.split('/');
          const progressPercent = progressNumbers.length === 2 
            ? (parseInt(progressNumbers[0]) / parseInt(progressNumbers[1])) * 100 
            : 0;
          
          const colorVariants = [
            "from-blue-400 to-purple-500",
            "from-green-400 to-teal-500", 
            "from-pink-400 to-orange-500",
            "from-indigo-400 to-blue-500",
            "from-purple-400 to-pink-500"
          ];
          
          return (
            <Card
              key={`class-${classData.classNo}`}
              className={cn(
                "kid-card cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group",
                "animate-fade-in hover:scale-105",
                `animate-delay-${index * 200}`
              )}
              onClick={() => setSelectedClass(classData)}
            >
              <div className={cn(
                "h-32 bg-gradient-to-r p-6 relative overflow-hidden",
                colorVariants[index % colorVariants.length]
              )}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Class {classData.classNo}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {classData.totalCourses} course{classData.totalCourses !== 1 ? 's' : ''} available
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Users className="h-4 w-4" />
                      <span>{classData.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{classData.totalCourses} courses</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Your Progress
                      </span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">
                        {classData.progress}
                      </span>
                    </div>
                    <div className="kid-progress">
                      <div 
                        className="kid-progress-bar transition-all duration-700" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {classData.nextCourse && (
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                        Next course:
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                        {classData.nextCourse}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full kid-button bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 group-hover:scale-105 transition-transform"
                  >
                    Explore Courses
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {enrolledClasses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="kid-card max-w-md mx-auto p-8">
            <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
              No Classes Yet
            </h3>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              You haven't enrolled in any classes yet. Let's find some awesome courses for you!
            </p>
            <Link to="/course-catalog">
              <Button className="kid-button bg-gradient-to-r from-indigo-500 to-purple-500">
                Explore Classes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
