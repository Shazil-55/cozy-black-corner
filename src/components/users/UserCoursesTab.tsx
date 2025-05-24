
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, PlusCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollCoursesDialog } from "@/components/courses/EnrollCoursesDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { courseService } from "@/services/courseService";

interface EnrolledCourse {
  id: string;
  courseId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress: string;
  completionDate: string | null;
}

interface UserCoursesTabProps {
  userId: string;
  courses: EnrolledCourse[];
  onEnrollmentUpdate: () => void;
}

export const UserCoursesTab: React.FC<UserCoursesTabProps> = ({ 
  userId, 
  courses,
  onEnrollmentUpdate 
}) => {
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const handleCourseEnrollment = () => {
    onEnrollmentUpdate();
    setIsEnrollDialogOpen(false);
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await courseService.unenrollFromCourse(courseId, userId);
      toast.success("Successfully unenrolled from course");
      onEnrollmentUpdate();
    } catch (error) {
      toast.error("Failed to unenroll from course");
    }
  };

  // Transform courses to the format expected by EnrollCoursesDialog
  const enrolledCoursesForDialog = courses.map(course => ({
    courseId: course.courseId
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">Enrolled Courses</h2>
        <Button onClick={() => setIsEnrollDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll to course
        </Button>
      </div>
      
      <Card>
          {courses && courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course ID</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow 
                    key={course.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{course.courseId}</TableCell>
                    <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${parseFloat(course.progress)}%` }}
                          />
                        </div>
                        <span>{parseFloat(course.progress).toFixed(2)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        course.completionDate 
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                          : 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                      }`}>
                        {course.completionDate ? 'Completed' : 'In Progress'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Link to={`/course/${course.courseId}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View course</span>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View course</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleUnenroll(course.courseId)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Unenroll</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unenroll from course</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-14">
              <h3 className="text-lg font-semibold mb-1 text-gray-900">No enrolled courses</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Enroll this user in courses from the available list.
              </p>
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Enroll to course
              </Button>
            </div>
          )}
      </Card>

      <EnrollCoursesDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        userId={userId}
        enrolledCourses={enrolledCoursesForDialog}
        onEnrollment={handleCourseEnrollment}
      />
    </div>
  );
};
