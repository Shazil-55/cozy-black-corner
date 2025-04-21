
import React from "react";
import { ApiUser } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface UserInfoTabProps {
  user: ApiUser;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  // Safely parse the date and provide a fallback for invalid dates
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (!isValid(date)) {
        return "Invalid date";
      }
      
      const formattedDate = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
      
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      
      return `${formattedDate} (${timeAgo})`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <Button className="ml-auto" variant="default">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
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
              <p className="text-base">{formatDate(user.registrationDate)}</p>
            </div>
            
            {user.role === "Learner" && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Parent</h4>
                <p className="text-base">{user.parentName || "No parent assigned"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

