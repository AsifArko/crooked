"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { CSAnimation } from "@/components/animations";
import Link from "next/link";

export function ExperienceHeader() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 mx-auto max-w-7xl px-6 lg:px-8">
      {/* Information column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 order-2 lg:order-1">
          <Badge
            variant="secondary"
            className="inline-flex items-center justify-center bg-gradient-to-r from-black/5 to-white/10 border-black/20 text-foreground/70 backdrop-blur-sm rounded-sm font-normal"
          >
            <Briefcase className="mr-2 h-4 w-4 text-foreground/50" />
            Professional Experience
          </Badge>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Work Experience
            </h1>
            <p className="text-sm text-foreground/70 font-normal">
              My journey through software engineering roles and achievements
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm max-w-lg font-light tracking-wide">
            Over 6 years of experience in software development, specializing in
            backend services, cloud automation, and full-stack solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group border-border/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-11 !px-6"
              >
                Back to Home
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="group border-border/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-11 !px-6"
              >
                Contact me
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-center order-1 lg:order-2">
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
