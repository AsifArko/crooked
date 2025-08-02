"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PortableTextProps {
  value: any[];
  className?: string;
}

export default function PortableText({ value, className }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return (
    <motion.div
      className={cn("prose prose-lg max-w-none", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {value.map((block, index) => {
        if (block._type === "block") {
          return (
            <div key={index} className="mb-4">
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </div>
          );
        }
        return null;
      })}
    </motion.div>
  );
}
