import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Users, 
  Eye,
  Edit,
  Search,
  Filter
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { GradingDialog } from "@/components/grading/GradingDialog";

interface AssignmentDetails {
  id: string;
  name: string;
  description: string;
  courseName: string;
  dueDate: string;
  totalMarks: number;
}

interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  submissionDate: string;
  grade: number | null;
  status: "submitted" | "graded" | "late" | "not_submitted";
  fileUrl?: string;
  feedback?: string;
}

// Mock data for assignment details
const mockAssignmentDetails: AssignmentDetails = {
  id: "1",
  name: "React Components Assignment",
  description: "Create a set of reusable React components including forms, buttons, and cards. Implement proper prop handling and state management.",
  courseName: "Web Development Fundamentals",
  dueDate: "2024-01-15",
  totalMarks: 100
};

// Updated mock data for student submissions with feedback
const mockSubmissions: StudentSubmission[] = [
  {
    id: "1",
    studentName: "Alice Johnson",
    studentId: "std001",
    submissionDate: "2024-01-14T10:30:00",
    grade: 85,
    status: "graded",
    fileUrl: "/submissions/alice-react-assignment.zip",
    feedback: "Great work on component structure! Your code is well-organized and follows React best practices. Minor improvement needed in error handling."
  },
  {
    id: "2",
    studentName: "Bob Smith",
    studentId: "std002",
    submissionDate: "2024-01-15T09:15:00",
    grade: null,
    status: "submitted",
    fileUrl: "/submissions/bob-react-assignment.zip",
    feedback: ""
  },
  {
    id: "3",
    studentName: "Carol Davis",
    studentId: "std003",
    submissionDate: "2024-01-16T14:20:00",
    grade: 78,
    status: "late",
    fileUrl: "/submissions/carol-react-assignment.zip",
    feedback: "Good effort, but submitted late. Some components could be optimized for better performance."
  },
  {
    id: "4",
    studentName: "David Wilson",
    studentId: "std004",
    submissionDate: "2024-01-13T16:45:00",
    grade: 92,
    status: "graded",
    fileUrl: "/submissions/david-react-assignment.zip",
    feedback: "Excellent implementation! Your code demonstrates advanced understanding of React concepts and clean architecture."
  },
  {
    id: "5",
    studentName: "Emma Brown",
    studentId: "std005",
    submissionDate: "",
    grade: null,
    status: "not_submitted",
    feedback: ""
  }
];

const AssignmentGrading: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [submissions, setSubmissions] = useState(mockSubmissions);

  const { data: assignmentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["assignment-details", assignmentId],
    queryFn: () => Promise.resolve(mockAssignmentDetails),
  });

  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["assignment-submissions", assignmentId],
    queryFn: () => Promise.resolve(submissions),
  });

  const isLoading = isLoadingDetails || isLoadingSubmissions;

  const filteredSubmissions = submissionsData?.filter(submission =>
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: StudentSubmission["status"]) => {
    const variants = {
      submitted: "outline",
      graded: "default",
      late: "destructive", 
      not_submitted: "secondary"
    } as const;

    const labels = {
      submitted: "Submitted",
      graded: "Graded",
      late: "Late",
      not_submitted: "Not Submitted"
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleGradeSubmission = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setGradingDialogOpen(true);
  };

  const handleSaveGrade = (grade: number, feedback: string) => {
    if (selectedSubmission) {
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, grade, feedback, status: "graded" as const }
            : sub
        )
      );
    }
  };

  const truncateFeedback = (feedback: string) => {
    if (feedback.length <= 100) return feedback;
    return feedback.substring(0, 100) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <LoadingSpinner message="Loading assignment details..." />
      </div>
    );
  }

  if (!assignmentDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Assignment Not Found</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The assignment you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/grading-hub">
            <Button variant="outline" className="mt-4">
              Back to Grading Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link 
              to="/grading-hub" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Grading Hub
              </div>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{assignmentDetails.name}</h1>
        </div>
      </div>

      {/* Assignment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Course:</span>
              <span>{assignmentDetails.courseName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due Date:</span>
              <span>{new Date(assignmentDetails.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Total Marks:</span>
              <span>{assignmentDetails.totalMarks}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Description:</h4>
            <p className="text-sm text-muted-foreground">{assignmentDetails.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{submission.studentId}</TableCell>
                      <TableCell>
                        {submission.submissionDate ? 
                          new Date(submission.submissionDate).toLocaleDateString() : 
                          "-"
                        }
                      </TableCell>
                      <TableCell>
                        {submission.grade !== null ? 
                          `${submission.grade}/${assignmentDetails.totalMarks}` : 
                          "-"
                        }
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {submission.feedback ? truncateFeedback(submission.feedback) : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => handleGradeSubmission(submission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Grade submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <GradingDialog
        isOpen={gradingDialogOpen}
        onClose={() => setGradingDialogOpen(false)}
        onSave={handleSaveGrade}
        studentName={selectedSubmission?.studentName || ""}
        totalMarks={assignmentDetails?.totalMarks || 100}
        currentGrade={selectedSubmission?.grade}
        currentFeedback={selectedSubmission?.feedback}
      />
    </div>
  );
};

export default AssignmentGrading;
