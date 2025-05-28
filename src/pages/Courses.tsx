import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Grid2X2, 
  List, 
  ArrowUpDown, 
  Eye,
  Pencil,
  Trash2, 
  Book 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import api from '@/services/api';
import { LoadingState } from '@/components/LoadingState';
import { courseService, Course } from '@/services/courseService';
import { CreateCourseModal } from '@/components/courses/CreateCourseModal';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Course>("courseTitle");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: courses, isLoading: coursesLoading, error: coursesError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getCourses,
    meta: {
      onError: () => {
        toast.error('Failed to fetch courses. Please try again later.');
      }
    }
  });

  const uniqueCategories = React.useMemo(() => {
    if (!courses) return [];
    const uniqueCats = new Set<string>();
    courses.forEach((course) => {
      if (course.categoryName) {
        uniqueCats.add(course.categoryName);
      }
    });
    return Array.from(uniqueCats);
  }, [courses]);

  const filteredAndSortedCourses = React.useMemo(() => {
    if (!courses) return [];
    
    let filtered = courses.filter((course) => 
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.categoryName && course.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (activeTab !== "all") {
      filtered = filtered.filter((course) => 
        course.categoryName && course.categoryName.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (sortBy === "courseTitle" || sortBy === "courseCode" || sortBy === "categoryName") {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue.toString()) 
          : bValue.toString().localeCompare(aValue.toString());
      } else if (sortBy === "price") {
        const aValue = a.price !== undefined ? Number(a.price) || 0 : 0;
        const bValue = b.price !== undefined ? Number(b.price) || 0 : 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "updatedAt") {
        return sortDirection === "asc" 
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [courses, searchTerm, activeTab, sortBy, sortDirection]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleSort = (column: keyof Course) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/course/${courseId}/edit?isEdit=true`);
  };

  const openDeleteDialog = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await courseService.deleteCourse(courseToDelete);
      toast.success("Course deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete course", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };
  
  const isLoading = coursesLoading;
  
  const formatPrice = (price?: number | string) => {
    if (price === undefined) return "-";
    const numericPrice = typeof price === 'string' ? Number(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <LoadingState 
              message="Loading courses" 
              variant="spinner"
              className="py-20"
            />
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Courses</h2>
              <p className="text-gray-700">
                We couldn't load your courses. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage your educational content</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
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
                  <Book className="mr-2 h-4 w-4" />
                  All Courses
                </TabsTrigger>
                {uniqueCategories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()} 
                    className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses by title, code, or category..."
                    className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={toggleViewMode}
                        className="h-12 w-12 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        {viewMode === "grid" ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <Grid2X2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle {viewMode === "grid" ? "list" : "grid"} view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Content for all tabs */}
              <TabsContent value="all" className="mt-0">
                {renderCourseContent()}
              </TabsContent>

              {uniqueCategories.map((category) => (
                <TabsContent key={category} value={category.toLowerCase()} className="mt-0">
                  {renderCourseContent()}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteCourse} 
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <CreateCourseModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            refetch();
          }} 
        />
      </div>
    </div>
  );

  function renderCourseContent() {
    if (viewMode === "list") {
      return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[25%]">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("courseTitle")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                  >
                    Course Name
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("courseCode")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                  >
                    Course Code
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%]">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("categoryName")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                  >
                    Category
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="w-[15%]">Updated On</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{course.courseTitle}</TableCell>
                    <TableCell>{course.courseCode}</TableCell>
                    <TableCell>{course.categoryName}</TableCell>
                    <TableCell>{format(new Date(course.updatedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Action buttons remain the same */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewCourse(course.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Preview course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditCourse(course.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => openDeleteDialog(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h2>
              <p className="text-gray-600 mb-6">
                No courses matching your search criteria.
              </p>
            </div>
          ) : (
            filteredAndSortedCourses.map((course) => (
              <Card key={course.id} className="h-full transition-all duration-300 hover:shadow-lg group border border-gray-200 rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-3 mr-4">
                      <Book className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                      {course.courseCode || "N/A"}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                  </CardTitle>
                  <CardDescription>
                    {course.categoryName || "Uncategorized"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{formatPrice(course.price)}</div>
                    <div className="text-muted-foreground">
                      Updated {format(new Date(course.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-gray-100 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs hover:bg-blue-50"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <Eye className="mr-1 h-3 w-3" /> Preview
                  </Button>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs hover:bg-blue-50"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => openDeleteDialog(course.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      );
    }
  }
};

export default Courses;
