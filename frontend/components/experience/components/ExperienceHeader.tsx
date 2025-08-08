"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ExperienceHeader() {
  return (
    <section className="py-12">
      <div className="space-y-6">
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <MapPin className="h-4 w-4" />
            <span>Philadelphia, Pennsylvania, United States</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Calendar className="h-4 w-4" />
            <span>2018 - Present</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="group border-border/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12 !px-6"
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/documentation" className="w-full sm:w-auto"></Link>
        </div>
      </div>
    </section>
  );
}
