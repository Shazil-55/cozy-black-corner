
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Calendar, 
  GraduationCap, 
  Users,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { assignmentService } from "@/services/assignmentService";
import { Assignment } from "@/types/assignment";

const GradingHub: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assignmentsResponse, isLoading, error } = useQuery({
    queryKey: ["instructor-assignments"],
    queryFn: assignmentService.getInstructorAssignments,
  });

  const assignments = assignmentsResponse?.data || [];

  const filteredAssignments = assignments.filter((assignment: Assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === "ongoing") {
      return <Badge variant="default">Ongoing</Badge>;
    } else if (statusLower === "overdue") {
      return <Badge variant="destructive">Overdue</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAssignmentClick = (assignmentId: string) => {
    navigate(`/grading-hub/assignment/${assignmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <LoadingSpinner message="Loading assignments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Error loading assignments
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Failed to fetch assignments. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grading Hub</h1>
          <p className="text-muted-foreground">
            Review and grade student assignments across all your courses
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Assignments
          </CardTitle>
          <CardDescription>
            Click on any assignment to view student submissions and grade them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assignments or courses..." 
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
                  <TableHead>Assignment Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment: Assignment) => (
                    <TableRow 
                      key={assignment.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleAssignmentClick(assignment.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {assignment.title}
                        </div>
                      </TableCell>
                      <TableCell>{assignment.courseName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{assignment.totalMarks}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {assignment.totalSubmissions}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No assignments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingHub;
