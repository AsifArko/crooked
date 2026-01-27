import { TESTIMONIALS_CONFIG } from "../config";

/**
 * Section header component for testimonials
 */
export function SectionHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
        <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
          {TESTIMONIALS_CONFIG.labels.section}
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
      </div>
    </div>
  );
}
