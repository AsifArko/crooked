import React from "react";
import { cn } from "@/lib/utils";

interface ActivityTitleProps {
  title?: string;
  variant?: "default" | "compact" | "large";
  className?: string;
}

export const ActivityTitle: React.FC<ActivityTitleProps> = ({
  title = "Activity overview",
  variant = "default",
  className,
}) => {
  const variantClasses = {
    default: "text-xs font-normal text-muted-foreground", // Original subtle style
    compact: "text-xs font-normal text-muted-foreground",
    large: "text-sm font-semibold text-foreground", // Only large variant gets the bold style
  };

  return (
    <h3 className={cn(variantClasses[variant], "mb-2", className)}>{title}</h3>
  );
};
