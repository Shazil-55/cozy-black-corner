
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Eye, UsersRound, Calendar, BookOpen } from "lucide-react";
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
import { groupService } from "@/services/groupService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const GroupReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getAllGroups,
  });

  // Calculate stats from groups data
  const stats = React.useMemo(() => {
    if (!groups) return {
      completionRate: "0.0%",
      completedLearners: 0,
      learnersInProgress: 1,
      learnersNotPassed: 0,
      learnersNotStarted: 0,
      trainingTime: "1m"
    };

    const totalGroups = groups.length;
    
    return {
      completionRate: totalGroups > 0 ? `${(100).toFixed(1)}%` : "0.0%",
      completedLearners: totalGroups,
      learnersInProgress: Math.max(1, totalGroups),
      learnersNotPassed: 0,
      learnersNotStarted: 0,
      trainingTime: `${totalGroups}m`
    };
  }, [groups]);

  const filteredGroups = groups?.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading group reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group reports</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.completionRate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completion rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.completedLearners}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Completed learners
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.learnersInProgress}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Learners in progress
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.learnersNotPassed}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Learners not passed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.learnersNotStarted}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Learners not started
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.trainingTime}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Training time
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="h-5 w-5" />
            Group Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search groups..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Groups Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <UsersRound className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium">{group.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {group.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(group.createdAt).toLocaleDateString()}
                        </div>
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No groups found
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

export default GroupReports;
