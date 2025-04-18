
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Enrolled Courses</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll to course
        </Button>
      </div>
      
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6">
              <img 
                src="/public/lovable-uploads/9478ac6d-69e2-405f-b0a2-08927fd2e899.png" 
                alt="No courses found" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">No results found</h3>
            <CardDescription className="text-center mb-6">
              Please try again with a different keyword or filter.
            </CardDescription>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Enroll to course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
