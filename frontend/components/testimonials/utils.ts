/**
 * Utility functions for testimonials
 */

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

/**
 * Gets initials from a full name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Checks if text is truncated
 */
export const isTextTruncated = (element: HTMLElement): boolean => {
  return element.scrollHeight > element.clientHeight;
};

/**
 * Calculates the scroll position to center an element in the scroll container
 * On mobile, ensures perfect centering by accounting for container padding
 */
export const calculateCenterScrollPosition = (
  container: HTMLElement,
  targetElement: HTMLElement
): number => {
  const isMobile = isMobileViewport();
  
  if (isMobile) {
    // On mobile, use offsetLeft which is relative to the container's content area
    // This gives us the exact position we need
    const targetLeft = targetElement.offsetLeft;
    const targetWidth = targetElement.offsetWidth;
    const containerWidth = container.clientWidth;
    
    // Calculate scroll position to center the card
    // We want: targetLeft + targetWidth/2 - containerWidth/2 = scrollLeft
    const targetScroll = targetLeft + targetWidth / 2 - containerWidth / 2;
    
    // Ensure we don't scroll beyond bounds
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    return Math.max(0, Math.min(targetScroll, maxScroll));
  } else {
    // Desktop: use viewport-based calculation
    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    const containerCenter = containerRect.left + containerRect.width / 2;
    const targetCenter = targetRect.left + targetRect.width / 2;
    const offset = targetCenter - containerCenter;
    const targetScroll = container.scrollLeft + offset;
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    return Math.max(0, Math.min(targetScroll, maxScroll));
  }
};

/**
 * Checks if we're on a mobile device based on viewport width
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768; // md breakpoint
};
