
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollCoursesDialog } from "@/components/courses/EnrollCoursesDialog";

interface UserCoursesTabProps {
  userId: string;
}

export const UserCoursesTab: React.FC<UserCoursesTabProps> = ({ userId }) => {
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const handleCourseEnrollment = () => {
    setIsEnrollDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">Enrolled Courses</h2>
        <Button onClick={() => setIsEnrollDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll to course
        </Button>
      </div>
      
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-14">
            <h3 className="text-lg font-semibold mb-1 text-gray-900">No enrolled courses</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
              Enroll this user in courses from the available list.
            </p>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Enroll to course
            </Button>
          </div>
        </CardContent>
      </Card>

      <EnrollCoursesDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        userId={userId}
        onEnrollment={handleCourseEnrollment}
      />
    </div>
  );
};
