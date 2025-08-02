"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Settings } from "lucide-react";

export function PageOnboarding() {
  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Settings className="w-6 h-6" />
              <span>Welcome to Your Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              This is your portfolio website. To get started, you can:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <Plus className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Add Content
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create pages and content in Sanity Studio
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Upload Documents
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload your resume and other documents
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <Settings className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Customize
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Customize the design and layout
                </p>
              </div>
            </div>

            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
