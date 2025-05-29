
import * as React from "react"
import { cn } from "@/lib/utils"
import { interactionClasses } from "@/lib/animation"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    interactive?: boolean;
    variant?: 'default' | 'glass' | 'premium';
  }
>(({ className, interactive = false, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "bg-card text-card-foreground shadow-subtle",
    glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/50 shadow-glass",
    premium: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 shadow-premium"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border transition-all duration-300 ease-smooth",
        variantClasses[variant],
        interactive && interactionClasses.card,
        "animate-fade-in",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 animate-fade-in-delay-100", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight animate-fade-in-delay-200",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground animate-fade-in-delay-300", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 animate-fade-in-delay-200", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 animate-fade-in-delay-300", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
