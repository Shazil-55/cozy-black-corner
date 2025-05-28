
import { 
  Home, Users, LayoutGrid, Settings, HelpCircle, BookText, 
  Store, UsersRound, GitBranch, Zap, Bell, BarChart, 
  CalendarDays, Award, GraduationCap, School
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: any; // Lucide icon component
  url: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  adminOnly?: boolean; // New property to mark admin-only items
}

export interface DropdownItem {
  title: string;
  url: string;
}

// Administrator Menu Items
export const adminMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Users", icon: Users, url: "/users", adminOnly: true },
  { title: "Courses", icon: LayoutGrid, url: "/courses" },
  { title: "Course store", icon: Store, url: "/course-store", adminOnly: true },
  { title: "Categories", icon: LayoutGrid, url: "/categories", adminOnly: true },
  { title: "Groups", icon: UsersRound, url: "/groups" },
  { 
    title: "Reports", 
    icon: BarChart, 
    url: "/reports",
    hasDropdown: true,
    adminOnly: true,
    dropdownItems: [
      { title: "Course Reports", url: "/reports/courses" },
      { title: "Group Reports", url: "/reports/groups" },
      { title: "User Reports", url: "/reports/users" },
      { title: "Category Reports", url: "/reports/categories" }
    ]
  },
  { title: "Account & Settings", icon: Settings, url: "/settings" },
  { title: "Subscription", icon: BookText, url: "/subscription", adminOnly: true },
  { title: "Help Center", icon: HelpCircle, url: "/help" }
];

// Instructor Menu Items
export const instructorMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/instructor-dashboard" },
  { title: "Courses", icon: LayoutGrid, url: "/courses" },
  { title: "Groups", icon: UsersRound, url: "/groups" },
  { title: "Grading Hub", icon: GraduationCap, url: "/grading-hub" },
  { title: "Conferences", icon: Users, url: "/conferences" },
  { 
    title: "Reports", 
    icon: BarChart, 
    url: "/reports",
    hasDropdown: true,
    dropdownItems: [
      { title: "Course Reports", url: "/reports/courses" },
      { title: "Student Reports", url: "/reports/students" },
      { title: "Assignment Reports", url: "/reports/assignments" }
    ]
  },
  { title: "Calendar", icon: CalendarDays, url: "/calendar" },
];

// Learner Menu Items
export const learnerMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/learner-dashboard" },
  { title: "My courses", icon: GraduationCap, url: "/my-courses" },
  { title: "Course catalog", icon: School, url: "/course-catalog" },
  { title: "Calendar", icon: CalendarDays, url: "/calendar" },
];

// Parent Menu Items
export const parentMenuItems: MenuItem[] = [
  { title: "Home", icon: Home, url: "/parent-dashboard" },
  { title: "Children", icon: Users, url: "/my-children" },
  { title: "Calendar", icon: CalendarDays, url: "/calendar" }
];

export const getMenuItemsByRole = (role: string, userRole?: string): MenuItem[] => {
  const isActualAdmin = userRole === 'Administrator';
  
  switch(role) {
    case 'instructor':
      return instructorMenuItems;
    case 'learner':
      return learnerMenuItems;
    case 'parent':
      return parentMenuItems;
    case 'administrator':
    default:
      // Filter admin-only items if user is not actually an admin
      if (!isActualAdmin && role === 'administrator') {
        return adminMenuItems.filter(item => !item.adminOnly);
      }
      return adminMenuItems;
  }
};
