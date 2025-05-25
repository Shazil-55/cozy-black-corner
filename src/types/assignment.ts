
export interface Assignment {
  id: string;
  creatorId: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string; // ISO date string (can be parsed to Date)
  classNumbers: string[] | null;
  isAiGenerated: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  published: boolean;
  totalMarks: number;
  courseName: string;
  totalSubmissions: string; // note: this is a string even though it's a count
  status: string;
}

export interface AssignmentResponse {
  data: Assignment[];
}

export interface AssignmentSubmissionResponse {
  id: string;
  assignmentId: string;
  courseId: string;
  userId: string;
  isSubmitted: boolean;
  submittedAt?: string;
  obtainMarks?: number;
  feedback?: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  studentProfileImage?: string;
  status: 'graded' | 'late' | 'submitted' | 'not submitted';
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentDetail {
  id: string;
  creatorId: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: string;
  classNumbers: string[];
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  totalMarks: number;
  submissions: AssignmentSubmissionResponse[];
}

export interface AssignmentDetailResponse {
  data: AssignmentDetail;
}
