"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function HeroDesktop() {
  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="mb-8" variants={fadeInUp}>
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Available for opportunities
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Asif Arko
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Full Stack Developer passionate about building modern web
              applications with cutting-edge technologies and clean,
              maintainable code.
            </motion.p>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="flex space-x-4">
              <Button
                size="lg"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Github className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Linkedin className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Mail className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Visual Elements */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="relative w-full h-96 lg:h-[500px]"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Main Card */}
            <Card className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <motion.div
                    className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-4xl font-bold text-white">A</span>
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Open Source Developer
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Building the future, one commit at a time
                  </motion.p>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
