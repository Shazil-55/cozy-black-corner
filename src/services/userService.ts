
import api from './api';
import { z } from 'zod';

// Define schema for user update
export const UpdateUserSchema = z.object({ 
  name: z.string().optional(), 
  password: z.string().optional(), 
  username: z.string().optional(), 
  mainGoal: z.array(z.string()).optional(), 
  portalUsers: z.string().optional(), 
  industry: z.string().optional(), 
  profileImage: z.string().optional(), 
  bio: z.string().optional(),
});

export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  username?: string;
  role: string;
  bio?: string;
  status: "Active" | "Inactive";
}

export interface CreateParentPayload {
  name: string;
  email: string;
  phone?: string;
  learnerIds: string[];
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  registrationDate: string;
  parentName?: string;
  parentId?: string;
}

export const userService = {
  updateUser: async (payload: UpdateUserPayload): Promise<any> => {
    try {
      const response = await api.put('/user', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUser: async (): Promise<any> => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async (): Promise<ApiUser[]> => {
    try {
      const response = await api.get('/administrator/users');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (payload: CreateUserPayload): Promise<any> => {
    try {
      const response = await api.post('/administrator/user', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userId: string): Promise<any> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (userId: string, payload: Partial<CreateUserPayload>): Promise<any> => {
    try {
      const response = await api.put(`/users/${userId}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId: string): Promise<any> => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addParentName: async (userId: string, parentName: string): Promise<any> => {
    try {
      const response = await api.put(`/users/${userId}/parent`, { parentName });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // New functions for parent management
  createParent: async (parentData: CreateParentPayload): Promise<any> => {
    try {
      const response = await api.post('/administrator/parent', parentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLearnersByParentId: async (parentId: string): Promise<ApiUser[]> => {
    try {
      const response = await api.get(`/administrator/parent/${parentId}/learners`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  assignLearnerToParent: async (parentId: string, learnerId: string): Promise<any> => {
    try {
      const response = await api.post(`/administrator/parent/${parentId}/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  removeLearnerFromParent: async (parentId: string, learnerId: string): Promise<any> => {
    try {
      const response = await api.delete(`/administrator/parent/${parentId}/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getAllParents: async (): Promise<ApiUser[]> => {
    try {
      const response = await api.get('/administrator/parents');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};
