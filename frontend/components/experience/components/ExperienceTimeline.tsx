"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, CheckCircle } from "lucide-react";

interface Position {
  id: number;
  company: string;
  location: string;
  position: string;
  duration: string;
  applications: { title: string; link: string }[];
  achievements: string[];
  technologies: string[];
}

interface ExperienceTimelineProps {
  positions: Position[];
}

export function ExperienceTimeline({ positions }: ExperienceTimelineProps) {
  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
          <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
            Work History
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
        </div>
      </div>

      <div className="space-y-8">
        {positions.map((position, index) => (
          <div key={position.id} className="relative">
            {/* Timeline connector */}
            {index < positions.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent"></div>
            )}

            <div className="flex gap-6">
              {/* Timeline dot */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <Card className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {position.position}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">
                            {position.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{position.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{position.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Applications */}
                      {position.applications &&
                        position.applications.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {position.applications.map((app, appIndex) => (
                              <Badge
                                key={appIndex}
                                variant="outline"
                                className="text-xs rounded-sm border-primary/30 text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                onClick={() => window.open(app.link, "_blank")}
                              >
                                {app.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Achievements */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {position.achievements.map(
                          (achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                {achievement}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    {position.technologies &&
                      position.technologies.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {position.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
