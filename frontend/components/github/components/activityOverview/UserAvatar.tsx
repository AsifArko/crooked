import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  alt: string;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallbackBgColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  fallbackText,
  size = "sm",
  className,
  fallbackBgColor = "bg-blue-500",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const [imageError, setImageError] = React.useState(false);

  if (!src || imageError) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800",
          fallbackBgColor,
          sizeClasses[size],
          className
        )}
      >
        <span className="text-white font-normal">
          {fallbackText.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full shadow-sm border border-white dark:border-zinc-800 overflow-hidden relative",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
