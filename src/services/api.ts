
import axios from "axios";
import { toast } from "sonner";

// Using the environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_PROD_URL || "https://dev-api.ilmee.ai/api/v_1/internal";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["access-token"] = token; // Updated to use 'access-token' as the header key
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const errorMessage = error.response?.data?.message || "An error occurred";
		console.error("API Error:", errorMessage);

		// Check if the error is an authentication issue
		if (error.response?.status === 401) {
			if (
				window.location.pathname !== "/login" &&
				window.location.pathname !== "/register"
			) {
				toast.error("Session expired. Please log in again.");
				// Clear local storage and reload the page to trigger a full logout
				localStorage.removeItem("token");
				localStorage.removeItem("refreshToken");
				localStorage.removeItem("user");
				setTimeout(() => {
					window.location.href = "/login";
				}, 1000);
			}
		}

		return Promise.reject(error);
	}
);

// Course Store API
export const fetchCourseStore = async () => {
  try {
    const response = await api.get('/user/course-store');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch course store data:', error);
    throw error;
  }
};

// File Upload API
export const uploadFile = async (fileToUpload: File) => {
  try {
    const formData = new FormData();
    formData.append('fileToUpload', fileToUpload);
    
    const response = await api.post(
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
    console.error('Failed to upload file:', error);
    throw error;
  }
};

// Assignment APIs
export const getAssignments = async (courseId: string) => {
  try {
    const response = await api.get(`/user/assignments/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    throw error;
  }
};

export const createAssignment = async (courseId: string, assignmentData: any) => {
  try {
    const response = await api.post(`/user/assignments/${courseId}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to create assignment:', error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId: string, assignmentData: any) => {
  try {
    const response = await api.put(`/user/assignments/${assignmentId}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to update assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    const response = await api.delete(`/user/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete assignment:', error);
    throw error;
  }
};

export default api;
