
import React, { useState } from "react";
import { Search, Filter, Eye, FileText, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AssignmentReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    completionRate: "0.0%",
    completedLearners: 0,
    learnersInProgress: 1,
    learnersNotPassed: 0,
    learnersNotStarted: 0,
    trainingTime: "1m"
  };

  const mockAssignments = [
    {
      id: "1",
      name: "React Components Assignment",
      courseName: "Web Development",
      dueDate: "2024-01-15",
      submissions: 23,
      status: "active"
    },
    {
      id: "2",
      name: "Database Design Project", 
      courseName: "Database Systems",
      dueDate: "2024-01-20",
      submissions: 18,
      status: "active"
    }
  ];

  const filteredAssignments = mockAssignments.filter(assignment =>
    assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignment reports</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.completionRate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion rate
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.completedLearners}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Completed learners
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {stats.learnersInProgress}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Learners in progress
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {stats.learnersNotPassed}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                Learners not passed
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                {stats.learnersNotStarted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Learners not started
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {stats.trainingTime}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Training time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assignments..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Assignments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">{assignment.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{assignment.courseName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {assignment.submissions}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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

export default AssignmentReports;
