
import React from "react";
import { Menu } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/context/RoleContext";
import { getMenuItemsByRole } from "@/constants/menuItems";

export function DashboardSidebar() {
  const location = useLocation();
  const { state, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { role } = useRole();

  // Define active item color based on theme
  const activeItemClass = theme === 'light' 
    ? "bg-[rgb(16,62,107)] text-white dark:bg-sidebar-accent/50 dark:text-sidebar-accent-foreground" 
    : "bg-[#1E3A60] text-white";

  // Get menu items based on role
  const items = getMenuItemsByRole(role);

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
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title} 
                        isActive={isActive} 
                        className={cn(
                          "transition-colors my-[4px]",
                          isActive 
                            ? activeItemClass
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <Link to={item.url} className="flex items-center">
                          <item.icon className="h-5 w-5" />
                          <span className={cn("ml-2", 
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto")}>{item.title}</span>
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
