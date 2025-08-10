import React from "react";
import Image from "next/image";
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
import {
  ExternalLink,
  Github,
  Eye,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

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

export const SourceCodes = async () => {
  const sourceCodes = await getSourceCodes();

  if (sourceCodes.length === 0) {
    return (
      <section id="sourcecodes" className="bg-background">
        <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Source Codes
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
          </div>

          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              No source codes available yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for amazing source code packages!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sourcecodes" className="bg-background">
      <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Source Codes
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sourceCodes.map((sourceCode) => (
            <Card
              key={sourceCode._id}
              className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden"
            >
              {/* Image Section */}
              {sourceCode.mainImage && (
                <div className="aspect-video overflow-hidden bg-muted relative">
                  <Image
                    src={sourceCode.mainImage}
                    alt={sourceCode.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {sourceCode.title}
                  </h3>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed font-light">
                    {sourceCode.description}
                  </p>
                </div>

                {/* Technologies */}
                {sourceCode.technologies &&
                  sourceCode.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {sourceCode.technologies
                          .slice(0, 3)
                          .map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light"
                            >
                              {tech}
                            </Badge>
                          ))}
                        {sourceCode.technologies.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-secondary/70 text-muted-foreground/90 font-light"
                          >
                            +{sourceCode.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-foreground">
                      ${sourceCode.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sourceCode.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-3"
                      >
                        <a
                          href={sourceCode.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          <span className="text-xs">Code</span>
                        </a>
                      </Button>
                    )}

                    {sourceCode.demoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-3"
                      >
                        <a
                          href={sourceCode.demoUrl}
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

                {/* Buy Now Button */}
                <div className="mt-2">
                  <Button className="w-full bg-black hover:bg-black/90 text-white h-10">
                    Buy Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
