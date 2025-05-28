
import React, { useState } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { getMenuItemsByRole } from "@/constants/menuItems";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { role } = useRole();
  const { user } = useAuth();

  // Get menu items based on role and user's actual role
  const items = getMenuItemsByRole(role, user?.role);

  const handleDropdownItemClick = (url: string) => {
    navigate(url);
  };

  return (
    <>
      {/* Mobile toggle button - fixed position */}
      {isMobile && (
        <Button 
          onClick={() => setOpenMobile(!openMobile)}
          className="fixed z-50 left-4 top-20 p-2 h-10 w-10 rounded-full bg-primary shadow-md text-white md:hidden flex items-center justify-center"
          size="icon"
          aria-label={openMobile ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup style={{marginTop:'75px'}}>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => {
                  const isActive = location.pathname === item.url;
                  
                  if (item.hasDropdown && item.dropdownItems) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton 
                              tooltip={item.title}
                              className={cn(
                                "transition-all duration-200 my-1 w-full justify-between group",
                               
                                "hover:bg-blue-50 dark:hover:bg-blue-900/30",
                                "hover:text-blue-700 dark:hover:text-blue-300",
                                "focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600",
                                "border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
                              )}
                            >
                              <div className="flex items-center">
                                <item.icon className={cn(
                                  "h-5 w-5 transition-colors",
                                  " dark:text-blue-400",
                                  " dark:group-hover:text-blue-300"
                                )} />
                                <span className={cn(
                                  "ml-2 font-medium", 
                                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                                )}>
                                  {item.title}
                                </span>
                              </div>
                              {!isCollapsed && (
                                <ChevronRight className={cn(
                                  "h-4 w-4 transition-transform",
                                  "text-gray-400 dark:group-hover:text-blue-400",
                                  "group-data-[state=open]:rotate-90"
                                )} />
                              )}
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side="right" 
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50 min-w-[200px] rounded-lg"
                            sideOffset={8}
                          >
                            <div className="p-2">
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                                {item.title}
                              </div>
                              {item.dropdownItems.map((dropdownItem, index) => (
                                <DropdownMenuItem 
                                  key={dropdownItem.title}
                                  onClick={() => handleDropdownItemClick(dropdownItem.url)}
                                  className={cn(
                                    "cursor-pointer rounded-md transition-all duration-200 px-3 py-2",
                                   
                                    "hover:bg-blue-50 dark:hover:bg-blue-900/30",
                                    "hover:text-blue-700 dark:hover:text-blue-300",
                                    "focus:bg-blue-100 dark:focus:bg-blue-900/50",
                                    index !== item.dropdownItems!.length - 1 && "mb-1"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-3"></div>
                                    <span className="font-medium">{dropdownItem.title}</span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title} 
                        isActive={isActive} 
                        className={cn(
                          "transition-all duration-200 my-1 group",
                          isActive 
                            ? "bg-blue-600 dark:bg-blue-700 text-white border-l-4 border-blue-400 dark:border-blue-300 shadow-md"
                            : cn(
                               
                                "hover:bg-blue-50 dark:hover:bg-blue-900/30",
                                "hover:text-blue-700 dark:hover:text-blue-300",
                                "border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
                              )
                        )}
                      >
                        <Link to={item.url} className="flex items-center w-full">
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors",
                            isActive 
                              ? "text-white" 
                              : "dark:text-blue-400 dark:group-hover:text-blue-300"
                          )} />
                          <span className={cn(
                            "ml-2 font-medium", 
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                            isActive ? "text-white" : ""
                          )}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
