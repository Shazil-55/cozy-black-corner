
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
  type: string;
  bio?: string;
  status: "active" | "inactive";
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

  // New functions for user management
  getAllUsers: async (): Promise<any> => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (payload: CreateUserPayload): Promise<any> => {
    try {
      const response = await api.post('/users', payload);
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
};
