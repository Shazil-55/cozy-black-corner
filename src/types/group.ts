
export interface Group {
  id: string;
  name: string;
  description: string;
  courseIds?: string[];
  userIds?: string[];
  createdAt: string;
  creatorId?: string;
  creatorName?: string;
  updatedAt?: string;
  
}

export interface GroupFile {
  id: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}
