
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
import { LoadingState } from "@/components/LoadingState";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Group Management
              </h1>
              <p className="text-gray-600 mt-1">Organize and manage your learning groups</p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
              <TabsList className="h-12 p-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Users className="mr-2 h-4 w-4" />
                  All Groups
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search groups by name, description, or creator..."
                    className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="bg-white rounded-xl border border-gray-100">
                    <LoadingState 
                      message="Loading groups" 
                      variant="spinner"
                      className="py-16"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <GroupTable 
                      groups={filteredGroups}
                      isLoading={isLoading}
                      onUpdateGroup={handleUpdateGroup}
                      onDeleteGroup={handleDeleteGroup}
                    />
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <AddGroupDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </div>
  );
};

export default Groups;
