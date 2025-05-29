
import { cn } from "./utils";

export type AnimationDirection = "up" | "down" | "left" | "right";
export type AnimationType = "fade" | "slide" | "scale" | "elastic" | "glow" | "none";

export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Returns enhanced animation classes based on specified parameters
 */
export const getAnimationClasses = (
  type: AnimationType,
  direction?: AnimationDirection,
  delay?: number,
  duration?: number
) => {
  const delayClass = delay ? `animate-delay-${delay}` : "";
  const durationClass = duration ? `duration-${duration}` : "";
  
  let animationClass = "";
  
  switch (type) {
    case "fade":
      animationClass = "animate-fade-in";
      break;
    case "slide":
      const slideDirection = direction || "up";
      animationClass = `animate-slide-in-${slideDirection}`;
      break;
    case "scale":
      animationClass = "animate-scale-in";
      break;
    case "elastic":
      animationClass = "animate-elastic";
      break;
    case "glow":
      animationClass = "animate-glow";
      break;
    case "none":
      return "";
    default:
      animationClass = "animate-fade-in";
  }
  
  return cn(animationClass, delayClass, durationClass);
};

/**
 * Generates staggered animation delays for children elements
 */
export const getStaggeredDelay = (index: number, baseDelay: number = 100) => {
  return index * baseDelay;
};

/**
 * Enhanced interactive animation classes
 */
export const interactionClasses = {
  // Button interactions
  button: "transition-all duration-300 ease-smooth hover:scale-105 hover:shadow-elevated active:scale-95",
  buttonPrimary: "transition-all duration-300 ease-smooth hover:scale-105 hover:shadow-glow active:scale-95",
  
  // Card interactions
  card: "transition-all duration-500 ease-smooth hover:scale-[1.02] hover:shadow-premium hover:-translate-y-1",
  cardSubtle: "transition-all duration-300 ease-smooth hover:shadow-glass hover:-translate-y-0.5",
  
  // Link interactions
  link: "relative transition-all duration-300 ease-smooth hover:text-primary",
  
  // Modal/Dialog interactions
  modal: "animate-scale-in",
  modalOverlay: "animate-fade-in",
  
  // Form element interactions
  input: "transition-all duration-200 ease-smooth focus:scale-[1.02] focus:shadow-glow",
  
  // Navigation interactions
  nav: "transition-all duration-200 ease-smooth hover:bg-white/10 hover:backdrop-blur-sm",
  
  // Page transitions
  pageEnter: "animate-fade-in",
  pageExit: "animate-fade-out",
  
  // Special effects
  shimmer: "bg-gradient-to-r bg-[length:200%_100%] animate-shimmer",
  float: "animate-float",
  glow: "animate-glow",
  pulseGentle: "animate-pulse-gentle",
};

/**
 * Premium background classes
 */
export const backgroundClasses = {
  premium: "premium-background relative overflow-hidden",
  floating: "floating-particles relative overflow-hidden",
  glass: "bg-white/10 dark:bg-black/10 backdrop-blur-glass border border-white/20 dark:border-white/10",
  mesh: "bg-mesh-gradient",
  gradient: "bg-gradient-premium",
};

/**
 * Utility function to create staggered animations for lists
 */
export const createStaggeredAnimation = (itemCount: number, baseClass: string = "animate-fade-in") => {
  return Array.from({ length: itemCount }, (_, index) => {
    const delay = Math.min(index * 100, 500); // Cap at 500ms
    return `${baseClass} animate-delay-${delay}`;
  });
};

/**
 * Page transition utilities
 */
export const pageTransitions = {
  enter: "animate-fade-in",
  exit: "animate-fade-out",
  slideEnter: "animate-slide-in-right",
  slideExit: "animate-slide-out-left",
};
