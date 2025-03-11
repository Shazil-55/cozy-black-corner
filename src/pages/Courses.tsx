
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book, Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api';

interface SyllabusData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ApiResponse {
  data: SyllabusData[];
}

const Courses: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<SyllabusData[]> => {
      try {
        const response = await api.get<ApiResponse>('/user/courses');
        return response.data.data;
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-talentlms-darkBlue dark:text-white">My Courses</h1>
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
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-talentlms-darkBlue dark:text-white">My Courses</h1>
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-talentlms-darkBlue dark:text-white">My Courses</h1>
      
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((course) => (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-2 bg-gradient-to-r from-talentlms-blue to-talentlms-darkBlue"></div>
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-talentlms-lightBlue dark:bg-talentlms-blue/20 p-2 mr-4">
                    <Book className="h-6 w-6 text-talentlms-blue dark:text-talentlms-lightBlue" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(course.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-talentlms-blue dark:group-hover:text-talentlms-lightBlue transition-colors">
                  {course.name}
                </h2>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(course.createdAt), 'MMM d, yyyy')}
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <User className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-[100px]">
                      {course.userId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
          <Book className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any courses yet. Generate your first syllabus to get started.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-talentlms-blue hover:bg-talentlms-darkBlue text-white transition-colors"
          >
            Generate New Syllabus
          </Link>
        </div>
      )}
    </div>
  );
};

export default Courses;
