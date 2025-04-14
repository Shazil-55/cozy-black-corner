
import { 
  Home, Users, LayoutGrid, Settings, HelpCircle, BookText, 
  Store, UsersRound, GitBranch, Zap, Bell, BarChart, 
  CalendarDays, Award, GraduationCap, School
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: any; // Lucide icon component
  url: string;
}

// Administrator Menu Items
export const adminMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Users", icon: Users, url: "/users" },
  { title: "Courses", icon: LayoutGrid, url: "/courses" },
  { title: "Course store", icon: Store, url: "/course-store" },
  { title: "Groups", icon: UsersRound, url: "/groups" },
  { title: "Branches", icon: GitBranch, url: "/branches" },
  { title: "Automations", icon: Zap, url: "/automations" },
  { title: "Notifications", icon: Bell, url: "/notifications" },
  { title: "Reports", icon: BarChart, url: "/reports" },
  { title: "Skills", icon: Award, url: "/skills" },
  { title: "Account & Settings", icon: Settings, url: "/settings" },
  { title: "Subscription", icon: BookText, url: "/subscription" },
  { title: "Help Center", icon: HelpCircle, url: "/help" }
];

// Instructor Menu Items
export const instructorMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/instructor-dashboard" },
  { title: "Courses", icon: LayoutGrid, url: "/courses" },
  { title: "Groups", icon: UsersRound, url: "/groups" },
  { title: "Grading Hub", icon: GraduationCap, url: "/grading-hub" },
  { title: "Conferences", icon: Users, url: "/conferences" },
  { title: "Reports", icon: BarChart, url: "/reports" },
  { title: "Calendar", icon: CalendarDays, url: "/calendar" },
  { title: "Skills", icon: Award, url: "/skills" }
];

// Learner Menu Items
export const learnerMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/learner-dashboard" },
  { title: "My courses", icon: GraduationCap, url: "/my-courses" },
  { title: "Course catalog", icon: School, url: "/course-catalog" },
  { title: "Calendar", icon: CalendarDays, url: "/calendar" },
  { title: "Skills", icon: Award, url: "/skills" }
];

export const getMenuItemsByRole = (role: string): MenuItem[] => {
  switch(role) {
    case 'instructor':
      return instructorMenuItems;
    case 'learner':
      return learnerMenuItems;
    case 'administrator':
    default:
      return adminMenuItems;
  }
};
