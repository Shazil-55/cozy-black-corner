
import api from './api';

export interface ClassData {
  id: string;
  title: string;
  classNo: number;
  concepts: string[];
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  syllabusId: string;
  classes: ClassData[];
}

export interface CourseDetailsResponse {
  data: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    modules: ModuleData[];
  };
}

export const courseService = {
  async getCourseDetails(courseId: string): Promise<CourseDetailsResponse> {
    try {
      const response = await api.get<CourseDetailsResponse>(`/user/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  },
  
  async updateModuleTitle(moduleId: string, title: string): Promise<any> {
    try {
      // This is a placeholder for an actual API call that would update the module title
      // In a real application, you would implement this endpoint
      const response = await api.patch(`/user/module/${moduleId}`, { title });
      return response.data;
    } catch (error) {
      console.error('Error updating module title:', error);
      throw error;
    }
  }
};
