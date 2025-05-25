
import api from "./api";

export const courseStoreService = {
  // Fetch course store data
  fetchCourseStore: async () => {
    try {
      const response = await api.get('/user/course-store');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course store data:', error);
      throw error;
    }
  }
};
