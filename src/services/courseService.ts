
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
	optionMarked: string;
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
	};
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
};
