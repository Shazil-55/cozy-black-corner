
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, MoreHorizontal, User, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { GroupUser } from "@/services/groupService";
import { EnrollUsersToGroupDialog } from "./EnrollUsersToGroupDialog";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/groupService";

interface GroupUsersTabProps {
  groupId: string;
  users: GroupUser[];
}

export const GroupUsersTab: React.FC<GroupUsersTabProps> = ({ groupId, users }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GroupUser | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // For refreshing group details after adding/removing users
  const { refetch } = useQuery({
    queryKey: ['group-details', groupId],
    enabled: false, // Don't run automatically
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleRemoveUser = (user: GroupUser) => {
    setSelectedUser(user);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemoveUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsRemoving(true);
      await groupService.updateGroup(groupId, {
        type: 'users',
        userId: selectedUser.id,
        userType: 'unenrolled'
      });
      toast.success(`${selectedUser.name} has been removed from the group`);
      refetch(); // Refresh the group details
    } catch (error) {
      toast.error("Failed to remove user", {
        description: "An error occurred while trying to remove the user from the group"
      });
    } finally {
      setIsRemoving(false);
      setIsRemoveDialogOpen(false);
    }
  };

  const handleAddUsers = () => {
    setIsAddDialogOpen(true);
  };

  const handleUserAdded = () => {
    refetch(); // Refresh the group details
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-64">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={handleAddUsers} className="w-full md:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Users
        </Button>
      </div>

      <Card>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                            <User className="mr-2 h-4 w-4" />
                            View User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveUser(user)} 
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove from Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-14">
              <User className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No users found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "No users match your search criteria. Try adjusting your filters."
                  : "This group doesn't have any users yet. Add users to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User from Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedUser?.name} from this group?
              They will lose access to any group-specific materials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-transparent border-t-current animate-spin mr-1"></div>
                  Removing...
                </div>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EnrollUsersToGroupDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        groupId={groupId}
        enrolledUsers={users}
        onEnrollment={handleUserAdded}
      />
    </div>
  );
};
