import React, { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { toast } from "sonner";
import { userService, ApiUser, CreateUserPayload } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/LoadingState";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Fetch users with react-query
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
      await userService.createUser(newUser);
      
      toast.success("User added successfully");
      refetch(); // Refresh the user list
      setIsAddUserOpen(false);
    } catch (error) {
      toast.error("Failed to add user", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      refetch(); // Refresh the user list
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
        status: updatedUser.status.toLowerCase() as "active" | "inactive",
      });
      
      toast.success("User updated successfully");
      refetch(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to update user", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleAddParent = async (userId: string, parentName: string): Promise<any> => {
    try {
      await userService.addParentName(userId, parentName);
      toast.success("Parent added successfully");
      refetch(); // Refresh the user list
      return Promise.resolve(); // Ensure we return a Promise
    } catch (error) {
      toast.error("Failed to add parent", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return Promise.reject(error); // Return a rejected Promise on error
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
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
        <Button onClick={() => setIsAddUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add user
        </Button>
      </div>

      <div className="flex items-center gap-2">
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

      {isLoading ? (
        <LoadingState variant="spinner" message="Loading users" />
      ) : (
        <UserTable 
          users={filteredUsers} 
          onDelete={handleDeleteUser} 
          onUpdate={handleUpdateUser}
          onAddParent={handleAddParent}
        />
      )}

      <AddUserDialog 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
