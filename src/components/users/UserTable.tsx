import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Edit, 
  Trash, 
  Check, 
  X,
  UserPlus
} from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiUser } from "@/services/userService";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface UserTableProps {
  users: ApiUser[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (user: ApiUser) => void;
  onAddParent: (userId: string, parentName: string) => Promise<any>;
  onCreateParent?: (learnerId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onDelete, 
  onUpdate, 
  onAddParent,
  onCreateParent 
}) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<keyof ApiUser>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [parentDialogOpen, setParentDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [parentName, setParentName] = useState("");
  const [isAddingParent, setIsAddingParent] = useState(false);
  
  const handleSort = (column: keyof ApiUser) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        setIsDeleting(true);
        await onDelete(userToDelete);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddParent = () => {
    if (selectedUserId && parentName.trim()) {
      setIsAddingParent(true);
      onAddParent(selectedUserId, parentName)
        .then(() => {
          setParentDialogOpen(false);
          setParentName("");
          setSelectedUserId(null);
        })
        .catch((error) => {
          console.error("Error adding parent:", error);
        })
        .finally(() => {
          setIsAddingParent(false);
        });
    }
  };

  const openParentDialog = (userId: string) => {
    setSelectedUserId(userId);
    setParentDialogOpen(true);
  };
  
  const handleCreateProperParent = (learnerId: string) => {
    if (onCreateParent) {
      onCreateParent(learnerId);
    }
  };
  
  const handleEditUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("name")}
                  className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                >
                  Name
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("email")}
                  className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                >
                  Email
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("role")}
                  className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                >
                  Role
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("registrationDate")}
                  className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                >
                  Registration
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("status")}
                  className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                >
                  Status
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">Parent</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{formatDate(user.registrationDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "Active" ? "default" : "outline"}
                      className={user.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                      }
                    >
                      {user.status === "Active" ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === "Learner" ? (
                      user.parentName ? (
                        <span className="text-sm">{user.parentName}</span>
                      ) : (
                        <div className="flex space-x-2">
                           {onCreateParent && (
                             <Button 
                              variant="outline" 
                               size="sm" 
                               className="h-8 text-xs" 
                               onClick={() => handleCreateProperParent(user.id)}
                              disabled={isAddingParent && selectedUserId === user.id}
                            >
                              {isAddingParent && selectedUserId === user.id ? (
                                <div className="flex items-center">
                                  <div className="w-3.5 h-3.5 mr-1">
                                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                                  </div>
                                  Adding...
                                </div>
                              ) : (
                                <>
                                  <UserPlus className="mr-1 h-3.5 w-3.5" />
                                  Create Parent
                                </>
                              )}
                             </Button>
                           )}
                        </div>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Actions</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            View & Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setUserToDelete(user.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={parentDialogOpen} onOpenChange={setParentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Parent Information</DialogTitle>
          </DialogHeader>
          {isAddingParent ? (
            <div className="py-6">
              <LoadingState 
                variant="minimal" 
                message="Adding parent information..." 
              />
            </div>
          ) : (
            <div className="py-4">
              <Input
                placeholder="Enter parent's name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full"
                disabled={isAddingParent}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setParentDialogOpen(false)} disabled={isAddingParent}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddParent} 
              disabled={!parentName.trim() || isAddingParent}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
