
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Upload, Download, Trash2, File, Search } from "lucide-react";
import { format } from "date-fns";

import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CourseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface CourseFilesTabProps {
  courseId: string;
}

export const CourseFilesTab: React.FC<CourseFilesTabProps> = ({ courseId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch course files
  const {
    data: files = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courseFiles", courseId],
    queryFn: async (): Promise<CourseFile[]> => {
      try {
        // This would be replaced by your actual API endpoint
        // const response = await api.get(`/user/course/${courseId}/files`);
        // return response.data.data;
        
        // Mock data for demonstration
        return [
          {
            id: "1",
            name: "Course_Syllabus.pdf",
            type: "pdf",
            size: 2500000, // 2.5 MB
            uploadedBy: "John Doe",
            uploadedAt: new Date().toISOString(),
            url: "#",
          },
          {
            id: "2",
            name: "Lecture_Notes_Week1.docx",
            type: "docx",
            size: 1200000, // 1.2 MB
            uploadedBy: "Jane Smith",
            uploadedAt: new Date().toISOString(),
            url: "#",
          },
          {
            id: "3",
            name: "Assignment_Instructions.pdf",
            type: "pdf",
            size: 850000, // 850 KB
            uploadedBy: "John Doe",
            uploadedAt: new Date().toISOString(),
            url: "#",
          },
        ];
      } catch (error) {
        console.error("Error fetching course files:", error);
        toast.error("Failed to load course files");
        throw error;
      }
    },
  });

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = () => {
    // Implement file upload logic
    toast.info("File upload feature will be implemented soon.");
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      // This would be replaced by your actual API endpoint
      // await api.delete(`/user/course/${courseId}/file/${fileId}`);
      toast.success("File deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full md:w-[300px]"
          />
        </div>
        
        <Button onClick={handleFileUpload} className="gap-1">
          <Upload className="h-4 w-4" /> Upload file
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse w-1/4" />
          <div className="border rounded-md">
            <div className="border-b h-12 bg-muted/5" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b h-16 bg-muted/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-muted/5 rounded-lg border">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-medium">No files found</h3>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-xs mx-auto">
            {searchTerm
              ? "No files match your search criteria."
              : "This course doesn't have any files yet. Upload files to get started."}
          </p>
          <Button onClick={handleFileUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload file
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredFiles.length} of {files.length} files
          </p>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded by</TableHead>
                  <TableHead>Upload date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">{file.type}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.uploadedBy}</TableCell>
                    <TableCell>{format(new Date(file.uploadedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => handleFileDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
