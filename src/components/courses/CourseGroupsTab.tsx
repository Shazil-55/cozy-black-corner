
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Search, UsersIcon, PlusCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";

import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CourseGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface CourseGroupsTabProps {
  courseId: string;
}

export const CourseGroupsTab: React.FC<CourseGroupsTabProps> = ({ courseId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch course groups
  const {
    data: groups = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courseGroups", courseId],
    queryFn: async (): Promise<CourseGroup[]> => {
      try {
        // This would be replaced by your actual API endpoint
        // const response = await api.get(`/user/course/${courseId}/groups`);
        // return response.data.data;
        
        // Mock data for demonstration
        return [
          {
            id: "1",
            name: "Group A",
            description: "Morning session students",
            memberCount: 15,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Group B",
            description: "Evening session students",
            memberCount: 12,
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Advanced Group",
            description: "Students with prior knowledge",
            memberCount: 8,
            createdAt: new Date().toISOString(),
          },
        ];
      } catch (error) {
        console.error("Error fetching course groups:", error);
        toast.error("Failed to load course groups");
        throw error;
      }
    },
  });

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    // Implement group creation logic
    toast.info("Group creation feature will be implemented soon.");
  };

  const handleAddToGroup = (groupId: string) => {
    // Implement add to group logic
    toast.info("Add to group feature will be implemented soon.");
  };

  const handleViewGroup = (groupId: string) => {
    // Implement view group logic
    toast.info("Group details feature will be implemented soon.");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-[300px]"
          />
        </div>
        
        <Button onClick={handleCreateGroup} className="gap-1">
          <PlusCircle className="h-4 w-4" /> Create group
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse w-1/4" />
          <div className="border rounded-md">
            <div className="border-b h-12 bg-muted/5" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b h-16 bg-muted/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-muted/5 rounded-lg border">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <UsersIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-medium">No groups found</h3>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-xs mx-auto">
            {searchTerm
              ? "No groups match your search criteria."
              : "This course doesn't have any groups yet. Create a group to get started."}
          </p>
          <Button onClick={handleCreateGroup}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create group
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredGroups.length} of {groups.length} groups
          </p>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                        {group.memberCount} members
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(group.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAddToGroup(group.id)}
                        className="gap-1 text-xs h-8"
                      >
                        <UserPlus className="h-3 w-3" />
                        Add members
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewGroup(group.id)} 
                        className="text-xs h-8"
                      >
                        View
                      </Button>
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
