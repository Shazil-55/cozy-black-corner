
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { File, FileUp, Search, MoreHorizontal, Download, Trash, Eye } from "lucide-react";
import { GroupFileDetails, groupService } from "@/services/groupService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { GroupFileUploader } from "./GroupFileUploader";

interface GroupFilesTabProps {
  groupId: string;
  files: GroupFileDetails[];
}

export const GroupFilesTab: React.FC<GroupFilesTabProps> = ({ groupId, files: initialFiles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GroupFileDetails | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Use react-query to manage files data with refetching capability
  const { 
    data: files, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['group-files', groupId],
    queryFn: async () => {
      const details = await groupService.getGroupDetails(groupId);
      return details.groupFiles || [];
    },
    initialData: initialFiles,
  });

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewFile = (file: GroupFileDetails) => {
    window.open(file.fileUrl, "_blank");
    toast.info(`Opening ${file.fileName}`);
  };

  const handleDownloadFile = (file: GroupFileDetails) => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading ${file.fileName}`);
  };

  const handleDeleteFile = (file: GroupFileDetails) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteFile = async () => {
    if (!selectedFile) return;
    
    try {
      // Since we don't have a direct delete endpoint, we can use a placeholder
      // In a real implementation, you would call a specific API for file deletion
      await groupService.deleteGroupFile(selectedFile.id);
      
      toast.success(`${selectedFile.fileName} has been deleted`);
      refetch(); // Refresh the files list
    } catch (error) {
      toast.error("Failed to delete file", {
        description: "An error occurred. Please try again later."
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUploadFile = () => {
    setIsUploaderOpen(true);
  };

  const handleFileUploadSuccess = async () => {
    await refetch();
    setIsUploaderOpen(false);
    toast.success("File uploaded successfully", {
      description: "The file has been added to the group"
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner message="Loading files..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-64">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={handleUploadFile} className="w-full md:w-auto">
          <FileUp className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <Card>
        <CardContent>
          {filteredFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.fileName}</TableCell>
                    <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                    <TableCell>{file.creatorName}</TableCell>
                    <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewFile(file)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteFile(file)} 
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
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
              <File className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No files found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "No files match your search criteria. Try adjusting your filters."
                  : "This group doesn't have any files uploaded yet. Upload files to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={handleUploadFile} className="mt-4">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFile?.fileName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GroupFileUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        groupId={groupId}
        onFileUpload={handleFileUploadSuccess}
      />
    </div>
  );
};
