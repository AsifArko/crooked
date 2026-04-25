import { useRef, useState, useCallback, useEffect } from "react";
import { TESTIMONIALS_CONFIG } from "../config";
import { calculateCenterScrollPosition, isMobileViewport } from "../utils";

interface UseTestimonialScrollOptions {
  itemCount: number;
}

interface UseTestimonialScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollToNext: () => void;
  scrollToPrevious: () => void;
  checkScrollButtons: () => void;
}

/**
 * Custom hook for managing testimonial carousel scroll behavior
 * Handles mobile centering and desktop scrolling
 */
export function useTestimonialScroll({
  itemCount,
}: UseTestimonialScrollOptions): UseTestimonialScrollReturn {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const threshold = 10; // Small threshold to account for rounding

    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - threshold);
  }, []);

  const scrollToNext = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const isMobile = isMobileViewport();

    if (isMobile) {
      // On mobile, find the next card to center
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testimonial-card]")
      );
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Find the currently centered card (or closest to center)
      let currentCardIndex = -1;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          currentCardIndex = index;
        }
      });

      // Find the next card (to the right)
      const nextCardIndex = currentCardIndex + 1;
      const nextCard =
        nextCardIndex < cards.length
          ? cards[nextCardIndex]
          : cards[cards.length - 1];

      if (nextCard) {
        const targetScroll = calculateCenterScrollPosition(container, nextCard);
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: TESTIMONIALS_CONFIG.scroll.behavior,
        });
      }
    } else {
      // Desktop: scroll by fixed amount
      container.scrollBy({
        left: TESTIMONIALS_CONFIG.scroll.desktopAmount,
        behavior: TESTIMONIALS_CONFIG.scroll.behavior,
      });
    }
  }, []);

  const scrollToPrevious = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const isMobile = isMobileViewport();

    if (isMobile) {
      // On mobile, find the previous card to center
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-testimonial-card]")
      );
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Find the currently centered card (or closest to center)
      let currentCardIndex = -1;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          currentCardIndex = index;
        }
      });

      // Find the previous card (to the left)
      const previousCardIndex = currentCardIndex - 1;
      const previousCard =
        previousCardIndex >= 0 ? cards[previousCardIndex] : cards[0];

      if (previousCard) {
        const targetScroll = calculateCenterScrollPosition(
          container,
          previousCard
        );
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: TESTIMONIALS_CONFIG.scroll.behavior,
        });
      }
    } else {
      // Desktop: scroll by fixed amount
      container.scrollBy({
        left: -TESTIMONIALS_CONFIG.scroll.desktopAmount,
        behavior: TESTIMONIALS_CONFIG.scroll.behavior,
      });
    }
  }, []);

  // Check scroll buttons on mount and window resize
  useEffect(() => {
    checkScrollButtons();
    
    const handleResize = () => {
      checkScrollButtons();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScrollButtons]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollToNext,
    scrollToPrevious,
    checkScrollButtons,
  };
}
