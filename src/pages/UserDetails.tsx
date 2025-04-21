
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { userService, ApiUser, UserDetailsResponse } from "@/services/userService";
import { LoadingState } from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfoTab } from "@/components/users/UserInfoTab";
import { UserCoursesTab } from "@/components/users/UserCoursesTab";
import { UserGroupsTab } from "@/components/users/UserGroupsTab";
import { toast } from "sonner";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("info");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userData = await userService.getUserById(userId);
        const detailsData = await userService.getUserDetailsById(userId);
        
        setUser(userData);
        setUserDetails(detailsData);
      } catch (error) {
        toast.error("Failed to load user", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
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

  if (!user || !userDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <Button asChild>
          <Link to="/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/users" aria-label="Back to users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <Badge 
              variant={user.status === "Active" ? "default" : "outline"}
              className={user.status === "Active"
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
              }
            >
              {user.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b">
          <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start">
            <TabsTrigger 
              value="info" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Info
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
            >
              Groups
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="mt-6">
          <UserInfoTab user={user} />
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <UserCoursesTab userId={user.id} />
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <UserGroupsTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;

