// 'use client'

// import { useState, useEffect } from 'react'
// import { HeroMobile } from './HeroMobile'
// import { HeroDesktop } from './HeroDesktop'

// export function Hero() {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkScreenSize()
//     window.addEventListener('resize', checkScreenSize)

//     return () => window.removeEventListener('resize', checkScreenSize)
//   }, [])

//   return isMobile ? <HeroMobile /> : <HeroDesktop />
// }

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sigma, Mail, Linkedin, Github, FileText } from "lucide-react";
import { CSAnimation } from "@/components/animations";
import Link from "next/link";
import { GitHubContributions } from "@/components/github/components/GitHubContributions";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 mx-auto max-w-7xl px-6 lg:px-8">
      {/* Information column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <Badge
            variant="secondary"
            className="inline-flex items-center justify-center bg-gradient-to-r from-black/5 to-white/10 border-black/20 text-foreground/70 backdrop-blur-sm !rounded-sm font-normal"
          >
            {/* <Sigma className="mr-2 h-4 w-4 text-foreground/50" /> */}
            Software Engineer
          </Badge>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Hello, I'm Asif
            </h1>
            <p className="text-sm text-foreground/70 font-normal">
              I am a software engineer and I am building tools for engineers and
              scientists
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm max-w-lg font-light tracking-wide">
            I develop custom software solutions for software engineers, and
            computer scientists to streamline their daily operations. Different
            application needs different customization strategies and I try to
            provide those solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="mailto:your-email@example.com"
                className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-all duration-300 hover:scale-105"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors" />
              </Link>

              <Link
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-all duration-300 hover:scale-105"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors" />
              </Link>

              <Link
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-all duration-300 hover:scale-105"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors" />
              </Link>

              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-all duration-300 hover:scale-105"
                aria-label="Resume"
              >
                <FileText className="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors" />
              </Link>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12"
              >
                Contact me
              </Button>
            </div> */}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="w-full max-w-md h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border/50 flex items-center justify-center">
            <CSAnimation size="lg" className="w-48 h-48" />
          </div>
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
