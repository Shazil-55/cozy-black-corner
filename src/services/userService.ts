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

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  registrationDate: string;
  parentName?: string;
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

  addParentName: async (userId: string, parentName: string): Promise<any> => {
    try {
      const response = await api.put(`/users/${userId}/parent`, { parentName });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
