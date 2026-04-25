"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Cloud, Wrench, Monitor } from "lucide-react";

interface Skills {
  frontend: string[];
  backend: string[];
  cloud: string[];
  database: string[];
  tools: string[];
}

interface ExperienceSkillsProps {
  skills: Skills;
}

export function ExperienceSkills({ skills }: ExperienceSkillsProps) {
  const skillCategories = [
    {
      icon: Monitor,
      title: "Frontend",
      skills: skills.frontend,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Code,
      title: "Backend",
      skills: skills.backend,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      skills: skills.cloud,
      color: "from-purple-500/20 to-violet-500/20",
    },
    {
      icon: Database,
      title: "Database",
      skills: skills.database,
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      icon: Wrench,
      title: "Tools",
      skills: skills.tools,
      color: "from-gray-500/20 to-slate-500/20",
    },
  ];

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
          <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
            Skills & Technologies
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <Card
            key={index}
            className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${category.color} border border-primary/20`}
                >
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {category.title}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light hover:bg-secondary/80 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
