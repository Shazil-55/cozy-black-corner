
import React, { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { toast } from "sonner";

// Dummy data for initial development
export type User = {
  id: string;
  name: string;
  email: string;
  type: string;
  registrationDate: string;
  lastLogin: string;
  status: "active" | "inactive";
};

const initialUsers: User[] = [
  {
    id: "1",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    type: "Administrator",
    registrationDate: "2023-02-15",
    lastLogin: "2023-04-08 10:23",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    type: "Instructor",
    registrationDate: "2023-03-20",
    lastLogin: "2023-04-07 14:45",
    status: "active",
  },
  {
    id: "3",
    name: "Jessica Rodriguez",
    email: "j.rodriguez@example.com",
    type: "Learner",
    registrationDate: "2023-02-28",
    lastLogin: "2023-04-06 09:15",
    status: "active",
  },
  {
    id: "4",
    name: "David Williams",
    email: "d.williams@example.com",
    type: "Instructor",
    registrationDate: "2023-01-10",
    lastLogin: "2023-04-05 11:30",
    status: "inactive",
  },
  {
    id: "5",
    name: "Emily Johnson",
    email: "e.johnson@example.com",
    type: "Learner",
    registrationDate: "2023-03-05",
    lastLogin: "2023-04-08 08:55",
    status: "active",
  },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const handleAddUser = (newUser: Omit<User, "id" | "registrationDate" | "lastLogin">) => {
    // In a real application, this would be handled by an API call
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substring(2, 9),
      registrationDate: new Date().toISOString().split('T')[0],
      lastLogin: "Never",
    };
    
    setUsers([...users, user]);
    toast.success("User added successfully");
    setIsAddUserOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    toast.success("User updated successfully");
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.type.toLowerCase().includes(searchLower)
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

      <UserTable 
        users={filteredUsers} 
        onDelete={handleDeleteUser} 
        onUpdate={handleUpdateUser}
      />

      <AddUserDialog 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
