
export enum UserRoles {
  User = 'User',
  SuperAdmin = 'SuperAdmin',
  Parent = 'Parent',
  Administrator = 'Administrator',
  Instructor = 'Instructor',
  Learner = 'Learner',
}

export interface AdminDashboardData {
  totalCourses: number;
  activeUsers: number;
  courseCompletion: number;
  activityRate: number;
  totalUsers: number;
  adminUsers: number;
  instructorUsers: number;
  learners: number;
}

export interface InstructorDashboardData {
  myCourses: number;
  activeStudents: number;
  assignments: number;
  avgGrade: number;
  assignmentsList: Array<{
    assignmentName: string;
    totalSubmissions: string;
  }>;
}

export interface LearnerDashboardData {
  completedCourses: number;
  activeCourses: number;
  certificates: number;
  avgGrade: number;
  assignmentDeadlines: Array<{
    assignmentName: string;
    submissionDate: string;
    isSubmitted: boolean;
  }>;
  coursesInProgress: Array<{
    courseName: string;
    instructorName: string;
    completedPercentage: number;
    totalHoursLeft: number;
  }>;
  recommendedCourses: Array<{
    courseName: string;
    ratings: number;
    reviews: number;
  }>;
}

export type DashboardResponse = AdminDashboardData | InstructorDashboardData | LearnerDashboardData | null;

export interface ApiResponse<T> {
  data: T;
}
