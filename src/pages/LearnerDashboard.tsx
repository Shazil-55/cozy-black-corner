import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, GraduationCap, Clock, Calendar, FileCheck, ChevronRight } from "lucide-react";
import { UserPlus } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { userService } from "@/services/userService";
import { UserRoles, LearnerDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

const LearnerDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: dashboardData, isLoading: isDashboardLoading, error } = useQuery({
    queryKey: ['dashboardData', 'learner'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Learner),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const learnerData = dashboardData?.data as LearnerDashboardData | undefined;

  const handleAddParent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await userService.createParent({
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        learnerIds: [user.id]
      });
      
      toast.success("Parent successfully added!", {
        description: "Your parent can now access your academic progress.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add parent", {
        description: error.message || "An error occurred while adding the parent.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDashboardLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator className="bg-indigo-100 dark:bg-indigo-800" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-800 dark:text-indigo-300">
            Hello, {firstName}! 👋
          </h2>
        </div>
        <Separator className="bg-indigo-100 dark:bg-indigo-800" />
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error loading dashboard data</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-indigo-800 dark:text-indigo-300">
          Hello, {firstName}! 👋
        </h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <UserPlus className="h-4 w-4" />
          Add Parent
        </Button>
      </div>
      <Separator className="bg-indigo-100 dark:bg-indigo-800" />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Parent</DialogTitle>
            <DialogDescription>
              Adding a parent will allow them to monitor your academic progress and performance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddParent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentName" className="text-right">
                  Name
                </Label>
                <Input
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentPhone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Parent"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearnerDashboard;
