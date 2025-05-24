
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

import { userService, ApiUser } from "@/services/userService";
import { groupService } from "@/services/groupService";

interface EnrollUsersToGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  enrolledUsers?: { id: string }[];
  onEnrollment: () => void;
}

export function EnrollUsersToGroupDialog({
  isOpen,
  onClose,
  groupId,
  enrolledUsers = [],
  onEnrollment,
}: EnrollUsersToGroupDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollingUsers, setEnrollingUsers] = useState<Record<string, boolean>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["users-for-group-enrollment"],
    queryFn: userService.getAllUsers,
    enabled: isOpen,
  });

  const availableUsers = users?.filter(user => 
    !enrolledUsers.some(enrolledUser => enrolledUser.id === user.id) &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollUser = async (userId: string) => {
    try {
      setEnrollingUsers(prev => ({ ...prev, [userId]: true }));
      await groupService.updateGroup(groupId, {
        type: 'users',
        userId,
        userType: 'enrolled'
      });
      toast.success("User enrolled to group successfully");
      onEnrollment();
    } catch (error) {
      toast.error("Failed to enroll user", { 
        description: "An error occurred while enrolling the user to this group" 
      });
    } finally {
      setEnrollingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add users to group</DialogTitle>
          <DialogDescription>
            Find users and add them to this group.
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
                            Adding...
                          </div>
                        ) : (
                          <>
                            <UserPlus className="mr-1 h-3 w-3" /> Add
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
