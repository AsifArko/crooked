"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: {
    asset: {
      url: string;
    };
  };
  date?: string;
}

interface MorePostsProps {
  skip: string;
  limit: number;
}

export async function MorePosts({ skip, limit }: MorePostsProps) {
  // This would normally fetch from Sanity
  // For now, return a placeholder
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>More Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            More posts will be displayed here when available.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
