"use client";

import { motion } from "framer-motion";
import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface Person {
  firstName?: string;
  lastName?: string;
  image?: {
    asset: {
      url: string;
    };
  };
}

interface AvatarProps {
  person: Person;
  date?: string;
}

export default function Avatar({ person, date }: AvatarProps) {
  const name = `${person.firstName || ""} ${person.lastName || ""}`.trim();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AvatarUI className="w-12 h-12">
        <AvatarImage src={person.image?.asset.url} alt={name} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
          {initials}
        </AvatarFallback>
      </AvatarUI>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
        {date && (
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>
    </motion.div>
  );
}
