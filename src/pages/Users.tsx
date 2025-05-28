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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and organize your platform users</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => openAddParentForm()} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Parent
              </Button>
              <Button 
                onClick={() => setIsAddUserOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
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
                  <UsersIcon className="mr-2 h-4 w-4" />
                  All Users
                </TabsTrigger>
                <TabsTrigger 
                  value="administrator"
                  className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Administrators
                </TabsTrigger>
                <TabsTrigger 
                  value="instructor"
                  className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Instructors
                </TabsTrigger>
                <TabsTrigger 
                  value="learner"
                  className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Learners
                </TabsTrigger>
                <TabsTrigger 
                  value="parent"
                  className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Parents
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or role..."
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
            </div>
          </Tabs>
        </div>

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
    </div>
  );

  function renderUserTable() {
    if (isLoading) {
      return (
        <div className="bg-white rounded-xl border border-gray-100">
          <LoadingState 
            message="Loading users" 
            variant="spinner"
            className="py-16"
          />
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <UserTable 
          users={filteredUsers} 
          onDelete={handleDeleteUser} 
          onUpdate={handleUpdateUser}
          onAddParent={handleAddParentName}
          onCreateParent={openAddParentForm}
        />
      </div>
    );
  }
};

export default Users;
