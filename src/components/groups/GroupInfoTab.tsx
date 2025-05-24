
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupInfo } from "@/services/groupService";

interface GroupInfoTabProps {
  group: GroupInfo;
}

export const GroupInfoTab: React.FC<GroupInfoTabProps> = ({ group }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Group Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{group.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{group.description || "No description available"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p>{group.creatorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{new Date(group.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Group Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{group.memberCount}</Badge>
                  <p>users</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Courses</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{group.courseCount}</Badge>
                  <p>courses</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
