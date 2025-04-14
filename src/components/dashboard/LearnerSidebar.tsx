
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  BookOpen, 
  Home, 
  GraduationCap, 
  Trophy, 
  UserRound, 
  Star,
  Puzzle,
  Menu, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function LearnerSidebar() {
  const location = useLocation();
  const { state, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();

  // Kid-friendly menu items with playful icons
  const items = [
    {
      title: "My Dashboard",
      url: "/learner-dashboard",
      icon: Home
    },
    {
      title: "My Courses",
      url: "/courses",
      icon: BookOpen
    },
    {
      title: "My Achievements",
      url: "/achievements",
      icon: Trophy
    },
    {
      title: "Fun Activities",
      url: "/activities",
      icon: Puzzle
    },
    {
      title: "Stars & Rewards",
      url: "/rewards",
      icon: Star
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: UserRound
    }
  ];

  return (
    <>
      {/* Mobile toggle button - fixed position */}
      {isMobile && (
        <Button 
          onClick={() => setOpenMobile(!openMobile)}
          className="fixed z-50 left-4 top-20 p-2 h-12 w-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 shadow-lg text-white md:hidden flex items-center justify-center"
          size="icon"
          aria-label={openMobile ? "Close menu" : "Open menu"}
        >
          {openMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      <div
        className={cn(
          "transition-all duration-300 ease-in-out z-40 h-screen overflow-hidden",
          "bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-3xl shadow-xl",
          isMobile ? "fixed" : "sticky top-0",
          isMobile && !openMobile && "-translate-x-full",
          isMobile && openMobile && "translate-x-0 shadow-xl",
          isCollapsed ? "w-[70px]" : "w-[220px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo */}
          <div className="p-4 flex justify-center items-center border-b border-indigo-300/30">
            <div className="flex items-center justify-center space-x-2">
              <GraduationCap className="h-8 w-8 text-white" />
              {!isCollapsed && (
                <span className="text-xl font-bold text-white">Learn Fun</span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="overflow-y-auto flex-grow py-6 px-3 custom-scrollbar">
            <ul className="space-y-4">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl transition-all duration-200",
                        isActive 
                          ? "bg-white/90 text-purple-600 font-medium shadow-md transform scale-105" 
                          : "text-white hover:bg-white/20 hover:scale-105"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-xl",
                        isActive ? "bg-purple-100 text-purple-600" : "text-white"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      {!isCollapsed && (
                        <span className={cn(
                          "transition-all duration-200",
                          isActive ? "text-purple-800 font-medium" : "text-white"
                        )}>
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer with character */}
          <div className="p-4 flex justify-center items-center">
            {!isCollapsed && (
              <div className="bg-white/20 p-3 rounded-2xl text-center text-white text-sm">
                <p>Keep Learning!</p>
                <p>🌟 You're awesome! 🌟</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile overlay backdrop */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </>
  );
}
