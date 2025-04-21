
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Update to a more prominent, professional grey (light and elegant)
        "animate-pulse rounded-md bg-[#ECECEC] dark:bg-[#222328] border border-[#D1D1D1] dark:border-[#313136]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
