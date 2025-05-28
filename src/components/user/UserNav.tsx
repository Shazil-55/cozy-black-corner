
import { LogOut, User, Settings, HelpCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRole, UserRole } from "@/context/RoleContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, logout } = useAuth();
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleChange = (newRole: string) => {
    const userRole = newRole as UserRole;
    setRole(userRole);
    
    // Navigate to the appropriate dashboard based on role
    if (userRole === 'administrator') {
      navigate('/');
    } else if (userRole === 'instructor') {
      navigate('/instructor-dashboard');
    } else if (userRole === 'learner') {
      navigate('/learner-dashboard');
    }
    
    toast.success(`Switched to ${userRole} role`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Check if user is admin to show role switching
  const isAdmin = user?.role === 'Administrator' || role === 'administrator';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            {user?.profileImage ? (
              <AvatarImage 
                src={user.profileImage} 
                alt={user?.name || "User avatar"} 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Only show role switching for administrators */}
        {isAdmin && (
          <>
            <div className="p-2">
              <p className="text-sm font-medium mb-2 px-2">Switch role</p>
              <RadioGroup value={role} onValueChange={handleRoleChange} className="space-y-1">
                <div className={cn(
                  "flex items-center space-x-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent",
                  role === "administrator" && "bg-blue-50 dark:bg-blue-900/20"
                )}>
                  <RadioGroupItem value="administrator" id="administrator" />
                  <label htmlFor="administrator" className="text-sm cursor-pointer flex-1">
                    Administrator
                  </label>
                </div>
                
                <div className={cn(
                  "flex items-center space-x-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent",
                  role === "instructor" && "bg-blue-50 dark:bg-blue-900/20"
                )}>
                  <RadioGroupItem value="instructor" id="instructor" />
                  <label htmlFor="instructor" className="text-sm cursor-pointer flex-1">
                    Instructor
                  </label>
                </div>
                
                <div className={cn(
                  "flex items-center space-x-2 rounded-md px-2 py-1.5 cursor-pointer hover:bg-accent",
                  role === "learner" && "bg-blue-50 dark:bg-blue-900/20"
                )}>
                  <RadioGroupItem value="learner" id="learner" />
                  <label htmlFor="learner" className="text-sm cursor-pointer flex-1">
                    Learner
                  </label>
                </div>
              </RadioGroup>
            </div>
            
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>My profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
