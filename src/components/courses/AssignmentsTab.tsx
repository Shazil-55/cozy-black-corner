
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus, Trash2, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { toast } from "sonner";
import { courseService } from "@/services/courseService";
import { Spinner } from "@/components/ui/spinner";
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
import { Input } from "@/components/ui/input";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  dueDate: string;
  createdAt: string;
  classNumbers?: string[];
  isAiGenerated: boolean;
  published?: boolean;
  totalMarks?: number;
  questions?: any[];
}

export interface ClassOption {
  id: string;
  title: string;
}

interface AssignmentsTabProps {
  courseId: string;
  assignments: Assignment[];
  onAssignmentAdded: () => Promise<void>;
  classes?: ClassOption[];
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  courseId, 
  assignments = [],
  onAssignmentAdded,
  classes = []
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePrompt = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    
    try {
      setIsDeleting(true);
      await courseService.deleteAssignment(assignmentToDelete);
      toast.success("Assignment deleted successfully");
      await onAssignmentAdded(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete assignment", {
        description: "An error occurred while deleting the assignment"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedAssignment(null);
    setIsAddDialogOpen(false);
  };

  const handleAssignmentSuccess = async () => {
    await onAssignmentAdded();
    handleCloseDialog();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] min-w-[150px]">Title</TableHead>
              <TableHead className="min-w-[250px]">Description</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[80px]">Marks</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell className="line-clamp-2 max-w-[300px]">{assignment.description}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.totalMarks || "—"}</TableCell>
                  <TableCell>{assignment.isAiGenerated ? "AI Generated" : "Manual"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8"
                              onClick={() => handleEditAssignment(assignment)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeletePrompt(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FilePlus className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-lg font-medium mb-1">No assignments available</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create assignments for your students to complete
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add Assignment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent dialog from closing immediately
                handleDeleteConfirm();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" color="white" className="mr-2" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddAssignmentDialog 
        isOpen={isAddDialogOpen} 
        onClose={handleCloseDialog} 
        courseId={courseId}
        onAssignmentAdded={handleAssignmentSuccess}
        assignment={selectedAssignment}
        classes={classes}
      />
    </div>
  );
};
