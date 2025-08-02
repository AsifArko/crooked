"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { GitHubContributions } from "@/components/github/GitHubContributions";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HeroMobile() {
  return (
    <section className="relative overflow-hidden bg-background py-12 px-6">
      <div className="grid grid-cols-1 gap-8">
        {/* Main Hero Content */}
        <motion.div
          className="w-full max-w-md mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <Badge
              variant="secondary"
              className="inline-flex items-center justify-center bg-gradient-to-r from-black/5 to-white/10 border-black/20 text-foreground/70 backdrop-blur-sm !rounded-sm font-normal mb-6"
            >
              <Sparkles className="mr-2 h-4 w-4 text-foreground/50" />
              Full Stack Developer
            </Badge>

            <motion.h1
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text mb-4"
              variants={fadeInUp}
            >
              Asif Arko
            </motion.h1>

            <motion.p
              className="text-sm text-primary font-medium mb-4"
              variants={fadeInUp}
            >
              Building modern web applications with cutting-edge technologies
            </motion.p>

            <motion.p
              className="text-xs leading-relaxed text-muted-foreground/80 font-light tracking-wide"
              variants={fadeInUp}
            >
              Passionate about creating elegant, scalable solutions with clean
              code and modern design. Specialized in React, Next.js, TypeScript,
              and full-stack development.
            </motion.p>
          </motion.div>

          <motion.div className="space-y-4" variants={fadeInUp}>
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full h-12"
              >
                View Projects
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group border-border/50 hover:bg-background/50 transition-all duration-300 w-full h-12"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-muted/50 transition-colors"
              >
                <Github className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-muted/50 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-12 h-12 p-0 hover:bg-muted/50 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* GitHub Contributions */}
        <div className="w-full flex justify-center">
          <GitHubContributions username="asifarko" />
        </div>
      </div>

      {/* Enhanced Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary/30 to-primary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
