"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GitHubContributions } from "@/components/github/GitHubContributions";

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
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-1 space-y-6">
          <Badge
            variant="secondary"
            className="inline-flex items-center justify-center bg-gradient-to-r from-black/5 to-white/10 border-black/20 text-foreground/70 backdrop-blur-sm !rounded-sm font-normal"
          >
            <Sparkles className="mr-2 h-4 w-4 text-foreground/50" />
            Full Stack Developer & Open Source Contributor
          </Badge>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Asif Arko
            </h1>
            <p className="text-sm text-primary font-medium">
              Building modern web applications with cutting-edge technologies
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm max-w-lg font-light tracking-wide">
            Passionate about creating elegant, scalable solutions with clean
            code and modern design. Specialized in React, Next.js, TypeScript,
            and full-stack development with a focus on user experience and
            performance.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12"
              >
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group border-border/50 hover:bg-background/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
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
        </div>

        {/* Right Column - GitHub Contributions */}
        <div className="lg:col-span-1 flex justify-center lg:justify-end">
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
