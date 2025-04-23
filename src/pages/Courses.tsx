
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Grid2X2, 
  List, 
  ArrowUpDown, 
  MoreHorizontal, 
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import api from '@/services/api';
import { LoadingState } from '@/components/LoadingState';

interface SyllabusData {
  id: string;
  name: string;
  courseCode?: string;
  category?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface CategoryData {
  id: string;
  name: string;
}

const Courses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof SyllabusData>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Fetch courses
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<SyllabusData[]> => {
      try {
        const response = await api.get('/user/courses');
        // Add mock data for the new fields that don't exist yet in the API
        return response.data.data.map((course: SyllabusData) => ({
          ...course,
          courseCode: `CRS-${Math.floor(Math.random() * 10000)}`,
          category: ['Mathematics', 'English', 'Science', 'History', 'Computer Science'][Math.floor(Math.random() * 5)],
          price: Math.floor(Math.random() * 100) * 10 + 99
        }));
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
    meta: {
      onError: () => {
        toast.error('Failed to fetch courses. Please try again later.');
      }
    }
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryData[]> => {
      try {
        const response = await api.get('/administrator/categories');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Return empty array to avoid breaking the UI
        return [];
      }
    }
  });

  // Toggle view mode between grid and list
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Handle sorting
  const handleSort = (column: keyof SyllabusData) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // IMPORTANT: Move all useMemo hooks outside of any conditional rendering to ensure consistent hook order
  // Get unique categories from courses for tabs
  const uniqueCategories = React.useMemo(() => {
    if (!courses) return [];
    
    const uniqueCats = new Set<string>();
    courses.forEach((course) => {
      if (course.category) {
        uniqueCats.add(course.category);
      }
    });
    
    return Array.from(uniqueCats);
  }, [courses]);

  // Filter and sort courses based on search term, active tab, and sort parameters
  const filteredAndSortedCourses = React.useMemo(() => {
    if (!courses) return [];
    
    // Filter by search term
    let filtered = courses.filter((course) => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Filter by active tab/category
    if (activeTab !== "all") {
      filtered = filtered.filter((course) => 
        course.category && course.category.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Sort the filtered courses
    return [...filtered].sort((a, b) => {
      if (sortBy === "name" || sortBy === "courseCode" || sortBy === "category") {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue.toString()) 
          : bValue.toString().localeCompare(aValue.toString());
      } else if (sortBy === "price") {
        const aValue = a.price || 0;
        const bValue = b.price || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "updatedAt") {
        return sortDirection === "asc" 
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [courses, searchTerm, activeTab, sortBy, sortDirection]);
  
  const isLoading = coursesLoading || categoriesLoading;
  
  // Format price as currency
  const formatPrice = (price?: number) => {
    if (price === undefined) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-talentlms-darkBlue dark:text-white">Courses</h1>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-36 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-36 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-36 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-48 animate-pulse"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="flex space-x-3">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
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
        <Link to="/upload-syllabus">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add course
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <Book className="mr-2 h-4 w-4" />
              All Courses
            </TabsTrigger>
            {categories && categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                {category.name}
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

        {/* All courses tab */}
        <TabsContent value="all" className="mt-0">
          {viewMode === "list" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort("name")}
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
                        onClick={() => handleSort("category")}
                        className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                      >
                        Category
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[15%]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort("price")}
                        className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                      >
                        Price
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[15%]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort("updatedAt")}
                        className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                      >
                        Updated On
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.courseCode || "-"}</TableCell>
                        <TableCell>{course.category || "-"}</TableCell>
                        <TableCell>{formatPrice(course.price)}</TableCell>
                        <TableCell>{format(new Date(course.updatedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
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
                                <Link to={`/course/${course.id}`}>
                                  <DropdownMenuItem>
                                    <Book className="mr-2 h-4 w-4" />
                                    View Course
                                  </DropdownMenuItem>
                                </Link>
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
                  <Link 
                    key={course.id} 
                    to={`/course/${course.id}`}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-md group">
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
                          {course.name}
                        </CardTitle>
                        <CardDescription>
                          {course.category || "Uncategorized"}
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
                      <CardFooter className="pt-0 border-t border-muted/40">
                        <div className="w-full flex justify-end">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View course 
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Dynamic category tabs */}
        {categories && categories.map((category) => (
          <TabsContent key={category.id} value={category.name.toLowerCase()} className="mt-0">
            {viewMode === "list" ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[25%]">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("name")}
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
                      <TableHead className="w-[20%]">Category</TableHead>
                      <TableHead className="w-[15%]">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("price")}
                          className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Price
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[15%]">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort("updatedAt")}
                          className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Updated On
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[10%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No courses found in this category.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell>{course.courseCode || "-"}</TableCell>
                          <TableCell>{course.category || "-"}</TableCell>
                          <TableCell>{formatPrice(course.price)}</TableCell>
                          <TableCell>{format(new Date(course.updatedAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right">
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
                                  <Link to={`/course/${course.id}`}>
                                    <DropdownMenuItem>
                                      <Book className="mr-2 h-4 w-4" />
                                      View Course
                                    </DropdownMenuItem>
                                  </Link>
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCourses.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <Book className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      No courses found in this category.
                    </p>
                  </div>
                ) : (
                  filteredAndSortedCourses.map((course) => (
                    <Link 
                      key={course.id} 
                      to={`/course/${course.id}`}
                    >
                      <Card className="h-full transition-all duration-300 hover:shadow-md group">
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
                            {course.name}
                          </CardTitle>
                          <CardDescription>
                            {course.category || "Uncategorized"}
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
                        <CardFooter className="pt-0 border-t border-muted/40">
                          <div className="w-full flex justify-end">
                            <Button variant="ghost" size="sm" className="text-xs">
                              View course 
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Courses;
