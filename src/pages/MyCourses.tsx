import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Star, ChevronRight, Trophy, PlayCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ClassData {
  id: string;
  name: string;
  grade: number;
  enrolledStudents: number;
  totalCourses: number;
  completedCourses: number;
  progress: number;
  color: string;
  image?: string;
  nextClass?: string;
  estimatedTime?: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  progress: number;
  modules: number;
  rating: number;
}

const MyCourses = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  // Mock data - in real app, this would come from API
  const enrolledClasses: ClassData[] = [
    {
      id: "1",
      name: "Math Adventures",
      grade: 1,
      enrolledStudents: 24,
      totalCourses: 8,
      completedCourses: 3,
      progress: 37,
      color: "from-blue-400 to-purple-500",
      nextClass: "Algebra Basics",
      estimatedTime: "2 hours"
    },
    {
      id: "2", 
      name: "Science Explorers",
      grade: 2,
      enrolledStudents: 18,
      totalCourses: 12,
      completedCourses: 7,
      progress: 58,
      color: "from-green-400 to-teal-500",
      nextClass: "Chemical Reactions",
      estimatedTime: "1.5 hours"
    },
    {
      id: "3",
      name: "Creative Writing",
      grade: 3,
      enrolledStudents: 15,
      totalCourses: 6,
      completedCourses: 2,
      progress: 33,
      color: "from-pink-400 to-orange-500",
      nextClass: "Story Structure", 
      estimatedTime: "3 hours"
    }
  ];

  const classCourses: CourseData[] = [
    {
      id: "1",
      title: "Introduction to Numbers",
      description: "Learn the basics of counting and number recognition",
      duration: "45 min",
      completed: true,
      progress: 100,
      modules: 5,
      rating: 4.8
    },
    {
      id: "2",
      title: "Addition & Subtraction",
      description: "Master basic arithmetic operations with fun activities",
      duration: "60 min", 
      completed: true,
      progress: 100,
      modules: 7,
      rating: 4.9
    },
    {
      id: "3",
      title: "Algebra Basics",
      description: "Introduction to variables and simple equations",
      duration: "75 min",
      completed: false,
      progress: 45,
      modules: 8,
      rating: 4.7
    },
    {
      id: "4",
      title: "Geometry Fun",
      description: "Explore shapes, angles, and spatial relationships",
      duration: "50 min",
      completed: false,
      progress: 0,
      modules: 6,
      rating: 4.6
    }
  ];

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
              Grade {selectedClass.grade} - {selectedClass.name}
            </h1>
            <p className="text-purple-600 dark:text-purple-400">
              Progress: {selectedClass.completedCourses}/{selectedClass.totalCourses} courses completed
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {classCourses.map((course, index) => (
            <Card key={course.id} className={cn(
              "kid-card hover:shadow-xl transition-all duration-300 overflow-hidden",
              "animate-fade-in",
              `animate-delay-${index * 100}`
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        course.completed 
                          ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                          : course.progress > 0 
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-gray-300 to-gray-400"
                      )}>
                        {course.completed ? (
                          <Trophy className="h-6 w-6 text-white" />
                        ) : (
                          <PlayCircle className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                          {course.title}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 text-sm">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-purple-600 dark:text-purple-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Progress
                          </span>
                          <span className="text-sm text-purple-600 dark:text-purple-400">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="kid-progress">
                          <div 
                            className="kid-progress-bar transition-all duration-500" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6">
                    <Button 
                      className={cn(
                        "kid-button",
                        course.completed 
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600" 
                          : course.progress > 0 
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
                            : "bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
                      )}
                    >
                      {course.completed ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Review
                        </>
                      ) : course.progress > 0 ? (
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
        {enrolledClasses.map((classData, index) => (
          <Card
            key={classData.id}
            className={cn(
              "kid-card cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group",
              "animate-fade-in hover:scale-105",
              `animate-delay-${index * 200}`
            )}
            onClick={() => setSelectedClass(classData)}
          >
            <div className={cn(
              "h-32 bg-gradient-to-r p-6 relative overflow-hidden",
              classData.color
            )}>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Grade {classData.grade}
                </h3>
                <p className="text-white/90 text-sm">
                  {classData.name}
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
                    <span>{classData.enrolledStudents} students</span>
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
                      {classData.completedCourses}/{classData.totalCourses}
                    </span>
                  </div>
                  <div className="kid-progress">
                    <div 
                      className="kid-progress-bar transition-all duration-700" 
                      style={{ width: `${classData.progress}%` }}
                    ></div>
                  </div>
                </div>

                {classData.nextClass && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      Next up:
                    </p>
                    <p className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                      {classData.nextClass}
                    </p>
                    {classData.estimatedTime && (
                      <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                        Estimated: {classData.estimatedTime}
                      </p>
                    )}
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
        ))}
      </div>

      {enrolledClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="kid-card max-w-md mx-auto p-8">
            <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
              No Classes Yet
            </h3>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              You haven't enrolled in any classes yet. Let's find some awesome courses for you!
            </p>
            <Link to="/courses">
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
