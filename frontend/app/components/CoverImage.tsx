"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  image: {
    asset?: {
      url?: string;
      _ref?: string;
    };
  };
  priority?: boolean;
  className?: string;
}

export default function CoverImage({
  image,
  priority,
  className,
}: CoverImageProps) {
  if (!image?.asset?.url) {
    return null;
  }

  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-lg", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Image
        src={image.asset.url}
        alt="Cover"
        width={800}
        height={400}
        className="w-full h-auto object-cover"
        priority={priority}
      />
    </motion.div>
  );
}
