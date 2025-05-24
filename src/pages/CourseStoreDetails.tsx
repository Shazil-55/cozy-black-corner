import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Book, CircleDollarSign, Star, StarHalf, Info, FileText } from "lucide-react";
import api from '@/services/api';
import { toast } from 'sonner';

// Course interfaces
interface BaseCourse {
  id: string;
  courseTitle: string;
  courseCode: string;
  categoryName: string;
  description: string;
  image: string;
  avgrating?: string;
}

interface IlmeeLibraryCourse extends BaseCourse {
  isFeatured: boolean;
}

interface OtherProviderCourse extends BaseCourse {
  price: string;
  providerName: string;
}

// Type guard functions
const isIlmeeLibraryCourse = (course: any): course is IlmeeLibraryCourse => {
  return 'isFeatured' in course;
};

const isOtherProviderCourse = (course: any): course is OtherProviderCourse => {
  return 'providerName' in course && 'price' in course;
};

interface CourseDetails {
  course: IlmeeLibraryCourse | OtherProviderCourse;
  isIlmeeLibrary: boolean;
  modules: string[];
  duration: string;
  longDescription: string;
}

const CourseStoreDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        // Fetch from the course store API
        const response = await api.get('/user/course-store');
        
        if (response.data && response.data.data) {
          // Find the course in either ilmeeLibrary or otherProviders arrays
          const ilmeeCourse = response.data.data.ilmeeLibrary?.find(
            (c: IlmeeLibraryCourse) => c.id === courseId
          );
          
          const otherCourse = response.data.data.otherProviders?.find(
            (c: OtherProviderCourse) => c.id === courseId
          );
          
          const course = ilmeeCourse || otherCourse;
          
          if (course) {
            // Determine if this is an IlmeeLibrary course
            const isIlmeeLibraryCourse = !!ilmeeCourse;
            
            // Generate some mock data for the course details since we don't have this in the API yet
            const mockData = {
              duration: "8 hours",
              longDescription: course.description ? `${course.description}\n\nThis comprehensive course provides learners with in-depth knowledge and practical skills in ${course.categoryName}. From understanding fundamental concepts to advanced techniques, you'll gain valuable insights that can be applied in real-world scenarios.\n\nLearn how to:\n• Master core concepts in ${course.categoryName}\n• Apply practical techniques to real-world problems\n• Stay current with industry best practices\n• Overcome common challenges in the field\n• Measure success and track improvement` : "",
              modules: [
                "Introduction to " + course.categoryName,
                "Core Concepts and Methodologies",
                "Practical Applications",
                "Advanced Techniques",
                "Case Studies and Examples"
              ]
            };
            
            setCourseDetails({
              course,
              isIlmeeLibrary: isIlmeeLibraryCourse,
              ...mockData
            });
          } else {
            setError('Course not found');
          }
        } else {
          setError('Failed to load course data');
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 flex items-center group"
          onClick={() => navigate('/course-store')}
        >
          <ChevronLeft className="mr-1 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Course Store
        </Button>
        
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4 text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !courseDetails) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Course Not Found</h1>
        <p className="mb-6">{error || "The course you're looking for doesn't exist or has been removed."}</p>
        <Button onClick={() => navigate('/course-store')}>
          Return to Course Store
        </Button>
      </div>
    );
  }
  
  const { course, isIlmeeLibrary, modules, duration, longDescription } = courseDetails;
  const rating = course.avgrating || "4.5";
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back navigation */}
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 flex items-center group"
        onClick={() => navigate('/course-store')}
      >
        <ChevronLeft className="mr-1 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to Course Store
      </Button>
      
      {/* Course breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4 flex items-center">
        <span>{course.categoryName}</span>
        <span className="mx-2">•</span>
        <Badge variant={isIlmeeLibrary ? "default" : "secondary"} className="font-normal">
          {isIlmeeLibrary ? "IlmeeLibrary™" : isOtherProviderCourse(course) ? course.providerName : "External Provider"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{course.courseTitle}</h1>
          <div className="flex items-center mb-6">
            <div className="flex mr-4">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <StarHalf className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="ml-2 text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{course.courseCode}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <img 
              src={course.image} 
              alt={course.courseTitle} 
              className="w-full h-[300px] object-cover"
            />
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full mb-6 bg-background border-b rounded-none h-auto">
              <TabsTrigger value="overview" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Overview</TabsTrigger>
              <TabsTrigger value="content" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Content</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div className="whitespace-pre-line">{longDescription}</div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="pt-2">
              <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-all border bg-card">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{module}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-2">
              <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reviews available.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Call to action card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`p-6 ${isIlmeeLibrary ? 
              "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50" : 
              "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50"}`}>
              <div className="mb-6">
                {isIlmeeLibrary ? (
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">IlmeeLibrary™ Course</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium">
                      {!isIlmeeLibrary && (course as OtherProviderCourse).price
                        ? `${parseFloat((course as OtherProviderCourse).price).toFixed(2)} USD` 
                        : 'Free Course'}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                className={`w-full mb-4 ${!isIlmeeLibrary && (course as OtherProviderCourse).price ? "bg-green-600 hover:bg-green-700" : ""}`} 
                size="lg"
                onClick={() => isIlmeeLibrary ? navigate('/subscription') : undefined}
              >
                {isIlmeeLibrary ? 'Get this course' 
                  : (course as OtherProviderCourse).price ? 'Buy licenses' : 'Get for free'}
              </Button>
              
              {!isIlmeeLibrary && (
                <Button variant="outline" className="w-full">
                  Add to wishlist
                </Button>
              )}
            </div>
            
            <CardContent className="p-6 bg-card">
              <h3 className="font-semibold mb-3">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Book className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>{duration} of content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Info card */}
          <Card className="overflow-hidden border bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">About the provider</h3>
                  <p className="text-sm text-muted-foreground">
                    {isIlmeeLibrary ? 
                      "IlmeeLibrary™ courses are created by our expert instructional designers and subject matter experts." : 
                      `${(course as OtherProviderCourse).providerName} is a trusted third-party content provider specializing in professional development courses.`
                    }
                  </p>
                </div>
              </div>
              
              {isIlmeeLibrary && (
                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Access IlmeeLibrary™ to get this and hundreds of other courses.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-blue-700 dark:text-blue-400 p-0 h-auto text-sm mt-2"
                    onClick={() => navigate('/subscription')}
                  >
                    View subscription plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseStoreDetails;
