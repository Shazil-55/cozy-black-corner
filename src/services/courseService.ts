import api from "./api";

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
    course: any;
    groups: any;
    files: any;
    enrolledUsers: any;
    assignments: Assignment[];
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
	};
}

// Updated SlideData interface to make it compatible with both usages
export interface SlideData {
  // Original properties
  id?: string;
  slideNo: number;
  title?: string;
  content: string;
  voiceoverScript?: string;
  visualPrompt?: string;
  imageUrl?: string | null;
  example?: string;
  classId?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional properties used in CourseEditor
  slideId?: string;
  slideTitle?: string;
}

export interface QuizQuestion {
	id: string;
	question: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizQuestionWithOptions {
	id: string | number;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	classId: string | number;
	createdAt: string;
	updatedAt: string;
	correctOption: string;
}

export interface AddQuizPayload {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
}

export interface UpdateQuizPayload {
  question?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctOption?: string;
}

export interface QuizAnswer {
	id: string | number;
	optionMarked: string; // Now can be "a", "b", "c", "d" instead of "option1", "option2", etc.
}

export interface QuizSubmissionRequest {
	classId: string;
	answers: QuizAnswer[];
}

export interface QuizSubmissionResponse {
	data: {
		score: number;
	};
}

export interface UserTest {
    id: string;
    classId: string;
    userId: string;
    score: number;
    createdAt: string;
    updatedAt: string;
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ClassDetailsResponse {
	data: {
		id: string;
		title: string;
		classNo: number;
		concepts: string[];
		moduleId: string;
		createdAt: string;
		updatedAt: string;
		slides: SlideData[];
		faqs: FAQ[];
		assessment: {
			quiz: QuizQuestion[];
		};
		userTest?: UserTest; // Added userTest as an optional property
	};
}

export interface CourseUser {
	id: string;
	name: string;
	role: "learner" | "instructor";
	email: string;
	enrollmentDate: string;
	completionDate: string | null;
	expirationDate: string | null;
	progress: number;
}

export interface CourseFile {
	id: string;
	name: string;
	type: string;
	size: number;
	url: string;
	uploadedBy: string;
	uploadedAt: string;
}

export interface CourseGroup {
	id: string;
	name: string;
	description: string;
	membersCount: number;
	createdAt: string;
}

export interface Course {
  id: string;
  courseTitle: string;
  description?: string;
  courseCode?: string;
  price?: string | number; // Updated to accept both string and number
  categoryName?: string;
  categoryId?: string;
  isPublished?: boolean;
  updatedAt: string;
  image?: string | null;
}

export interface CategoryResponse {
  data: Category[];
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrolledResponse {
  id: string;
  progress: number;
  completionDate: string | null;
  enrolledAt: string;
  userName: string;
  userRole: string;
}

export interface CourseFiles {
  id: string;
  courseId: string;
  userId: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseGroups {
  id: string;
  courseId: string;
  groupName: string;
  description: string;
  groupCreatorId: string;
  groupMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailResponse {
  data: {
    enrolledUsers: CourseEnrolledResponse[];
    files: CourseFiles[];
    groups: CourseGroups[];
  };
}

export interface CourseFileUploadResponse {
  data: {
    name: string;
    size: number;
    url: string;
  };
}

export interface CourseFilePayload {
  fileUrl: string;
  fileSize: number;
  fileName: string;
}

export interface GenerateCoursesPayload {
  noOfClasses: number;
  socketId: string;
  classNo: string;
  courseTitle: string,
  description: string;
  price: string | null;  // Changed from number to string
  isPublished: boolean;
  image?: string; // Added the image field as optional
  category?: string; // Added category field
}

export interface GenerateCourseResponse {
  data: {
    id: string;
    name: string;
    // other course fields
  };
}

export interface UpdateModulePayload {
  title: string;
}

// New interface for course details response from the API
export interface CourseEditorDetailsResponse {
  data: any;
  course: {
    id: string;
    courseTitle: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    courseCode: string;
    price: string | null;  // Changed from number to string
    categoryId: string;
    description: string | null;
    image: string | null;
    isPublished: boolean | null;
  };
  enrolledUsers: Array<{
    id: string;
    progress: string;
    completionDate: string | null;
    enrolledAt: string;
    userName: string;
    userRole: string;
    userId: string;
  }>;
  files: Array<any>;
  groups: Array<any>;
}

export interface UpdateCoursePayload {
  courseTitle?: string;
  description?: string;
  price: string | null; // Changed to string to match API expectation
  categoryId?: string;
  isPublished?: boolean;
  image?: string | null;
  courseCode?: string;  // Added courseCode field
}

export interface AddSlidePayload {
  title: string;
  content: string;
  visualPrompt?: string;
  voiceoverScript?: string;
  example?: string;
  imageUrl?: string;
}

export interface UpdateSlidePayload {
  title?: string;
  slideNo?: number;
  content?: string;
  example?: string;
  voiceScript?: string;
  imageUrl?: string;
  visualPrompt?: string;
}

export interface UpdateClassPayload {
  classTitle?: string;
  concepts?: string[];
}

// New interfaces for the course data from the edit endpoint
export interface Slide {
  id: string;
  title: string;
  slideNo: number;
  visualPrompt: string;
  voiceoverScript: string;
  imageUrl: string | null;
  content: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  example: string;
}

export interface Class {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: Slide[];
  faqs?: FAQ[];
  quizzes?: QuizQuestionWithOptions[];
}

export interface CourseInfo {
  id: string;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  courseCode: string | null;
  price: number | null;
  categoryId: string | null;
  description: string | null;
  image: string | null;
  isPublished: boolean | null;
}

export interface CourseResponse {
  data: {
    courseInfo: CourseInfo;
    classes: Class[];
  };
}

export interface PublishCoursePayload {
  isPublished: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  dueDate: string;
  createdAt: string;
  classNumbers?: string[];
  isAiGenerated: boolean;
  published?: boolean;
  totalMarks?: number;
}

export const courseService = {
  async getCourseDetails(courseId: string): Promise<CourseDetailsResponse> {
    try {
      const response = await api.get<CourseDetailsResponse>(
        `/user/course-details/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

  // New function to get course details for the editor
  async getCourseEditorDetails(courseId: string): Promise<CourseEditorDetailsResponse> {
    try {
      const response = await api.get<CourseEditorDetailsResponse>(
        `https://dev-api.ilmee.ai/api/v_1/internal/user/course-details/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course editor details:", error);
      throw error;
    }
  },
  
  // Updated function to use PUT request for updating course details
  async updateCourse(courseId: string, payload: UpdateCoursePayload): Promise<any> {
    try {
      const response = await api.put(`/user/courses/${courseId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  async updateModuleTitle(moduleId: string, title: string): Promise<any> {
    try {
      const payload: UpdateModulePayload = { title };
      const response = await api.patch(`/user/module/${moduleId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating module title:", error);
      throw error;
    }
  },

  async getClassDetails(classId: string): Promise<ClassDetailsResponse> {
    try {
      const response = await api.get<ClassDetailsResponse>(
        `/user/class/${classId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching class details:", error);
      throw error;
    }
  },

  async getQuizQuestions(classId: string): Promise<QuizQuestionWithOptions[]> {
    try {
      const response = await api.get(`/user/quiz/${classId}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      // Return an empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  async addQuizQuestion(classId: string, quizData: AddQuizPayload): Promise<any> {
    try {
      const response = await api.post(`/user/class/${classId}/quiz`, quizData);
      return response.data;
    } catch (error) {
      console.error("Error adding quiz question:", error);
      throw error;
    }
  },

  async updateQuizQuestion(quizId: string, quizData: UpdateQuizPayload): Promise<any> {
    try {
      const response = await api.put(`/user/quiz/${quizId}`, quizData);
      return response.data;
    } catch (error) {
      console.error("Error updating quiz question:", error);
      throw error;
    }
  },

  async deleteQuizQuestion(quizId: string): Promise<any> {
    try {
      const response = await api.delete(`/user/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      throw error;
    }
  },

  async submitQuizAnswers(payload: QuizSubmissionRequest): Promise<QuizSubmissionResponse> {
    try {
      const response = await api.post<QuizSubmissionResponse>(`/user/submit-quiz`, payload);
      return response.data;
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      throw error;
    }
  },

  async getCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/user/courses');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<CategoryResponse>('https://dev-api.ilmee.ai/api/v_1/internal/administrator/categories');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return []; // Return empty array instead of throwing
    }
  },

  async enrollUserToCourse(courseId: string, userId: string): Promise<void> {
    try {
      await api.post('/user/enroll-user-to-course', {
        courseId,
        userId
      });
    } catch (error) {
      console.error("Error enrolling user to course:", error);
      throw error;
    }
  },

  async getCourseDetail(courseId: string): Promise<CourseDetailResponse> {
    try {
      const response = await api.get<CourseDetailResponse>(`/user/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course detail:", error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await api.delete(`/user/courses/${courseId}`);
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  async unenrollFromCourse(courseId: string, userId: string): Promise<void> {
    try {
      await api.post(`/user/unenroll-course`, {
        courseId,
        userId
      });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      throw error;
    }
  },

  async uploadFile(fileToUpload: File): Promise<CourseFileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('fileToUpload', fileToUpload);
      
      const response = await api.post<CourseFileUploadResponse>(
        '/common/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  async addFileToCourse(courseId: string, payload: CourseFilePayload): Promise<any> {
    try {
      const response = await api.post(`/user/files/${courseId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error adding file to course:", error);
      throw error;
    }
  },
  
  async deleteFile(fileId: string): Promise<void> {
    try {
      await api.delete(`/user/files/${fileId}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  async generateCourse(payload: FormData): Promise<GenerateCourseResponse> {
    try {
      const response = await api.post<GenerateCourseResponse>('/user/generate-courses', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error generating course:", error);
      throw error;
    }
  },

  async addSlide(classId: string, slideData: AddSlidePayload): Promise<any> {
    try {
      const response = await api.post(`/user/class/${classId}/slide`, slideData);
      return response.data;
    } catch (error) {
      console.error("Error adding slide:", error);
      throw error;
    }
  },

  async updateSlide(slideId: string, slideData: UpdateSlidePayload): Promise<any> {
    try {
      const response = await api.put(`/user/slide/${slideId}`, slideData);
      return response.data;
    } catch (error) {
      console.error("Error updating slide:", error);
      throw error;
    }
  },

  // Add this new function for updating class details
  async updateClassDetails(classId: string, payload: UpdateClassPayload): Promise<any> {
    try {
      const response = await api.put(`/user/class/${classId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating class details:", error);
      throw error;
    }
  },

  // New function to get course for edit
  async getCourseForEdit(courseId: string): Promise<CourseResponse> {
    try {
      const response = await api.get<CourseResponse>(`/user/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course for edit:", error);
      throw error;
    }
  },

  // Function to get enrolled users for a course
  async getCourseEnrolledUsers(courseId: string): Promise<CourseEnrolledResponse[]> {
    try {
      const response = await api.get(`/user/course-enrolled-users/${courseId}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
      return [];
    }
  },

  async publishCourse(courseId: string): Promise<any> {
    try {
      const payload: PublishCoursePayload = { isPublished: true };
      const response = await api.put(`/user/courses/${courseId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error publishing course:", error);
      throw error;
    }
  },

  async getCourseAssignments(courseId: string): Promise<Assignment[]> {
    try {
      const response = await api.get(`/user/assignments/${courseId}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching course assignments:", error);
      return [];
    }
  },

  async createAssignment(courseId: string, assignmentData: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    try {
      const response = await api.post(`/user/assignments/${courseId}`, assignmentData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  async updateAssignment(assignmentId: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    try {
      const response = await api.put(`/user/assignments/${assignmentId}`, assignmentData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },

  async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await api.delete(`/user/assignments/${assignmentId}`);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  },
};
