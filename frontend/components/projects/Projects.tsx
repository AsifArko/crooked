import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { client } from "@/sanity/lib/client";
import { sourceCodesQuery } from "@/sanity/lib/queries";
import { ExternalLink, Github, Eye, DollarSign } from "lucide-react";

interface SourceCode {
  _id: string;
  title: string;
  slug: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  price: number;
  mainImage?: string;
  images?: string[];
  technologies: string[];
  features: string[];
  readme: string;
  publishedAt: string;
}

async function getSourceCodes(): Promise<SourceCode[]> {
  return await client.fetch(sourceCodesQuery);
}

export const Projects = async () => {
  const sourceCodes = await getSourceCodes();

  if (sourceCodes.length === 0) {
    return (
      <section className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Projects
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
          </div>

          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              No projects available yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for amazing source code projects!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
            Explore my collection of high-quality source code projects, ready
            for production use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sourceCodes.map((project) => (
            <Card key={project._id} className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                {project.mainImage && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                    <img
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-4">
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.features && project.features.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                        {project.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{project.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex-shrink-0 pt-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-lg">
                      ${project.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-3"
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          <span className="text-xs">Code</span>
                        </a>
                      </Button>
                    )}

                    {project.demoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-3"
                      >
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">Demo</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
