import { useState, useEffect, useCallback } from "react";
import { isMobileViewport } from "../utils";

interface UseFocusedCardOptions {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  itemCount: number;
}

/**
 * Custom hook to track which card is currently focused/centered
 * Used for applying blur effects to out-of-focus cards on mobile
 */
export function useFocusedCard({
  scrollContainerRef,
  itemCount,
}: UseFocusedCardOptions) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const updateFocusedCard = useCallback(() => {
    if (!scrollContainerRef.current) {
      setFocusedIndex(null);
      return;
    }

    // Only track focused card on mobile
    if (!isMobileViewport()) {
      setFocusedIndex(null);
      return;
    }

    const container = scrollContainerRef.current;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-testimonial-card]")
    );

    if (cards.length === 0) {
      setFocusedIndex(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Find the card closest to the center
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setFocusedIndex(closestIndex);
  }, []);

  useEffect(() => {
    updateFocusedCard();

    const container = scrollContainerRef.current;
    if (!container) return;

    // Update on scroll
    container.addEventListener("scroll", updateFocusedCard);
    
    // Update on resize
    const handleResize = () => {
      updateFocusedCard();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", updateFocusedCard);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateFocusedCard]);

  return { focusedIndex };
}
