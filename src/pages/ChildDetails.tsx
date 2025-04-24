
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, Calendar, Clock, Star, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CourseModal } from "@/components/parent/CourseModal";

// Dummy child data
const dummyChildData = {
  "child1": {
    id: "child1",
    name: "Emma Johnson",
    grade: "8th Grade",
    profileImage: null,
    joinDate: "September 2023",
    overallGrade: "A-",
    courses: [
      {
        id: "course1",
        name: "Introduction to Algebra",
        instructor: "Dr. Michael Chen",
        progress: 75,
        nextAssignment: "Quadratic Equations",
        dueDate: "Jun 28",
        category: "Mathematics",
        avgAssignmentGrade: 92,
        avgQuizGrade: 88,
        lastAccessed: "2 days ago",
      },
      {
        id: "course2",
        name: "World History: Modern Era",
        instructor: "Prof. Sarah Thompson",
        progress: 62,
        nextAssignment: "Cold War Analysis",
        dueDate: "Jun 30",
        category: "History",
        avgAssignmentGrade: 85,
        avgQuizGrade: 78,
        lastAccessed: "Yesterday",
      },
      {
        id: "course3",
        name: "Biology Fundamentals",
        instructor: "Dr. James Wilson",
        progress: 90,
        nextAssignment: "Ecosystem Project",
        dueDate: "Jul 5",
        category: "Science",
        avgAssignmentGrade: 95,
        avgQuizGrade: 91,
        lastAccessed: "4 hours ago",
      },
      {
        id: "course4",
        name: "English Literature",
        instructor: "Ms. Elizabeth Gardner",
        progress: 45,
        nextAssignment: "Shakespeare Essay",
        dueDate: "Jul 3",
        category: "Language Arts",
        avgAssignmentGrade: 89,
        avgQuizGrade: 82,
        lastAccessed: "1 week ago",
      }
    ]
  },
  "child2": {
    id: "child2",
    name: "Noah Smith",
    grade: "10th Grade",
    profileImage: null,
    joinDate: "August 2022",
    overallGrade: "A",
    courses: [
      {
        id: "course5",
        name: "Advanced Physics",
        instructor: "Dr. Richard Feynman",
        progress: 88,
        nextAssignment: "Quantum Mechanics",
        dueDate: "Jun 29",
        category: "Science",
        avgAssignmentGrade: 94,
        avgQuizGrade: 96,
        lastAccessed: "Today",
      },
      {
        id: "course6",
        name: "Calculus I",
        instructor: "Prof. Ada Lovelace",
        progress: 95,
        nextAssignment: "Integration Methods",
        dueDate: "Jul 2",
        category: "Mathematics",
        avgAssignmentGrade: 97,
        avgQuizGrade: 92,
        lastAccessed: "Yesterday",
      },
      {
        id: "course7",
        name: "American Literature",
        instructor: "Mr. David Foster",
        progress: 92,
        nextAssignment: "Modernist Analysis",
        dueDate: "Jul 4",
        category: "Language Arts",
        avgAssignmentGrade: 90,
        avgQuizGrade: 88,
        lastAccessed: "3 days ago",
      }
    ]
  },
  "child3": {
    id: "child3",
    name: "Olivia Davis",
    grade: "6th Grade",
    profileImage: null,
    joinDate: "January 2024",
    overallGrade: "B+",
    courses: [
      {
        id: "course8",
        name: "Math Foundations",
        instructor: "Ms. Katherine Johnson",
        progress: 48,
        nextAssignment: "Fractions & Decimals",
        dueDate: "Jun 30",
        category: "Mathematics",
        avgAssignmentGrade: 78,
        avgQuizGrade: 72,
        lastAccessed: "Today",
      },
      {
        id: "course9",
        name: "Introduction to Earth Science",
        instructor: "Dr. Carl Sagan",
        progress: 42,
        nextAssignment: "Weather Systems",
        dueDate: "Jul 5",
        category: "Science",
        avgAssignmentGrade: 84,
        avgQuizGrade: 79,
        lastAccessed: "Yesterday",
      },
      {
        id: "course10",
        name: "Reading Comprehension",
        instructor: "Mrs. J.K. Rowling",
        progress: 38,
        nextAssignment: "Character Analysis",
        dueDate: "Jun 28",
        category: "Language Arts",
        avgAssignmentGrade: 82,
        avgQuizGrade: 75,
        lastAccessed: "4 hours ago",
      }
    ]
  }
};

// Category colors for visual differentiation
const categoryColors = {
  "Mathematics": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "Science": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  "History": "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  "Language Arts": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  "Computer Science": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  "Art": "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  "Music": "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  "Physical Education": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
};

const ChildDetails = () => {
  const { childId } = useParams<{ childId: string }>();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get child data from our dummy data
  const childData = dummyChildData[childId || ""];
  
  if (!childData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link to="/parent-dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Child not found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The requested child information could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleOpenCourseModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/parent-dashboard">
          <Button variant="ghost" className="gap-2 mb-4 hover:bg-purple-100 dark:hover:bg-purple-900/50">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        {/* Child Header Section */}
        <Card className="p-6 border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-purple-100 dark:border-purple-800">
              <AvatarImage src={childData.profileImage || ""} alt={childData.name} />
              <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 text-xl">
                {childData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{childData.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{childData.grade}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Overall: {childData.overallGrade}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span>{childData.courses.length} Courses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>Joined: {childData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Courses Section */}
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Enrolled Courses
          </h3>
          
          <div className="grid gap-5">
            {childData.courses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4"
                style={{ borderLeftColor: course.progress >= 75 ? '#10B981' : course.progress >= 50 ? '#F59E0B' : '#6366F1' }}
                onClick={() => handleOpenCourseModal(course)}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{course.name}</h4>
                        <Badge className={categoryColors[course.category] || "bg-gray-100 text-gray-800"}>
                          {course.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    
                    <div className="text-sm text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Last active: {course.lastAccessed}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>Assignment Grade: <span className="font-medium">{course.avgAssignmentGrade}%</span></span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Next: {course.nextAssignment} (Due: {course.dueDate})</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {selectedCourse && (
        <CourseModal 
          course={selectedCourse} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          studentName={childData.name}
        />
      )}
    </div>
  );
};

export default ChildDetails;
