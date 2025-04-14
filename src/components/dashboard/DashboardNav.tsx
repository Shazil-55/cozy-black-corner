
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardNav() {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger />
      <div className="text-xl font-bold">Ilmee</div>
    </div>
  );
}
