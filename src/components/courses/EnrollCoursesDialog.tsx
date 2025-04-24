
import React, { useState } from "react";
import { toast } from "sonner";
import { Search, BookOpen } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { LoadingState } from "@/components/LoadingState";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

interface EnrollCoursesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onEnrollment: () => void;
}

export function EnrollCoursesDialog({
  isOpen,
  onClose,
  userId,
  onEnrollment
}: EnrollCoursesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollingCourses, setEnrollingCourses] = useState<Record<string, boolean>>({});

  // Fix: Using a proper query function that doesn't expect direct parameter
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses-for-enrollment"],
    queryFn: () => courseService.getCourses(),
    enabled: isOpen,
  });

  // Now filtering the array of courses
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollCourse = async (courseId: string) => {
    try {
      setEnrollingCourses(prev => ({ ...prev, [courseId]: true }));
      await courseService.enrollUserToCourse(courseId, userId);
      toast.success("Course enrolled successfully");
      setEnrollingCourses(prev => ({ ...prev, [courseId]: false }));
      onEnrollment();
    } catch (error) {
      console.error("Error enrolling course:", error);
      toast.error("Failed to enroll course", { 
        description: "An error occurred while enrolling the course" 
      });
      setEnrollingCourses(prev => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enroll to course</DialogTitle>
          <DialogDescription>
            Find courses and enroll the user to them.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24">
                    <div className="flex justify-center items-center">
                      <LoadingState message="Loading courses..." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnrollCourse(course.id)}
                        disabled={!!enrollingCourses[course.id]}
                        className="h-8 px-3"
                      >
                        {enrollingCourses[course.id] ? (
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full border-2 border-transparent border-t-current animate-spin mr-1"></div>
                            Enrolling...
                          </div>
                        ) : (
                          <>
                            <BookOpen className="mr-1 h-3 w-3" /> Enroll
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
