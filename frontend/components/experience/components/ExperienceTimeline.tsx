"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
  Globe,
  Landmark,
} from "lucide-react";
import { WorldMap } from "@/components/maps";

interface Application {
  title: string;
  link: string;
  countries: string[];
}

interface Position {
  id: number;
  company: string;
  companyLink?: string;
  location: string;
  position: string;
  duration: string;
  architectures: string[];
  applications: Application[];
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
              <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-primary/15 to-transparent"></div>
            )}

            <div className="flex gap-6">
              {/* Timeline dot */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-primary/5 flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <Card className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none  duration-200 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Company Info */}
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {position.position}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Landmark className="h-4 w-4" />
                          {position.companyLink ? (
                            <a
                              href={position.companyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {position.company}
                            </a>
                          ) : (
                            <span className="font-medium">
                              {position.company}
                            </span>
                          )}
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

                      {/* Application badges */}
                      {position.applications &&
                        position.applications.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {position.applications.map((app, appIndex) => (
                              <Badge
                                key={appIndex}
                                variant="outline"
                                className="text-xs border-primary/30 text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                onClick={() => window.open(app.link, "_blank")}
                              >
                                {app.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Achievements */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-px w-4 bg-gradient-to-r from-transparent to-secondary/30"></div>
                          <h4 className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                            Key Achievements
                          </h4>
                          <div className="h-px flex-1 bg-gradient-to-r from-secondary/30 to-transparent"></div>
                        </div>
                        {/* Architecture metadata */}
                        {position.architectures &&
                          position.architectures.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground/60 font-bold">
                                Architecture:
                              </span>
                              {position.architectures.map((arch, archIndex) => (
                                <span
                                  key={archIndex}
                                  className="text-xs text-muted-foreground/60 font-light"
                                >
                                  {arch}
                                  {archIndex <
                                    position.architectures.length - 1 && (
                                    <span className="text-muted-foreground/40">
                                      {" "}
                                      •{" "}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                      <div className="space-y-3">
                        {position.achievements.map(
                          (achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex gap-3">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <p
                                className="text-sm text-muted-foreground/80 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: achievement,
                                }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    {position.technologies &&
                      position.technologies.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-px w-4 bg-gradient-to-r from-transparent to-secondary/30"></div>
                            <h4 className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                              Technologies Used
                            </h4>
                            <div className="h-px flex-1 bg-gradient-to-r from-secondary/30 to-transparent"></div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {position.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light hover:bg-secondary/90 transition-colors"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Global Applications Map */}
                    {position.applications &&
                      position.applications.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-px w-4 bg-gradient-to-r from-transparent to-primary/30"></div>
                            <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wide flex items-center gap-2">
                              <Globe className="h-4 w-4 text-foreground/60" />
                              Operated in
                            </h4>
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                          </div>
                          <WorldMap
                            applications={position.applications}
                            config={{ className: "w-full" }}
                          />
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
