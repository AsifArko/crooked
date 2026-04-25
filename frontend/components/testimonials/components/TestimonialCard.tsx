import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from "@/lib/types";
import { formatDate, getInitials, isTextTruncated } from "../utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isFocused?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLParagraphElement>, text: string) => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLParagraphElement>) => void;
}

/**
 * Individual testimonial card component
 */
export function TestimonialCard({
  testimonial,
  isFocused = true,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: TestimonialCardProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (onMouseEnter && isTextTruncated(e.currentTarget)) {
      onMouseEnter(e, testimonial.recommendation);
    }
  };

  return (
    <Card
      data-testimonial-card
      className={`bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none min-w-[345px] max-w-[391px] md:flex-shrink-0 w-full max-w-[416px] md:max-w-[391px] flex-shrink-0 transition-all duration-300 md:blur-0 ${
        isFocused ? "blur-0" : "blur-[1px] opacity-70"
      }`}
    >
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
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
                <span title={testimonial.name}>{testimonial.name}</span>
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
        <div className="h-px w-1/2 bg-gradient-to-r from-gray-300/50 to-transparent mb-2"></div>
        <p
          className="text-xs leading-tight line-clamp-10 text-muted-foreground/50 text-justify cursor-text"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          {testimonial.recommendation}
        </p>
      </CardContent>
    </Card>
  );
}
