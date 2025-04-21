
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Update to a more prominent, professional grey color with better visibility
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
