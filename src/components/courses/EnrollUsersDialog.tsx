
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, UserPlus } from "lucide-react";

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

import { courseService, CourseEnrolledResponse } from "@/services/courseService";
import { userService, ApiUser } from "@/services/userService";

interface EnrollUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  enrolledUsers: CourseEnrolledResponse[];
  onEnrollment: () => void;
}

export function EnrollUsersDialog({
  isOpen,
  onClose,
  courseId,
  enrolledUsers,
  onEnrollment
}: EnrollUsersDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollingUsers, setEnrollingUsers] = useState<Record<string, boolean>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["users-for-enrollment"],
    queryFn: userService.getAllUsers,
    enabled: isOpen,
  });

  const availableUsers = users?.filter(user => 
    !enrolledUsers.some(enrolledUser => enrolledUser.userName === user.name) &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollUser = async (userId: string) => {
    try {
      setEnrollingUsers(prev => ({ ...prev, [userId]: true }));
      await courseService.enrollUserToCourse(courseId, userId);
      toast.success("User enrolled successfully");
      setEnrollingUsers(prev => ({ ...prev, [userId]: false }));
      onEnrollment();
    } catch (error) {
      console.error("Error enrolling user:", error);
      toast.error("Failed to enroll user", { 
        description: "An error occurred while enrolling the user" 
      });
      setEnrollingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enroll users to course</DialogTitle>
          <DialogDescription>
            Find users and enroll them to this course.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <LoadingSpinner message="Loading available users..." />
                  </TableCell>
                </TableRow>
              ) : availableUsers && availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnrollUser(user.id)}
                        disabled={!!enrollingUsers[user.id]}
                        className="h-8 px-3"
                      >
                        {enrollingUsers[user.id] ? (
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full border-2 border-transparent border-t-current animate-spin mr-1"></div>
                            Enrolling...
                          </div>
                        ) : (
                          <>
                            <UserPlus className="mr-1 h-3 w-3" /> Enroll
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No available users found
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
