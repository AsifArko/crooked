"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SourceCodeCard } from "./SourceCodeCard";
import { SourceCodeCardMobile } from "./SourceCodeCardMobile";
import { SourceCodeCardDesktop } from "./SourceCodeCardDesktop";

interface SourceCode {
  _id: string;
  title: string;
  slug: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  price: number;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  technologies: string[];
  features: string[];
  isPublished: boolean;
}

interface SourceCodeGridProps {
  sourceCodes: SourceCode[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function SourceCodeGrid({ sourceCodes }: SourceCodeGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const publishedSourceCodes = sourceCodes.filter((code) => code.isPublished);

  return (
    <section className="py-8 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Projects
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
            Source Code Projects
          </h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xl">
            Explore and purchase high-quality source code projects. Each project
            includes complete documentation and support.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publishedSourceCodes.map((sourceCode) => (
            <SourceCodeCard
              key={sourceCode._id}
              sourceCode={sourceCode}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        {publishedSourceCodes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              No source code projects available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
