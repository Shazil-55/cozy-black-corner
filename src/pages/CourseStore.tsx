
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Book, CircleDollarSign, Star, StarHalf, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryBadge from "@/components/courses/CategoryBadge";
import { toast } from 'sonner';
import { courseStoreService } from '@/services/courseStoreService';

// Types for API response
interface CourseStoreData {
  ilmeeLibrary: IlmeeLibraryCourse[];
  otherProviders: OtherProviderCourse[];
}

interface IlmeeLibraryCourse {
  id: string;
  courseTitle: string;
  courseCode: string;
  categoryName: string;
  description: string;
  image: string;
  isFeatured: boolean;
  avgrating?: string;
  // Additional properties as needed
}

interface OtherProviderCourse {
  id: string;
  courseTitle: string;
  courseCode: string;
  categoryName: string;
  description: string;
  image: string;
  price: string;
  providerName: string;
  avgrating?: string;
  // Additional properties as needed
}

// Type guard functions to check course types
const isIlmeeLibraryCourse = (course: IlmeeLibraryCourse | OtherProviderCourse): course is IlmeeLibraryCourse => {
  return 'isFeatured' in course;
};

const isOtherProviderCourse = (course: IlmeeLibraryCourse | OtherProviderCourse): course is OtherProviderCourse => {
  return 'providerName' in course && 'price' in course;
};

// Categories for filtering (will be dynamically populated)
const initialCategories = [
  "Business Strategy",
  "Technology",
  "Data Science",
  "Leadership",
  "Security",
  "Project Management",
  "Software Skills",
  "Health and Safety",
  "Programming",
  "Marketing",
  "Personal Development"
];

const CourseStore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ilmeeLibrary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseStoreData>({
    ilmeeLibrary: [],
    otherProviders: []
  });
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Fetch course data on component mount
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await courseStoreService.fetchCourseStore();
        console.log('Course store data:', response);
        
        if (response && response.data) {
          setCourseData({
            ilmeeLibrary: response.data.ilmeeLibrary || [],
            otherProviders: response.data.otherProviders || []
          });
          
          // Extract categories from all courses
          const allCourses = [...(response.data.ilmeeLibrary || []), ...(response.data.otherProviders || [])];
          const uniqueCategories = [...new Set(allCourses.map(course => course.categoryName))].filter(Boolean);
          
          // Only update categories if we have some from the API
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data. Please try again later.');
        toast.error('Failed to load course data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, []);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setFeaturedFilter(false);
  };

  // Filter courses based on search query and categories
  const filterCourses = (courses: IlmeeLibraryCourse[] | OtherProviderCourse[]) => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" || 
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(course.categoryName);
      
      // For IlmeeLibrary courses, check featured flag if filter is active
      let matchesFeatured = true;
      if (featuredFilter && activeTab === "ilmeeLibrary") {
        matchesFeatured = isIlmeeLibraryCourse(course) && course.isFeatured === true;
      }
      
      return matchesSearch && matchesCategory && matchesFeatured;
    });
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-store/course/${courseId}`);
  };

  // Transform API data to the structure expected by the UI
  const transformedIlmeeLibraryCourses = filterCourses(courseData.ilmeeLibrary).map(course => {
    // We know this is an IlmeeLibraryCourse because it comes from ilmeeLibrary array
    const ilmeeCourse = course as IlmeeLibraryCourse;
    return {
      id: ilmeeCourse.id,
      title: ilmeeCourse.courseTitle,
      courseCode: ilmeeCourse.courseCode,
      category: ilmeeCourse.categoryName,
      description: ilmeeCourse.description,
      image: ilmeeCourse.image,
      featured: ilmeeCourse.isFeatured,
      rating: ilmeeCourse.avgrating || "4.5"
    };
  });

  const transformedOtherProviderCourses = filterCourses(courseData.otherProviders).map(course => {
    // We know this is an OtherProviderCourse because it comes from otherProviders array
    const otherCourse = course as OtherProviderCourse;
    return {
      id: otherCourse.id,
      title: otherCourse.courseTitle,
      courseCode: otherCourse.courseCode,
      category: otherCourse.categoryName,
      description: otherCourse.description,
      image: otherCourse.image,
      provider: otherCourse.providerName || "External Provider",
      price: parseFloat(otherCourse.price) || null,
      currency: "USD",
      rating: otherCourse.avgrating || "4.0"
    };
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl font-bold mb-2">Course Store</h1>
          <p className="text-muted-foreground">
            Discover and access professional learning content from our library and trusted partners
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4 text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 fade-in-up">
          <h1 className="text-3xl font-bold mb-2">Course Store</h1>
          <p className="text-muted-foreground">
            Discover and access professional learning content from our library and trusted partners
          </p>
        </div>
        <div className="text-center py-16 border border-dashed rounded-lg glass-card">
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="button-hover">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 fade-in-up">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Course Store
        </h1>
        <p className="text-muted-foreground">
          Discover and access professional learning content from our library and trusted partners
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass-card p-6 mb-8 animate-delay-100 fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              className="pl-10 w-full transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === "ilmeeLibrary" && (
              <Button 
                variant={featuredFilter ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-2 button-hover"
                onClick={() => setFeaturedFilter(!featuredFilter)}
              >
                <Star className="h-4 w-4" />
                <span>Featured</span>
              </Button>
            )}

            {(selectedCategories.length > 0 || searchQuery || featuredFilter) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="button-hover">
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <div key={category} className={`animate-delay-${(index % 5 + 1) * 100} fade-in-scale`}>
                <CategoryBadge 
                  category={category}
                  isSelected={selectedCategories.includes(category)}
                  onClick={() => toggleCategory(category)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Banner */}
      <div className="glass-morphism p-4 mb-8 flex justify-between items-center rounded-xl animate-delay-200 fade-in-up">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {activeTab === "ilmeeLibrary" 
              ? "IlmeeLibrary™ offers high-quality courses curated and created by our team. Access requires a subscription."
              : "Other providers offer courses from third-party content creators. Pricing varies by provider."
            }
          </p>
        </div>
        <Button variant="link" size="sm" className="text-blue-700 dark:text-blue-400 hover-scale">
          How it works
        </Button>
      </div>

      <Tabs defaultValue="ilmeeLibrary" value={activeTab} className="mb-8 animate-delay-300 fade-in-up" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden rounded-xl p-1 h-auto shadow-lg">
          <TabsTrigger 
            value="ilmeeLibrary" 
            className="text-sm md:text-base py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
          >
            IlmeeLibrary™
          </TabsTrigger>
          <TabsTrigger 
            value="otherProviders" 
            className="text-sm md:text-base py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
          >
            Other providers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ilmeeLibrary" className="space-y-8">
          {transformedIlmeeLibraryCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedIlmeeLibraryCourses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className={`overflow-hidden cursor-pointer group glass-card card-hover animate-delay-${(index % 3 + 1) * 100} fade-in-scale`} 
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {course.featured && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {course.courseCode} | {course.category}
                        </CardDescription>
                      </div>
                      <div className="flex">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <StarHalf className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-4">{course.description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <Badge variant="secondary" className="text-xs font-normal bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                      IlmeeLibrary™
                    </Badge>
                    <Button size="sm" className="ml-auto button-hover bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      Get this course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg glass-card">
              <p className="text-muted-foreground mb-2">No courses match your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="button-hover">
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="otherProviders" className="space-y-8">
          {transformedOtherProviderCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedOtherProviderCourses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className={`overflow-hidden cursor-pointer group glass-card card-hover animate-delay-${(index % 3 + 1) * 100} fade-in-scale`} 
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
                      <span className="text-xs font-medium text-white">
                        Provider: {course.provider}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {course.courseCode} | {course.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-4">{course.description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <CircleDollarSign className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {course.price ? `${course.price.toFixed(2)} ${course.currency}` : 'Free'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className={`button-hover ${course.price ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-store/course/${course.id}`);
                      }}
                    >
                      {course.price ? 'Buy licenses' : 'Get for free'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg glass-card">
              <p className="text-muted-foreground mb-2">No courses match your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="button-hover">
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseStore;
