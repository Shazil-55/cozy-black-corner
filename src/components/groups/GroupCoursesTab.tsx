
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { BookOpen, BookPlus, Search, MoreHorizontal, Book, BookX } from "lucide-react";
import { toast } from "sonner";
import { GroupCourse } from "@/services/groupService";
import { EnrollCoursesToGroupDialog } from "./EnrollCoursesToGroupDialog";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/groupService";

interface GroupCoursesTabProps {
  groupId: string;
  courses: GroupCourse[];
}

export const GroupCoursesTab: React.FC<GroupCoursesTabProps> = ({ groupId, courses }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<GroupCourse | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // For refreshing group details after adding/removing courses
  const { refetch } = useQuery({
    queryKey: ['group-details', groupId],
    enabled: false, // Don't run automatically
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleRemoveCourse = (course: GroupCourse) => {
    setSelectedCourse(course);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemoveCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      setIsRemoving(true);
      await groupService.updateGroup(groupId, {
        type: 'courses',
        courseId: selectedCourse.id,
        courseType: 'unenrolled'
      });
      toast.success(`${selectedCourse.name} has been removed from the group`);
      refetch(); // Refresh the group details
    } catch (error) {
      toast.error("Failed to remove course", {
        description: "An error occurred while trying to remove the course from the group"
      });
    } finally {
      setIsRemoving(false);
      setIsRemoveDialogOpen(false);
    }
  };

  const handleAddCourses = () => {
    setIsAddDialogOpen(true);
  };

  const handleCourseAdded = () => {
    refetch(); // Refresh the group details
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-64">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={handleAddCourses} className="w-full md:w-auto">
          <BookPlus className="h-4 w-4 mr-2" />
          Add Courses
        </Button>
      </div>

      <Card>
        <CardContent>
          {filteredCourses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
                            <Book className="mr-2 h-4 w-4" />
                            View Course
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveCourse(course)} 
                            className="text-destructive focus:text-destructive"
                          >
                            <BookX className="mr-2 h-4 w-4" />
                            Remove from Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-14">
              <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No courses found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "No courses match your search criteria. Try adjusting your filters."
                  : "This group doesn't have any courses assigned yet. Assign courses to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Course from Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedCourse?.name} from this group?
              Users in this group will no longer have access to this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-transparent border-t-current animate-spin mr-1"></div>
                  Removing...
                </div>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EnrollCoursesToGroupDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        groupId={groupId}
        enrolledCourses={courses}
        onEnrollment={handleCourseAdded}
      />
    </div>
  );
};
