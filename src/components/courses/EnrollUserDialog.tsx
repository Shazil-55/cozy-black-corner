
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Search, UserPlus, CheckCircle2, User } from "lucide-react";
import { toast } from "sonner";

import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnrollableUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EnrollUserDialogProps {
  courseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EnrollUserDialog: React.FC<EnrollUserDialogProps> = ({
  courseId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("learner");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["enrollableUsers", courseId],
    queryFn: async (): Promise<EnrollableUser[]> => {
      try {
        // This would be replaced by your actual API endpoint
        // const response = await api.get(`/user/course/${courseId}/enrollable-users`);
        // return response.data.data;
        
        // Mock data for demonstration
        return [
          {
            id: "u1",
            name: "M. Richards",
            email: "mrichards@example.com",
            role: "learner",
          },
          {
            id: "u2",
            name: "T. Storm",
            email: "tstorm@example.com",
            role: "instructor",
          },
          {
            id: "u3",
            name: "P. Parker",
            email: "pparker@example.com",
            role: "learner",
          },
          {
            id: "u4",
            name: "B. Banner",
            email: "bbanner@example.com",
            role: "learner",
          },
          {
            id: "u5",
            name: "T. Stark",
            email: "tstark@example.com",
            role: "instructor",
          },
        ];
      } catch (error) {
        console.error("Error fetching enrollable users:", error);
        toast.error("Failed to load available users");
        throw error;
      }
    },
    enabled: open,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleEnrollUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to enroll");
      return;
    }

    setIsSubmitting(true);
    try {
      // This would be replaced by your actual API endpoint
      // await api.post(`/user/course/${courseId}/enroll`, {
      //   userIds: selectedUsers,
      //   role: selectedRole,
      // });
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Users enrolled successfully", {
        description: `${selectedUsers.length} ${selectedUsers.length === 1 ? "user" : "users"} enrolled as ${selectedRole}.`,
      });
      setSelectedUsers([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error enrolling users:", error);
      toast.error("Failed to enroll users");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Enroll users to course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-[180px]">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learner">Learner</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full inline-block mr-2"></div>
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <>
                <div className="border-b p-2 sticky top-0 bg-background z-10">
                  <div className="flex items-center">
                    <Checkbox
                      id="select-all"
                      checked={
                        filteredUsers.length > 0 &&
                        selectedUsers.length === filteredUsers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="ml-2 text-sm font-medium cursor-pointer select-none"
                    >
                      Select all users
                    </label>
                    {selectedUsers.length > 0 && (
                      <span className="ml-auto text-sm text-muted-foreground">
                        {selectedUsers.length} selected
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                        className="pointer-events-none"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="ml-3">
                        <span className="capitalize text-xs bg-muted px-2 py-1 rounded">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleEnrollUsers}
            disabled={selectedUsers.length === 0 || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Enrolling...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Enroll {selectedUsers.length} {selectedUsers.length === 1 ? "user" : "users"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
