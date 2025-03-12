import axios from "axios";
import { toast } from "sonner";

// const API_BASE_URL = 'https://lms-backend-l6o9.onrender.com/api/v_1/internal';
const API_BASE_URL = "http://localhost:8000/api/v_1/internal";

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
	(response) => response,
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

export default api;
