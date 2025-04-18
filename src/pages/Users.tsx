
import React, { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { toast } from "sonner";
import { userService, ApiUser, CreateUserPayload, CreateParentPayload } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/LoadingState";
import { AddParentDialog } from "@/components/users/AddParentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [isAddingParent, setIsAddingParent] = useState(false);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch users", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [error]);

  const handleAddUser = async (newUser: CreateUserPayload) => {
    try {
      setIsAddingUser(true);
      await userService.createUser({
        ...newUser,
        status: newUser.status as "Active" | "Inactive"
      });
      
      toast.success("User added successfully");
      setIsAddingUser(false);
      setIsAddUserOpen(false);
      refetch();
    } catch (error) {
      setIsAddingUser(false);
      toast.error("Failed to add user", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleAddParent = async (parentData: CreateParentPayload): Promise<void> => {
    try {
      setIsAddingParent(true);
      await userService.createParent(parentData);
      
      toast.success("Parent added successfully", {
        description: "An email has been sent to the parent with login instructions."
      });
      
      setIsAddingParent(false);
      setIsAddParentOpen(false);
      setSelectedLearnerId(undefined);
      await refetch();
      return Promise.resolve();
    } catch (error) {
      setIsAddingParent(false);
      toast.error("Failed to add parent", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return Promise.reject(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete user", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: ApiUser) => {
    try {
      await userService.updateUserById(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status as "Active" | "Inactive",
      });
      
      toast.success("User updated successfully");
      refetch();
      
      // Navigate to the user details page after update
      navigate(`/users/${updatedUser.id}`);
    } catch (error) {
      toast.error("Failed to update user", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleAddParentName = async (userId: string, parentName: string): Promise<any> => {
    try {
      await userService.addParentName(userId, parentName);
      toast.success("Parent added successfully");
      await refetch();
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to add parent", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return Promise.reject(error);
    }
  };

  const openAddParentForm = (learnerId?: string) => {
    setSelectedLearnerId(learnerId);
    setIsAddParentOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    
    if (activeTab !== "all" && user.role.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => openAddParentForm()} className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" /> Add parent
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add user
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <UsersIcon className="mr-2 h-4 w-4" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="administrator">Administrators</TabsTrigger>
            <TabsTrigger value="instructor">Instructors</TabsTrigger>
            <TabsTrigger value="learner">Learners</TabsTrigger>
            <TabsTrigger value="parent">Parents</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
          {renderUserTable()}
        </TabsContent>
        <TabsContent value="administrator" className="mt-0">
          {renderUserTable()}
        </TabsContent>
        <TabsContent value="instructor" className="mt-0">
          {renderUserTable()}
        </TabsContent>
        <TabsContent value="learner" className="mt-0">
          {renderUserTable()}
        </TabsContent>
        <TabsContent value="parent" className="mt-0">
          {renderUserTable()}
        </TabsContent>
      </Tabs>

      <AddUserDialog 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSubmit={handleAddUser}
        isLoading={isAddingUser}
      />

      <AddParentDialog
        isOpen={isAddParentOpen}
        onClose={() => {
          setIsAddParentOpen(false);
          setSelectedLearnerId(undefined);
        }}
        onSubmit={handleAddParent}
        isLoading={isAddingParent}
        learners={users}
        currentLearnerId={selectedLearnerId}
      />
    </div>
  );

  function renderUserTable() {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-[200px] bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-[200px] bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-[200px] bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
        </div>
      );
    }
    
    return (
      <UserTable 
        users={filteredUsers} 
        onDelete={handleDeleteUser} 
        onUpdate={handleUpdateUser}
        onAddParent={handleAddParentName}
        onCreateParent={openAddParentForm}
      />
    );
  }
};

export default Users;
