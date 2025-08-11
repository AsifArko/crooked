"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "./data";
import { useRef, useState } from "react";

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className = "" }: TestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 320; // Approximate width of one card + gap

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  return (
    <section className={`bg-background`}>
      <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Testimonials
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white transition-all duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white transition-all duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-0 scrollbar-hide scroll-smooth md:gap-4 gap-0"
            onScroll={checkScrollButtons}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none min-w-[345px] max-w-[391px] md:flex-shrink-0 w-full max-w-[416px] md:max-w-[391px] flex-shrink-0"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {getInitials(testimonial.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate text-foreground/90">
                        {testimonial.linkedInUrl ? (
                          <a
                            href={testimonial.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-600 transition-colors"
                            title={testimonial.name}
                          >
                            {testimonial.name}
                          </a>
                        ) : (
                          <span title={testimonial.name}>
                            {testimonial.name}
                          </span>
                        )}
                      </CardTitle>
                      <p
                        className="text-sm text-muted-foreground/70 line-clamp-2"
                        title={`${testimonial.title}${testimonial.company ? ` at ${testimonial.company}` : ""}`}
                      >
                        {testimonial.title}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground/60 mb-2">
                    {formatDate(testimonial.date)}
                  </p>
                  <p
                    className="text-xs leading-tight line-clamp-10 text-muted-foreground/50 text-justify"
                    title={testimonial.recommendation}
                  >
                    &ldquo;{testimonial.recommendation}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
