
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupInfoTab } from "@/components/groups/GroupInfoTab";
import { GroupUsersTab } from "@/components/groups/GroupUsersTab";
import { GroupCoursesTab } from "@/components/groups/GroupCoursesTab";
import { GroupFilesTab } from "@/components/groups/GroupFilesTab";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/groupService";
import { toast } from "sonner";

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  const { 
    data: groupDetails, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['group-details', groupId],
    queryFn: () => groupService.getGroupDetails(groupId || ''),
    enabled: !!groupId,
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to fetch group details", {
          description: error.message || "Unknown error occurred"
        });
      }
    }
  });

  if (!groupId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Group ID is missing</h2>
        <Button asChild>
          <Link to="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Error loading group details</h2>
        <p className="text-destructive mb-6">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button asChild>
          <Link to="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || !groupDetails) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Check if groupInfo is available and handle it properly whether it's an object or array
  const groupInfo = Array.isArray(groupDetails.groupInfo) 
    ? groupDetails.groupInfo[0] 
    : groupDetails.groupInfo;
  
  if (!groupInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Group not found</h2>
        <Button asChild>
          <Link to="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/groups" aria-label="Back to groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{groupInfo.name}</h1>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground">{groupInfo.description}</p>
        </div>
      </div>

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start">
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Info
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Files
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="mt-6">
          <GroupInfoTab group={groupInfo} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <GroupUsersTab groupId={groupInfo.id} users={groupDetails.groupUsers || []} />
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <GroupCoursesTab groupId={groupInfo.id} courses={groupDetails.groupCourses || []} />
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <GroupFilesTab groupId={groupInfo.id} files={groupDetails.groupFiles || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetails;
