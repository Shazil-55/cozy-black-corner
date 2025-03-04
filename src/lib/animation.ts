
import { cn } from "./utils";

export type AnimationDirection = "up" | "down" | "left" | "right";

export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Returns animation classes based on specified parameters
 */
export const getAnimationClasses = (
  type: "fade" | "slide" | "scale" | "none",
  direction?: AnimationDirection,
  delay?: number,
  duration?: number
) => {
  const baseClasses = ["animate-fade-in"];
  
  const delayClass = delay ? `animate-delay-${delay}` : "";
  const durationClass = duration ? `duration-${duration}` : "";
  
  let animationClass = "";
  
  switch (type) {
    case "fade":
      animationClass = "animate-fade-in";
      break;
    case "slide":
      animationClass = "animate-slide-in";
      break;
    case "scale":
      animationClass = "animate-scale-in";
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
