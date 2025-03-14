import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Slide Types
export interface Slide {
	id: string;
	title: string;
	slideNo: number;
	visualPrompt: string;
	voiceoverScript: string;
	imageUrl?: string | null;
	content: string;
	example: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface SlideData {
	id: string;
	title: string;
	slideNo: number;
	visualPrompt: string;
	voiceoverScript: string;
	imageUrl?: string | null;
	content: string;
	example: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

// FAQ Types
export interface FAQ {
	id: string;
	question: string;
	answer: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

// UserTest Types
export interface UserTest {
	id: string;
	title: string;
	description: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

// Quiz Question Types
export interface QuizQuestionWithOptions {
	id: number;
	question: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	correctAnswer: string;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

// Quiz Answer Types
export interface QuizAnswer {
  id: string;
  optionMarked: string;
}

// Quiz Submission Request Type
export interface QuizSubmissionRequest {
  classId: string;
  answers: QuizAnswer[];
}

// Quiz Submission Response Type
export interface QuizSubmissionResponse {
  success: boolean;
  message: string;
  score: number;
}

// Course Types
export interface Course {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
}

// Class Details Type
export interface ClassDetails {
  id: string;
  title: string;
  classNo: number;
  concepts: string[];
  moduleId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  slides: SlideData[];
  faqs: FAQ[];
  userTest?: UserTest;
}

const getSlides = async (classId: string): Promise<SlideData[]> => {
	try {
		const response = await api.get(`/internal/user/class/${classId}/slides`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching slides:", error);
		throw error;
	}
};

const getFAQs = async (classId: string): Promise<FAQ[]> => {
	try {
		const response = await api.get(`/internal/user/class/${classId}/faqs`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching FAQs:", error);
		throw error;
	}
};

const getUserTest = async (classId: string): Promise<UserTest | undefined> => {
	try {
		const response = await api.get(`/internal/user/class/${classId}/user-test`);
		return response.data.data[0]; // API returns an array, so take the first element
	} catch (error) {
		console.error("Error fetching user test:", error);
		return undefined; // Return undefined in case of an error
	}
};

const getQuizQuestions = async (classId: string): Promise<QuizQuestionWithOptions[]> => {
  try {
    const response = await api.get(`/internal/user/class/${classId}/quiz`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

const submitQuizAnswers = async (submission: QuizSubmissionRequest): Promise<{ data: QuizSubmissionResponse }> => {
  try {
    const response = await api.post(`/internal/user/quiz/submit`, submission);
    return response;
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    throw error;
  }
};

const getCourses = async (): Promise<Course[]> => {
	try {
		const response = await api.get(`/internal/user/courses`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching courses:", error);
		throw error;
	}
};

const getCourseDetails = async (courseId: string): Promise<Course> => {
	try {
		const response = await api.get(`/internal/user/course/${courseId}`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching course details:", error);
		throw error;
	}
};

const getClassDetails = async (classId: string): Promise<ClassDetails> => {
  try {
    const response = await api.get(`/internal/user/class/${classId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching class details:", error);
    throw error;
  }
};

export const courseService = {
	getSlides,
	getFAQs,
	getUserTest,
  	getQuizQuestions,
  	submitQuizAnswers,
	getCourses,
	getCourseDetails,
	getClassDetails,
};
