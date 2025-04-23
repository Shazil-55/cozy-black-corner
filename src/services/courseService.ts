
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
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		userId: string;
		modules: ModuleData[];
	};
}

export interface SlideData {
	id: string;
	title: string;
	slideNo: number;
	visualPrompt: string;
	voiceoverScript: string;
	imageUrl: string | null;
	content: string;
	example: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizQuestion {
	id: string;
	question: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizQuestionWithOptions {
	id: number;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	classId: number;
	createdAt: string;
	updatedAt: string;
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

// Course user enrollment interfaces
export interface CourseUser {
	id: string;
	userId: string;
	name: string;
	email: string;
	role: "learner" | "instructor";
	progress: number;
	enrollmentDate: string;
	completionDate: string | null;
	expirationDate: string | null;
}

export interface CourseFile {
	id: string;
	name: string;
	type: string;
	size: number;
	uploadedBy: string;
	uploadedAt: string;
	url: string;
}

export interface CourseGroup {
	id: string;
	name: string;
	description: string;
	memberCount: number;
	createdAt: string;
}

export interface EnrollmentRequest {
	userIds: string[];
	role: string;
}

export const courseService = {
	async getCourseDetails(courseId: string): Promise<CourseDetailsResponse> {
		try {
			const response = await api.get<CourseDetailsResponse>(
				`/user/course/${courseId}`
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching course details:", error);
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

	async submitQuizAnswers(payload: QuizSubmissionRequest): Promise<QuizSubmissionResponse> {
		try {
			const response = await api.post<QuizSubmissionResponse>(`/user/submit-quiz`, payload);
			return response.data;
		} catch (error) {
			console.error("Error submitting quiz answers:", error);
			throw error;
		}
	},
	
	// New methods for course users
	async getCourseUsers(courseId: string): Promise<CourseUser[]> {
		try {
			const response = await api.get(`/user/course/${courseId}/users`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching course users:", error);
			throw error;
		}
	},
	
	async enrollUsers(courseId: string, payload: EnrollmentRequest): Promise<any> {
		try {
			const response = await api.post(`/user/course/${courseId}/enroll`, payload);
			return response.data;
		} catch (error) {
			console.error("Error enrolling users:", error);
			throw error;
		}
	},
	
	async unenrollUser(courseId: string, userId: string): Promise<any> {
		try {
			const response = await api.delete(`/user/course/${courseId}/user/${userId}`);
			return response.data;
		} catch (error) {
			console.error("Error unenrolling user:", error);
			throw error;
		}
	},
	
	async updateUserRole(courseId: string, userId: string, role: string): Promise<any> {
		try {
			const response = await api.patch(`/user/course/${courseId}/user/${userId}`, { role });
			return response.data;
		} catch (error) {
			console.error("Error updating user role:", error);
			throw error;
		}
	},
	
	// Methods for course files
	async getCourseFiles(courseId: string): Promise<CourseFile[]> {
		try {
			const response = await api.get(`/user/course/${courseId}/files`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching course files:", error);
			throw error;
		}
	},
	
	async uploadCourseFile(courseId: string, file: File): Promise<any> {
		try {
			const formData = new FormData();
			formData.append('file', file);
			
			const response = await api.post(`/user/course/${courseId}/files`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			return response.data;
		} catch (error) {
			console.error("Error uploading course file:", error);
			throw error;
		}
	},
	
	async deleteCourseFile(courseId: string, fileId: string): Promise<any> {
		try {
			const response = await api.delete(`/user/course/${courseId}/file/${fileId}`);
			return response.data;
		} catch (error) {
			console.error("Error deleting course file:", error);
			throw error;
		}
	},
	
	// Methods for course groups
	async getCourseGroups(courseId: string): Promise<CourseGroup[]> {
		try {
			const response = await api.get(`/user/course/${courseId}/groups`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching course groups:", error);
			throw error;
		}
	},
	
	async createCourseGroup(courseId: string, name: string, description: string): Promise<any> {
		try {
			const response = await api.post(`/user/course/${courseId}/groups`, { name, description });
			return response.data;
		} catch (error) {
			console.error("Error creating course group:", error);
			throw error;
		}
	},
	
	async deleteCourse(courseId: string): Promise<any> {
		try {
			const response = await api.delete(`/user/course/${courseId}`);
			return response.data;
		} catch (error) {
			console.error("Error deleting course:", error);
			throw error;
		}
	}
};
