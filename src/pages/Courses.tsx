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
      <div className="rounded-md border bg-white dark:bg-gray-900 animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="pl-4 pt-4 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="h-10 flex-1 rounded bg-muted animate-pulse" />
          <div className="h-10 w-10 rounded bg-muted animate-pulse" />
        </div>
        <div className="px-4 pb-4">
          <div className="min-w-full">
            <div className="grid grid-cols-6 gap-6 py-3 border-b mb-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            </div>
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-6 items-center py-4 border-b">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-12 rounded-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-talentlms-darkBlue dark:text-white">Courses</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Courses</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We couldn't load your courses. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add course
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="h-10 p-1 bg-muted/30 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all">
              <Book className="mr-2 h-4 w-4" />
              All Courses
            </TabsTrigger>
            {uniqueCategories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category.toLowerCase()} 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow transition-all"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleViewMode}>
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

        <TabsContent value="all" className="mt-0">
          {viewMode === "list" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.courseTitle}</TableCell>
                        <TableCell>{course.courseCode}</TableCell>
                        <TableCell>{course.categoryName}</TableCell>
                        <TableCell>{format(new Date(course.updatedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCourses.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <Book className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No courses matching your search criteria.
                  </p>
                </div>
              ) : (
                filteredAndSortedCourses.map((course) => (
                  <Card key={course.id} className="h-full transition-all duration-300 hover:shadow-md group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-blue-100 dark:bg-blue-900/20 p-2 mr-4">
                          <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-xs text-muted-foreground">
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
                    <CardFooter className="pt-0 border-t border-muted/40 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleViewCourse(course.id)}
                      >
                        <Eye className="mr-1 h-3 w-3" /> Preview
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleEditCourse(course.id)}
                        >
                          <Pencil className="mr-1 h-3 w-3" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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
          )}
        </TabsContent>

        {uniqueCategories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase()} className="mt-0">
            {viewMode === "list" ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.courseTitle}</TableCell>
                          <TableCell>{course.courseCode}</TableCell>
                          <TableCell>{course.categoryName}</TableCell>
                          <TableCell>{format(new Date(course.updatedAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCourses.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <Book className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      No courses matching your search criteria.
                    </p>
                  </div>
                ) : (
                  filteredAndSortedCourses.map((course) => (
                    <Card key={course.id} className="h-full transition-all duration-300 hover:shadow-md group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="rounded-lg bg-blue-100 dark:bg-blue-900/20 p-2 mr-4">
                            <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-xs text-muted-foreground">
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
                      <CardFooter className="pt-0 border-t border-muted/40 flex justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewCourse(course.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" /> Preview
                        </Button>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            <Pencil className="mr-1 h-3 w-3" /> Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-500 text-white hover:bg-red-600">
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
  );
};

export default Courses;
