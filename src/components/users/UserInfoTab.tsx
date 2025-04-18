
import React from "react";
import { ApiUser } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface UserInfoTabProps {
  user: ApiUser;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const registrationDate = new Date(user.registrationDate);
  const timeAgo = formatDistanceToNow(registrationDate, { addSuffix: true });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
              <p className="text-base">{user.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
              <p className="text-base">{user.role}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <Badge 
                variant={user.status === "Active" ? "default" : "outline"}
                className={user.status === "Active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                }
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Registration Date</h4>
              <p className="text-base">{new Intl.DateTimeFormat('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).format(registrationDate)} ({timeAgo})</p>
            </div>
            
            {user.role === "Learner" && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Parent</h4>
                <p className="text-base">{user.parentName || "No parent assigned"}</p>
              </div>
            )}
            
            {/* Additional account details can be added here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
