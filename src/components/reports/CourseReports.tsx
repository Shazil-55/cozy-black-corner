
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Eye, BarChart3, Users, Clock, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { courseService } from "@/services/courseService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const CourseReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.getCourses,
  });

  // Calculate stats from courses data
  const stats = React.useMemo(() => {
    if (!courses) return {
      completionRate: "0.0%",
      completedLearners: 0,
      learnersInProgress: 1,
      learnersNotPassed: 0,
      learnersNotStarted: 0,
      trainingTime: "1m"
    };

    const totalCourses = courses.length;
    const activeCourses = courses.filter(course => course.isPublished).length;
    
    return {
      completionRate: totalCourses > 0 ? `${((activeCourses / totalCourses) * 100).toFixed(1)}%` : "0.0%",
      completedLearners: activeCourses,
      learnersInProgress: Math.max(1, totalCourses - activeCourses),
      learnersNotPassed: 0,
      learnersNotStarted: 0,
      trainingTime: `${totalCourses}m`
    };
  }, [courses]);

  const filteredCourses = courses?.filter(course =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading course reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course reports</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.completionRate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion rate
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.completedLearners}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Active courses
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {stats.learnersInProgress}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Inactive courses
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {stats.learnersNotPassed}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                Courses not passed
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                {stats.learnersNotStarted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Courses not started
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {stats.trainingTime}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Training time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Course Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Courses Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned learners</TableHead>
                  <TableHead>Completed learners</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">{course.courseTitle}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">-</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          1
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">-</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.isPublished ? "default" : "secondary"}>
                          {course.isPublished ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseReports;
