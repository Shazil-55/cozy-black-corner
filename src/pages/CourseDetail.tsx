
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  Users, 
  Pencil, 
  Download
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { courseService, CourseDetail } from "@/services/courseService";
import { LoadingState } from "@/components/LoadingState";
import { formatFileSize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EnrollUsersDialog } from "@/components/courses/EnrollUsersDialog";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const {
    data: course,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: () => courseService.getCourseDetail(courseId || ""),
    enabled: !!courseId,
    meta: {
      onError: () => {
        toast.error("Failed to fetch course details", {
          description: "Please try again later",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <LoadingState message="Loading course details..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Course</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We couldn't load the course details. Please try again later.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const handleUserEnrollment = async () => {
    await refetch();
    setIsEnrollDialogOpen(false);
    toast.success("User enrolled successfully", {
      description: "The user has been added to the course"
    });
  };

  const filteredUsers = course?.users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = course?.files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = course?.groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link 
              to="/courses" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Courses
              </div>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
        
        <Button onClick={() => navigate(`/course/${course.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit course
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            View and manage course information, enrolled users, files, and groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full bg-transparent border-b p-0 h-12 rounded-none flex justify-start space-x-6">
              <TabsTrigger 
                value="users" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="files" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <FileText className="mr-2 h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex-1 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={`Search ${activeTab}...`} 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              {activeTab === "users" && (
                <Button onClick={() => setIsEnrollDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" /> Enroll to course
                </Button>
              )}
            </div>

            <TabsContent value="users" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Progress status</TableHead>
                      <TableHead>Enrollment date</TableHead>
                      <TableHead>Completion date</TableHead>
                      <TableHead>Expiration date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="capitalize">{user.role}</TableCell>
                          <TableCell>{user.progress}%</TableCell>
                          <TableCell>{new Date(user.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>{user.completionDate ? new Date(user.completionDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{user.expirationDate ? new Date(user.expirationDate).toLocaleDateString() : "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">File name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded by</TableHead>
                      <TableHead>Upload date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles && filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>{file.uploadedBy}</TableCell>
                          <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="outline" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No files found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Group name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created at</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups && filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{group.description}</TableCell>
                          <TableCell>{group.membersCount}</TableCell>
                          <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No groups found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EnrollUsersDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        courseId={courseId || ""}
        onEnrollment={handleUserEnrollment}
      />
    </div>
  );
};

export default CourseDetailPage;
