"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Testimonial } from "@/lib/types";
import { useRef, useState } from "react";

interface TestimonialsProps {
  className?: string;
}

// Static testimonials data based on real LinkedIn recommendations
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Md. Akimul Islam (Akash)",
    title: "Staff Software Engineer",
    company: "Cefalo",
    recommendation:
      "Asif is a very skilled and experienced developer. I have worked with him for almost 4 years. He has a good grasp of graph databases(specially neo4j) as well as other databases, Node and React.js. Asif had designed and developed few of the services that were part of our system quite nicely. As a team member, he is always open to discussion. Asif will be a good asset to any team.",
    linkedInUrl: "https://www.linkedin.com/in/akimulakash/",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Marius Hagalid",
    title: "Tech Lead / Utvikler",
    company: "NTB",
    recommendation:
      "Asif has been developing our backend services which are written in typescript and nodejs. He has been working on multiple different micro services, and he was the expert of the rest api that is used by our frontend. His knowledge of different types of databases like graph databases, document databases, and sql has been important. He is eager to learn, and improve the code quality.",
    linkedInUrl: "https://www.linkedin.com/in/marius-hagalid-1a30a0112/",
    date: "2023-12-20",
  },
  {
    id: "3",
    name: "Terje Alstad",
    title: "Sportsdatasjef",
    company: "NTB",
    recommendation:
      "Asif has been a part of our sportsdata team for many years through his consultancy with Cefalo. During his time with us, he has contributed with great enthusiasm and determination. He is a person who is easy to work with, possesses strong English skills and enjoys discussing various issues. His work has primarily focused on developing our frontend API, CRUD service, and our internal sportsdata admin. Asif has proven to be reliable, consistently delivering code as expected and is proactive in seeking clarification when needed. He often contributes valuable solutions when challenges arise.",
    linkedInUrl: "https://www.linkedin.com/in/terje-alstad-33a395a3/",
    date: "2023-11-10",
  },
  {
    id: "4",
    name: "Shahin Mahmud",
    title: "Senior Software Engineer | SRE",
    company:
      "Building Scalable Systems with Go, Microservices, Kubernetes, and Cloud Solutions",
    recommendation:
      "I worked with Asif on the same team during my time at KickbackApps. Asif was a very pleasant, learned mate to work with. He has a diverse set of skills and is very fast at acquiring new skills. He was a fantastic team player, saw him carrying out crucial roles on multiple projects that I was involved in. I wish to work with him in the future again.",
    linkedInUrl: "https://www.linkedin.com/in/-shahin-mahmud/",
    date: "2023-10-15",
  },
  {
    id: "5",
    name: "MD Ahad Hasan",
    title: "Senior Software Engineer | Backend | DevOps | ML",
    recommendation:
      "Asif is a great programmer. When he joined the company I was managing at that time, he came with good experience and quickly learned new codebases. Later he started making contributions to production. He's one of the bright individuals I worked with and I hope all the best for his journey.",
    linkedInUrl: "https://www.linkedin.com/in/hasanrafi/",
    date: "2023-09-20",
  },
  {
    id: "6",
    name: "Md Hashibul Amin",
    title: "Senior Software Engineer",
    company:
      "specializing in Frontend Technologies | React.js, React Native, NextJS",
    recommendation:
      "Asif Chowdhury was one of the most committed professionals through his work at Shimahin Ltd. When you get to connect with him, you will find a fantastic person with exceptional skills! Asif Chowdhury provided outstanding results for Shimahin Ltd. Energetic and broad-minded Software Engineer - that's him! Detail oriented team player. Through the years, we worked on various projects and I was impressed by his manner of doing a great job. I have always felt Asif Chowdhury was one of the most effective team mates I have ever had the privilege of working with.",
    linkedInUrl: "https://www.linkedin.com/in/ihemel/",
    date: "2023-08-15",
  },
  {
    id: "7",
    name: "Saidur Rahman Sajjad",
    title: "Software Engineer",
    recommendation:
      "Arko is highly skilled in Linux, Backend and DevOps. Always keen to learn and experiment with new things. I've worked with very few awesome Go developers and he's one of them.",
    linkedInUrl: "https://www.linkedin.com/in/srsajjad/",
    date: "2023-07-20",
  },
  {
    id: "8",
    name: "Sanjidul Hoque",
    title: "Senior Software Engineer",
    company: "Sibros | Backend Development, Cloud Computing",
    recommendation:
      "Asif is a quick learner with hard working tendency. I have worked with him in some projects. He is very much proficient on his task. I would like to wish him a bright career.",
    linkedInUrl: "https://www.linkedin.com/in/sanjidulhoque/",
    date: "2023-06-15",
  },
];

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
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth md:gap-4 gap-0"
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
                  <p className="text-sm text-muted-foreground/70 mb-3">
                    {formatDate(testimonial.date)}
                  </p>
                  <p
                    className="text-sm leading-relaxed line-clamp-4 text-muted-foreground/80"
                    title={testimonial.recommendation}
                  >
                    "{testimonial.recommendation}"
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
