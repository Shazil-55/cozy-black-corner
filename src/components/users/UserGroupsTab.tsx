
import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Group {
  id: string;
  courseId: string;
  groupName: string;
  description: string;
  groupCreatorId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserGroupsTabProps {
  userId: string;
  groups: Group[];
}

export const UserGroupsTab: React.FC<UserGroupsTabProps> = ({ userId, groups }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">User Groups</h2>
      </div>
      
      <Card>
        <CardContent>
          {groups && groups.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Course ID</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow 
                    key={group.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{group.groupName}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>{group.courseId}</TableCell>
                    <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-14">
              <Users className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1 text-gray-900">No groups assigned</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                This user is not a member of any groups yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
