"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {} from "lucide-react";

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

export const SourceCodes = () => {
  const [sourceCodes, setSourceCodes] = React.useState<SourceCode[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchSourceCodes = async () => {
      try {
        console.log("Fetching source codes from API...");
        const response = await fetch("/api/sourcecodes");
        console.log("API response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch source codes");
        }
        const data = await response.json();
        console.log("API response data:", data);
        console.log("Number of source codes received:", data?.length || 0);
        setSourceCodes(data);
      } catch (error) {
        console.error("Error fetching source codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceCodes();
  }, []);

  useEffect(() => {
    // Check if we need to scroll to this section (when coming from contact page)
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#sourcecodes"
    ) {
      // Use a small delay to ensure the component is fully rendered
      setTimeout(() => {
        const element = document.getElementById("sourcecodes");
        if (element) {
          // Calculate position to show the section at 50% visibility
          const elementRect = element.getBoundingClientRect();
          const elementHeight = elementRect.height;
          const windowHeight = window.innerHeight;

          // Scroll to position the element at 50% of viewport height
          const targetScrollTop =
            window.pageYOffset +
            elementRect.top -
            windowHeight * 0.5 +
            elementHeight * 0.5;

          window.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  if (loading) {
    return (
      <section className="bg-background">
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (sourceCodes.length === 0) {
    return (
      <section className="bg-background">
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
    <section className="bg-background">
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

        <div
          id="sourcecodes"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sourceCodes
            .sort((a, b) => b.price - a.price)
            .map((sourceCode) => (
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
                            <div className="relative group/badge">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-secondary/70 text-muted-foreground/90 font-light cursor-pointer"
                              >
                                +{sourceCode.technologies.length - 3}
                              </Badge>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                {sourceCode.technologies.slice(3).join(", ")}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground/80 tracking-wide">
                        Price
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground/80 tracking-wide blur-sm select-none">
                        ${sourceCode.price}
                      </span>
                    </div>
                  </div>

                  {/* Preview Button */}
                  {/* <div className="mt-2 mb-2">
                    <Button
                      variant="outline"
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                    >
                      Preview
                    </Button>
                  </div> */}

                  {/* Buy Now Button */}
                  <div className="mt-2">
                    <Button className="w-full bg-black hover:bg-black/90 text-white h-10">
                      Will be available soon
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
