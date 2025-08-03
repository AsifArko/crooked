"use client";

import { motion } from "framer-motion";
import { GitHubContributions } from "@/components/github/components/contributions/GitHubContributions";
import { Mail, Linkedin, Github, FileText } from "lucide-react";

export function HeroMobile() {
  return (
    <section className="relative overflow-hidden bg-background py-8 px-4 mx-auto max-w-7xl">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto space-y-8"
        >
          {/* Professional header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-6"
          >
            {/* Professional badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-md text-xs font-medium text-primary"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Software Engineer
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                Asif{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Imtiyaz Chowdhury
                </span>
              </h1>

              <p className="text-xs text-muted-foreground/70 leading-relaxed font-light">
                Crafting modern web experiences with passion and precision.
                Every contribution tells a story of continuous learning and
                growth.
              </p>
            </motion.div>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center items-center gap-3"
            >
              <a
                href="mailto:asif@example.com"
                className="p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </a>
              <a
                href="https://linkedin.com/in/asifarko"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </a>
              <a
                href="https://github.com/asifarko"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                aria-label="Resume"
              >
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </a>
            </motion.div>
          </motion.div>

          {/* GitHub Contributions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-6 shadow-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="space-y-2"
            >
              {/* GitHub Contributions */}
              <div className="flex justify-center">
                <GitHubContributions username="asifarko" showHeader={false} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
