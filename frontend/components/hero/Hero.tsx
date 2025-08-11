"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, FileText, Copy, Twitter } from "lucide-react";
import { CrookedAnimation } from "@/components/animations";
import Link from "next/link";
import { useState } from "react";

export function Hero() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("your-email@example.com");
      setEmailCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        setEmailCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-12 sm:py-16 mx-auto max-w-7xl px-6 lg:px-8"
    >
      {/* Information column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <Badge
            variant="secondary"
            className="inline-flex items-center justify-center bg-gradient-to-r from-black/5 to-white/10 border-black/20 text-foreground/70 backdrop-blur-sm rounded-sm font-normal"
          >
            {/* <Sigma className="mr-2 h-4 w-4 text-foreground/50" /> */}
            Software Engineer
          </Badge>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Hello, I&apos;m Asif
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

          {/* Social Media Icons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-1 border border-border/50 relative w-full sm:w-56">
              <div
                onClick={copyEmailToClipboard}
                className="h-9 w-9 flex items-center justify-center hover:bg-background/80 transition-all duration-200 rounded-md relative cursor-pointer pl-2 sm:pl-0"
                title={emailCopied ? "Email copied!" : "Copy email address"}
              >
                <Mail className="h-4 w-4" />
                {/* Compact Tooltip */}
                {showTooltip && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    Email copied!
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                  </div>
                )}
              </div>
              <div className="w-px h-4 bg-border/50 mx-0.5"></div>
              <div
                onClick={() =>
                  window.open("https://www.linkedin.com/in/asifimch/", "_blank")
                }
                className="h-9 w-9 flex items-center justify-center hover:bg-background/80 transition-all duration-200 rounded-md cursor-pointer"
                title="Open LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" />
              </div>
              <div className="w-px h-4 bg-border/50 mx-0.5"></div>
              <div
                onClick={() =>
                  window.open("https://github.com/asifarko", "_blank")
                }
                className="h-9 w-9 flex items-center justify-center hover:bg-background/80 transition-all duration-200 rounded-md cursor-pointer"
                title="Open GitHub profile"
              >
                <Github className="h-4 w-4" />
              </div>
              <div className="w-px h-4 bg-border/50 mx-0.5"></div>
              <div
                onClick={() =>
                  window.open("https://twitter.com/yourusername", "_blank")
                }
                className="h-9 w-9 flex items-center justify-center hover:bg-background/80 transition-all duration-200 rounded-md cursor-pointer"
                title="Open Twitter profile"
              >
                <Twitter className="h-4 w-4" />
              </div>
              <div className="w-px h-4 bg-border/50 mx-0.5"></div>
              <div
                onClick={() => window.open("/resume.pdf", "_blank")}
                className="h-9 w-9 flex items-center justify-center hover:bg-background/80 transition-all duration-200 rounded-md cursor-pointer pr-2 sm:pr-0"
                title="Open resume"
              >
                <FileText className="h-4 w-4" />
              </div>
            </div>

            {/* Experience Button */}
            <Link href="/experience" className="w-full sm:w-56">
              <Button className="bg-black text-white hover:bg-black/80 transition-all duration-200 h-11 rounded-lg border border-border/50 w-full">
                Work Experience
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-center order-1 lg:order-2">
          <div className="w-full max-w-md h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border/50 flex items-center justify-center">
            <CrookedAnimation size="lg" className="w-48 h-48" />
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
