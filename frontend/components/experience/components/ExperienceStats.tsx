"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Building, FolderOpen, Code } from "lucide-react";

interface ExperienceStatsProps {
  stats: {
    totalYears: number;
    companies: number;
    projects: number;
    technologies: number;
  };
}

export function ExperienceStats({ stats }: ExperienceStatsProps) {
  const statItems = [
    {
      icon: Clock,
      label: "Years Experience",
      value: stats.totalYears,
      description: "Professional development",
    },
    {
      icon: Building,
      label: "Companies",
      value: stats.companies,
      description: "Organizations worked",
    },
    {
      icon: FolderOpen,
      label: "Projects",
      value: stats.projects,
      description: "Applications delivered",
    },
    {
      icon: Code,
      label: "Technologies",
      value: stats.technologies,
      description: "Skills mastered",
    },
  ];

  return (
    <section className="bg-background">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
          <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
            Overview
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card
            key={index}
            className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg  border border-primary/20">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-foreground/70 uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {item.value}+
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
