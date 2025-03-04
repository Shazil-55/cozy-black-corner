
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItem {
  id: string;
  title: string;
  type: 'module' | 'lesson';
  children?: SidebarItem[];
  expanded?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export const Sidebar = ({ items, onSelect, selectedId }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderItems = (items: SidebarItem[], level = 0) => {
    return items.map((item) => {
      const isExpanded = expandedItems[item.id] ?? item.expanded ?? false;
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = selectedId === item.id;
      
      return (
        <div key={item.id} className={cn(
          "animate-fade-in transition-smooth", 
          level > 0 && "ml-5"
        )}>
          <div 
            className={cn(
              "flex items-center py-2 px-3 my-0.5 rounded-md group transition-colors cursor-pointer",
              isSelected 
                ? "bg-white/20 text-white font-medium" 
                : "hover:bg-white/10 text-white/90",
              level === 0 && "font-medium"
            )}
            onClick={() => {
              onSelect(item.id);
              if (hasChildren) toggleItem(item.id);
            }}
          >
            <div className="flex-shrink-0 mr-2">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white" />
                )
              ) : (
                <FileText className="w-4 h-4 text-white/80" />
              )}
            </div>
            <span className={cn(
              "text-sm truncate flex-1",
              level === 0 ? "font-medium" : "font-normal"
            )}>
              {item.title}
            </span>
          </div>
          
          {hasChildren && isExpanded && (
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out pl-1 border-l border-white/10 ml-4",
              isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
            )}>
              {renderItems(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {isMobile && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-talentlms-blue text-white shadow-md"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isOpen ? "Close sidebar" : "Open syllabus navigation"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <div className={cn(
        "bg-talentlms-blue border-r border-talentlms-darkBlue flex flex-col h-screen w-64",
        "transition-all duration-300 ease-in-out z-40",
        isMobile ? "fixed" : "sticky top-0",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0 shadow-xl"
      )}>
        <div className="p-5 border-b border-talentlms-navBlue flex items-center">
          <BookOpen className="w-5 h-5 text-white mr-3" />
          <h2 className="font-medium text-lg text-white">Syllabus</h2>
        </div>
        
        <div className="overflow-y-auto flex-grow py-4 px-2 custom-scrollbar">
          {items.length > 0 ? (
            renderItems(items)
          ) : (
            <div className="text-center py-8 px-6 text-white/70 text-sm">
              <GraduationCap className="w-12 h-12 mx-auto text-white/30 mb-2" />
              <p>No syllabus content yet.</p>
              <p className="mt-1 text-xs">Generate a syllabus to see the structure here.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile overlay backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
