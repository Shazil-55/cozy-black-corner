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
};
