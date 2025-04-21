
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">User Groups</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add to group
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-14">
            <h3 className="text-lg font-semibold mb-1 text-gray-900">No Groups assigned</h3>
            <CardDescription className="text-center mb-4 max-w-md">
              Assign the user to an existing group or create a new group to manage access.
            </CardDescription>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add to group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
