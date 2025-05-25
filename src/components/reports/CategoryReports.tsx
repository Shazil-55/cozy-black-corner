
import React, { useState } from "react";
import { Search, Filter, Eye, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CategoryReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    completionRate: "0.0%",
    completedLearners: 0,
    learnersInProgress: 1,
    learnersNotPassed: 0,
    learnersNotStarted: 0,
    trainingTime: "1m"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category reports</h1>
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
            <LayoutGrid className="h-5 w-5" />
            Category Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search categories..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Assigned learners</TableHead>
                  <TableHead>Completed learners</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryReports;
