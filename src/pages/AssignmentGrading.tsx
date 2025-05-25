
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
import { assignmentService, AssignmentSubmissionResponse } from "@/services/assignmentService";

const AssignmentGrading: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissionResponse | null>(null);

  const { data: assignmentData, isLoading, error } = useQuery({
    queryKey: ["assignment-details", assignmentId],
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId!),
    enabled: !!assignmentId,
  });

  const assignmentDetails = assignmentData?.data;
  const submissions = assignmentDetails?.submissions || [];

  const filteredSubmissions = submissions.filter((submission: AssignmentSubmissionResponse) =>
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AssignmentSubmissionResponse["status"]) => {
    const variants = {
      submitted: "outline",
      graded: "default",
      late: "destructive", 
      "not submitted": "secondary"
    } as const;

    const labels = {
      submitted: "Submitted",
      graded: "Graded",
      late: "Late",
      "not submitted": "Not Submitted"
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleGradeSubmission = (submission: AssignmentSubmissionResponse) => {
    setSelectedSubmission(submission);
    setGradingDialogOpen(true);
  };

  const handleSaveGrade = (grade: number, feedback: string) => {
    // Handle grade saving logic here
    console.log('Saving grade:', grade, 'Feedback:', feedback);
  };

  const truncateFeedback = (feedback: string) => {
    if (feedback && feedback.length <= 100) return feedback;
    return feedback ? feedback.substring(0, 100) + "..." : "-";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <LoadingSpinner message="Loading assignment details..." />
      </div>
    );
  }

  if (error || !assignmentDetails) {
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
          <h1 className="text-2xl font-bold tracking-tight">{assignmentDetails.title}</h1>
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
              <span>{assignmentDetails.courseId}</span>
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
                  <TableHead>Student Email</TableHead>
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
                      <TableCell>{submission.studentEmail}</TableCell>
                      <TableCell>
                        {submission.submittedAt ? 
                          new Date(submission.submittedAt).toLocaleDateString() : 
                          "-"
                        }
                      </TableCell>
                      <TableCell>
                        {submission.obtainMarks !== undefined ? 
                          `${submission.obtainMarks}/${assignmentDetails.totalMarks}` : 
                          "-"
                        }
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {truncateFeedback(submission.feedback || "")}
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
        currentGrade={selectedSubmission?.obtainMarks}
        currentFeedback={selectedSubmission?.feedback}
      />
    </div>
  );
};

export default AssignmentGrading;
