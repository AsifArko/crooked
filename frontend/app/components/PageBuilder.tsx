"use client";

import { motion } from "framer-motion";

interface PageBuilderProps {
  page: any;
}

export default function PageBuilder({ page }: PageBuilderProps) {
  return (
    <motion.div
      className="container mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {page.heading || "Page Content"}
          </h1>

          {page.subheading && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {page.subheading}
            </p>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
            <p className="text-gray-600 dark:text-gray-300">
              This is a placeholder for the page builder content. The actual
              content will be rendered based on the Sanity schema.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
