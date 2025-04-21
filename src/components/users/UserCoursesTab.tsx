
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface UserCoursesTabProps {
  userId: string;
}

export const UserCoursesTab: React.FC<UserCoursesTabProps> = ({ userId }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">Enrolled Courses</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll to course
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-14">
            <h3 className="text-lg font-semibold mb-1 text-gray-900">No enrolled courses</h3>
            <CardDescription className="text-center mb-4 max-w-md">
              Assign courses to this user from the available list or click below to enroll directly.
            </CardDescription>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Enroll to course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
