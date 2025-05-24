
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryBadge = ({ category, isSelected, onClick }: CategoryBadgeProps) => {
  return (
    <Badge 
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer transition-colors py-1 px-3 ${
        isSelected 
          ? "hover:bg-primary/90" 
          : "hover:bg-accent"
      }`}
      onClick={onClick}
    >
      {category}
    </Badge>
  );
};

export default CategoryBadge;
