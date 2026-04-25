/**
 * Configuration constants for the Testimonials component
 */
export const TESTIMONIALS_CONFIG = {
  // Card dimensions
  card: {
    minWidth: 345,
    maxWidth: 391,
    maxWidthMobile: 416,
    gap: 16, // gap-4 = 16px
  },
  
  // Scroll behavior
  scroll: {
    // Desktop scroll amount (approximate card width + gap)
    desktopAmount: 320,
    // Mobile scroll threshold for centering
    mobileThreshold: 768,
    // Scroll behavior
    behavior: "smooth" as ScrollBehavior,
  },
  
  // UI settings
  ui: {
    scrollButtonOffset: 16, // translate-x-4 = 16px
    tooltipMaxWidth: 384, // max-w-sm = 384px
    lineClamp: {
      title: 2,
      recommendation: 10,
    },
  },
  
  // Section labels
  labels: {
    section: "Testimonials",
  },
} as const;
