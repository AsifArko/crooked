"use client";

import { useEffect, useState } from "react";
import { testimonials } from "./data";
import { useTestimonialScroll } from "./hooks/useTestimonialScroll";
import { useTooltip } from "./hooks/useTooltip";
import { useFocusedCard } from "./hooks/useFocusedCard";
import { TestimonialCard } from "./components/TestimonialCard";
import { ScrollButtons } from "./components/ScrollButtons";
import { SectionHeader } from "./components/SectionHeader";
import { Tooltip } from "./components/Tooltip";
import { TESTIMONIALS_CONFIG } from "./config";
import { isMobileViewport } from "./utils";

interface TestimonialsProps {
  className?: string;
}

/**
 * Testimonials component - displays a carousel of testimonial cards
 * Features:
 * - Mobile-optimized scrolling with card centering
 * - Desktop scrolling with fixed amounts
 * - Tooltip support for truncated text
 * - Responsive design
 */
export function Testimonials({ className = "" }: TestimonialsProps) {
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollToNext,
    scrollToPrevious,
    checkScrollButtons,
  } = useTestimonialScroll({
    itemCount: testimonials.length,
  });

  const { tooltip, handleMouseEnter, handleMouseLeave, handleMouseMove } =
    useTooltip();

  const { focusedIndex } = useFocusedCard({
    scrollContainerRef,
    itemCount: testimonials.length,
  });

  const [containerPadding, setContainerPadding] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updatePadding = () => {
      if (!isMobileViewport() || !scrollContainerRef.current) {
        setContainerPadding({ left: 0, right: 0 });
        return;
      }

      const viewportWidth = window.innerWidth;
      const parentPadding = 48; // px-6 on both sides = 24px * 2
      const cardMaxWidth = 416;
      const cardWidth = Math.min(cardMaxWidth, viewportWidth - parentPadding);
      const padding = Math.max(0, (viewportWidth - cardWidth - parentPadding) / 2);

      setContainerPadding({ left: padding, right: padding });
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  return (
    <section className={`bg-background relative ${className}`}>
      {tooltip && (
        <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      )}

      <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
        <SectionHeader />

        <div className="relative group">
          <ScrollButtons
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={scrollToPrevious}
            onScrollRight={scrollToNext}
          />

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-0 scrollbar-hide scroll-smooth md:px-0"
            style={{
              paddingLeft: `${containerPadding.left}px`,
              paddingRight: `${containerPadding.right}px`,
            }}
            onScroll={checkScrollButtons}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isFocused={focusedIndex === null || focusedIndex === index}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
