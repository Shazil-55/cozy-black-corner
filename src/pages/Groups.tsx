
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GroupTable } from "@/components/groups/GroupTable";
import { AddGroupDialog } from "@/components/groups/AddGroupDialog";
import { Group } from "@/types/group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { groupService } from "@/services/groupService";

const Groups = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch groups data with proper error handling
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.getAllGroups,
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to fetch groups", {
          description: error.message || "An unknown error occurred"
        });
      }
    }
  });
  
  // Ensure groups is always an array, even if data is undefined or null
  const groups = Array.isArray(data) ? data : [];

  const handleCreateGroup = (newGroup: Group) => {
    refetch();
  };

  const handleUpdateGroup = async (updatedGroup: Group) => {
    try {
      // The actual update happens in EditGroupDialog now
      refetch();
    } catch (error) {
      console.error("Error in parent component after update:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // The actual deletion happens in the GroupTable component
      refetch();
    } catch (error) {
      console.error("Error in parent component after delete:", error);
    }
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower) ||
      (group.creatorName && group.creatorName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="h-10 p-1 bg-muted/30 rounded-xl">
            <TabsTrigger 
              value="all" 
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all"
            >
              <Users className="mr-2 h-4 w-4" />
              All Groups
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <GroupTable 
                groups={filteredGroups}
                isLoading={isLoading}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddGroupDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default Groups;
