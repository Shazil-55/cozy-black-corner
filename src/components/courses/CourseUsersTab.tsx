
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Filter, ChevronDown, X, UserPlus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "learner" | "instructor";
  progress: number;
  enrollmentDate: string;
  completionDate: string | null;
  expirationDate: string | null;
}

interface CourseUsersTabProps {
  courseId: string;
  onEnrollUser: () => void;
}

export const CourseUsersTab: React.FC<CourseUsersTabProps> = ({
  courseId,
  onEnrollUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Fetch course users
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courseUsers", courseId],
    queryFn: async (): Promise<CourseUser[]> => {
      try {
        // This would be replaced by your actual API endpoint
        // const response = await api.get(`/user/course/${courseId}/users`);
        // return response.data.data;
        
        // Mock data for demonstration
        return [
          {
            id: "1",
            userId: "user1",
            name: "R. Richards",
            email: "rrichards@example.com",
            role: "learner",
            progress: 45,
            enrollmentDate: new Date().toISOString(),
            completionDate: null,
            expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "2",
            userId: "user2",
            name: "S. Storm",
            email: "sstorm@example.com",
            role: "instructor",
            progress: 100,
            enrollmentDate: new Date().toISOString(),
            completionDate: new Date().toISOString(),
            expirationDate: null,
          },
          {
            id: "3",
            userId: "user3",
            name: "J. Grimm",
            email: "jgrimm@example.com",
            role: "learner",
            progress: 72,
            enrollmentDate: new Date().toISOString(),
            completionDate: null,
            expirationDate: null,
          },
          {
            id: "4",
            userId: "user4",
            name: "B. Grimm",
            email: "bgrimm@example.com",
            role: "learner",
            progress: 10,
            enrollmentDate: new Date().toISOString(),
            completionDate: null,
            expirationDate: null,
          },
        ];
      } catch (error) {
        console.error("Error fetching course users:", error);
        toast.error("Failed to load course users");
        throw error;
      }
    },
  });

  const handleUnenrollUser = async (userId: string) => {
    try {
      // This would be replaced by your actual API endpoint
      // await api.delete(`/user/course/${courseId}/user/${userId}`);
      toast.success("User unenrolled successfully");
      refetch();
    } catch (error) {
      console.error("Error unenrolling user:", error);
      toast.error("Failed to unenroll user");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // This would be replaced by your actual API endpoint
      // await api.patch(`/user/course/${courseId}/user/${userId}`, { role: newRole });
      toast.success("User role updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.completionDate && "completed".includes(searchTerm.toLowerCase())) ||
      (!user.completionDate && "in progress".includes(searchTerm.toLowerCase()))
  ).filter((user) => !roleFilter || user.role === roleFilter.toLowerCase());

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[300px]"
            />
          </div>
          
          <Select value={roleFilter || ""} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="">All roles</SelectItem>
                <SelectItem value="learner">Learner</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {(searchTerm || roleFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        
        <Button onClick={onEnrollUser} className="gap-1">
          <UserPlus className="h-4 w-4" /> Enroll user
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse w-1/4" />
          <div className="border rounded-md">
            <div className="border-b h-12 bg-muted/5" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b h-16 bg-muted/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-muted/5 rounded-lg border">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <UserPlus className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-medium">No users found</h3>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-xs mx-auto">
            {searchTerm || roleFilter
              ? "No users match your search criteria. Try adjusting your filters."
              : "This course doesn't have any enrolled users yet. Enroll users to get started."}
          </p>
          <Button onClick={onEnrollUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Enroll user
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Progress status</TableHead>
                  <TableHead>Enrollment date</TableHead>
                  <TableHead>Completion date</TableHead>
                  <TableHead>Expiration date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.userId, value)}
                      >
                        <SelectTrigger className="w-28 capitalize">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learner">Learner</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.progress === 100 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{user.progress}%</div>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full mt-1">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.enrollmentDate)}</TableCell>
                    <TableCell>{formatDate(user.completionDate)}</TableCell>
                    <TableCell>{formatDate(user.expirationDate)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleUnenrollUser(user.userId)}>
                            Unenroll
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
