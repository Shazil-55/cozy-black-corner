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
	name: string;
	description: string;
	category: string;
	price?: number;
	createdAt: string;
	updatedAt: string;
}

export interface CourseDetail extends Course {
	users: CourseUser[];
	files: CourseFile[];
	groups: CourseGroup[];
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

	async getCourses(): Promise<Course[]> {
		try {
			// In a real app this would call the API
			// For now, simulate with mock data similar to getCourseDetail
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve([
						{
							id: "course-1",
							name: "Introduction to Programming",
							description: "Learn the fundamentals of programming",
							category: "Computer Science",
							price: 99.99,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
						{
							id: "course-2",
							name: "Advanced Web Development",
							description: "Master modern web development techniques",
							category: "Web Development",
							price: 149.99,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
						{
							id: "course-3",
							name: "Data Science Fundamentals",
							description: "Learn the basics of data analysis",
							category: "Data Science",
							price: 129.99,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
						{
							id: "course-4",
							name: "UI/UX Design Principles",
							description: "Create beautiful and functional interfaces",
							category: "Design",
							price: 89.99,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						}
					]);
				}, 500);
			});
		} catch (error) {
			console.error("Error fetching courses:", error);
			throw error;
		}
	},

	async getCourseDetail(courseId: string): Promise<CourseDetail> {
		try {
			// This would be a real API call in a production application
			// For now, simulate with mock data
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						id: courseId,
						name: "Introduction to Programming",
						description: "Learn the fundamentals of programming with this comprehensive course",
						category: "Computer Science",
						price: 99.99,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						users: Array(5).fill(0).map((_, i) => ({
							id: `user-${i + 1}`,
							name: `User ${i + 1}`,
							role: i % 3 === 0 ? "instructor" : "learner",
							email: `user${i + 1}@example.com`,
							enrollmentDate: new Date().toISOString(),
							completionDate: i % 4 === 0 ? new Date().toISOString() : null,
							expirationDate: null,
							progress: Math.floor(Math.random() * 100)
						})),
						files: Array(3).fill(0).map((_, i) => ({
							id: `file-${i + 1}`,
							name: `Course Material ${i + 1}.pdf`,
							type: "application/pdf",
							size: 1024 * 1024 * (i + 1),
							url: "#",
							uploadedBy: "Admin User",
							uploadedAt: new Date().toISOString()
						})),
						groups: Array(2).fill(0).map((_, i) => ({
							id: `group-${i + 1}`,
							name: `Study Group ${i + 1}`,
							description: `A study group for the course`,
							membersCount: i + 5,
							createdAt: new Date().toISOString()
						}))
					});
				}, 500);
			});
		} catch (error) {
			console.error("Error fetching course detail:", error);
			throw error;
		}
	},

	async enrollUserToCourse(courseId: string, userId: string): Promise<void> {
		try {
			// This would be a real API call in a production application
			console.log(`Enrolling user ${userId} to course ${courseId}`);
			await new Promise(resolve => setTimeout(resolve, 500));
			return;
		} catch (error) {
			console.error("Error enrolling user to course:", error);
			throw error;
		}
	},

	async deleteCourse(courseId: string): Promise<void> {
		try {
			// Simulating an API call
			await new Promise(resolve => setTimeout(resolve, 500));
			console.log(`Deleting course ${courseId}`);
			return;
		} catch (error) {
			console.error("Error deleting course:", error);
			throw error;
		}
	}
};
