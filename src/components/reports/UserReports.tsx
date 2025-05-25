
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Eye, Users, Clock, BookOpen, Award } from "lucide-react";
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
import { userService } from "@/services/userService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const UserReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });

  // Calculate stats from users data
  const stats = React.useMemo(() => {
    if (!users) return {
      completionRate: "0.0%",
      completedCourses: 0,
      coursesInProgress: 1,
      coursesNotPassed: 0,
      coursesNotStarted: 0,
      trainingTime: "1m"
    };

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    
    return {
      completionRate: totalUsers > 0 ? `${((activeUsers / totalUsers) * 100).toFixed(1)}%` : "0.0%",
      completedCourses: activeUsers,
      coursesInProgress: Math.max(1, totalUsers - activeUsers),
      coursesNotPassed: 0,
      coursesNotStarted: 0,
      trainingTime: `${totalUsers}m`
    };
  }, [users]);

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading user reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User reports</h1>
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
                Active rate
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.completedCourses}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Active users
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {stats.coursesInProgress}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Inactive users
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {stats.coursesNotPassed}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                Courses not passed
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                {stats.coursesNotStarted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Courses not started
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
            <Users className="h-5 w-5" />
            User Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>User type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Assigned courses</TableHead>
                  <TableHead>Completed courses</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">-</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">-</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">-</span>
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found
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

export default UserReports;
