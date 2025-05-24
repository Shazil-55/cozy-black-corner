
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, BookPlus } from "lucide-react";

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
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { courseService, Course } from "@/services/courseService";
import { groupService } from "@/services/groupService";

interface EnrollCoursesToGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  enrolledCourses?: { id: string }[];
  onEnrollment: () => void;
}

export function EnrollCoursesToGroupDialog({
  isOpen,
  onClose,
  groupId,
  enrolledCourses = [],
  onEnrollment,
}: EnrollCoursesToGroupDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollingCourses, setEnrollingCourses] = useState<Record<string, boolean>>({});

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses-for-group-enrollment"],
    queryFn: () => courseService.getCourses(),
    enabled: isOpen,
  });

  const availableCourses = courses.filter(course => 
    !enrolledCourses.some(enrolled => enrolled.id === course.id) &&
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollCourse = async (courseId: string) => {
    try {
      setEnrollingCourses(prev => ({ ...prev, [courseId]: true }));
      await groupService.updateGroup(groupId, {
        type: 'courses',
        courseId,
        courseType: 'enrolled'
      });
      toast.success("Course added to group successfully");
      onEnrollment();
    } catch (error) {
      toast.error("Failed to add course", { 
        description: "An error occurred while adding the course to this group" 
      });
    } finally {
      setEnrollingCourses(prev => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add courses to group</DialogTitle>
          <DialogDescription>
            Find courses and add them to this group.
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
                  <TableCell colSpan={3}>
                    <LoadingSpinner message="Loading available courses..." />
                  </TableCell>
                </TableRow>
              ) : availableCourses.length > 0 ? (
                availableCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.courseTitle}</TableCell>
                    <TableCell>{course.categoryName || "Uncategorized"}</TableCell>
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
                            Adding...
                          </div>
                        ) : (
                          <>
                            <BookPlus className="mr-1 h-3 w-3" /> Add
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No available courses found
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
