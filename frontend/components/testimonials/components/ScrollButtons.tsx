import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS_CONFIG } from "../config";

interface ScrollButtonsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

/**
 * Navigation buttons for the testimonial carousel
 */
export function ScrollButtons({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: ScrollButtonsProps) {
  const buttonClass = "absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white transition-all duration-200";

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} left-0 -translate-x-4 ${
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onScrollLeft}
        aria-label="Scroll to previous testimonial"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} right-0 translate-x-4 ${
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onScrollRight}
        aria-label="Scroll to next testimonial"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}
