
import api from "./api";
import { Group, GroupFile } from "@/types/group";

export interface CreateGroupDto {
  name: string;
  description: string;
}

export interface UpdateGroupDto {
  type: 'files' | 'courses' | 'users' | 'info';
  name?: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number;
  fileName?: string;
  courseId?: string;
  courseType?: 'enrolled' | 'unenrolled';
  userId?: string;
  userType?: 'enrolled' | 'unenrolled';
}

export interface GroupDetailsResponse {
  groupInfo: GroupInfo | GroupInfo[];
  groupUsers: GroupUser[];
  groupCourses: GroupCourse[];
  groupFiles: GroupFileDetails[];
}

export interface GroupInfo extends Group {
  memberCount: number | string;
  courseCount: number | string;
}

export interface GroupUser {
  id: string;
  name: string;
  email: string;
  role: string;
  description?: string;
  createdAt: string;
  membersCount?: number | string;
  coursesCount?: number | string;
}

export interface GroupCourse {
  id: string;
  name: string;
  description: string;
}

export interface GroupFileDetails extends GroupFile {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  groupId: string;
}

export interface FileUploadResponse {
  data: {
    url: string;
    size: number;
    name: string;
    type: string;
  }
}

export const groupService = {
  getAllGroups: async (): Promise<Group[]> => {
    const response = await api.get("/user/groups");
    return response.data.data || [];
  },

  createGroup: async (groupData: CreateGroupDto): Promise<Group> => {
    const response = await api.post("/user/group", groupData);
    return response.data.data;
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await api.get(`/user/group/${groupId}`);
    return response.data.data;
  },

  getGroupDetails: async (groupId: string): Promise<GroupDetailsResponse> => {
    const response = await api.get(`/user/group-details/${groupId}`);
    return response.data.data;
  },

  updateGroup: async (groupId: string, groupData: UpdateGroupDto): Promise<Group> => {
    const response = await api.put(`/user/group/${groupId}`, groupData);
    return response.data.data;
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await api.delete(`/user/group/${groupId}`);
  },
  
  // File handling methods
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("fileToUpload", file);
    
    const response = await api.post("/common/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  },
  
  deleteGroupFile: async (fileId: string): Promise<void> => {
    await api.delete(`/user/file/${fileId}`);
  }
};
