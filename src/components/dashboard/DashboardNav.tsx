
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";

export function DashboardNav() {
  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger />
      <div className="flex items-center">
        <BookOpen className="h-5 w-5 text-primary mr-2" />
        <div className="text-xl font-bold">Ilmee</div>
      </div>
    </div>
  );
}
