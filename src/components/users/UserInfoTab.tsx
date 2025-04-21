
import React, { useState } from "react";
import { ApiUser } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { userService } from "@/services/userService";

// Give the ability to edit user's name, email, role, and status
interface UserInfoTabProps {
  user: ApiUser;
  // Optionally trigger a refetch after update
  onUserUpdated?: (partial: Partial<ApiUser>) => void;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user, onUserUpdated }) => {
  // Local edit state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
  const [saving, setSaving] = useState(false);

  // Safely parse the date and provide a fallback for invalid dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
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

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user by id, only pass editable fields
      await userService.updateUserById(user.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });
      toast.success("User updated successfully!");
      setEditMode(false);
      if (onUserUpdated) onUserUpdated(formData);
    } catch (error: any) {
      toast.error("Failed to update user", { description: error?.message });
    }
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
          <CardTitle className="text-lg">Basic Information</CardTitle>
          {!editMode && (
            <Button className="ml-auto" variant="default" onClick={handleEditToggle}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
              {editMode ? (
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-base"
                  autoFocus
                  required
                />
              ) : (
                <p className="text-base">{user.name}</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              {editMode ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-base"
                  required
                />
              ) : (
                <p className="text-base">{user.email}</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
              {editMode ? (
                <Input
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="text-base"
                  required
                />
              ) : (
                <p className="text-base">{user.role}</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              {editMode ? (
                <Input
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="text-base"
                  required
                />
              ) : (
                <Badge 
                  variant={user.status === "Active" ? "default" : "outline"}
                  className={user.status === "Active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                  }
                >
                  {user.status}
                </Badge>
              )}
            </div>
          </div>
          {editMode && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleEditToggle} disabled={saving}>Cancel</Button>
              <Button variant="default" onClick={handleSave} disabled={saving}>
                {saving ? <Loader className="animate-spin w-4 h-4 mr-2" /> : null}
                Save
              </Button>
            </div>
          )}
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
