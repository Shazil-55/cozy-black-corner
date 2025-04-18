
import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface UserGroupsTabProps {
  userId: string;
}

export const UserGroupsTab: React.FC<UserGroupsTabProps> = ({ userId }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">User Groups</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add to group
        </Button>
      </div>
      
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-64 h-64 mb-6">
              <img 
                src="/public/lovable-uploads/d0dce0b2-4cdc-4f31-8b21-af4135017720.png" 
                alt="No groups found" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">There are no groups yet!</h3>
            <CardDescription className="text-center mb-6">
              Groups allow you to assign sets of courses to several users at once.
            </CardDescription>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add to group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
