"use client";

import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, FileText } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="w-full">
      <div className="text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Other Ways to Connect
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => window.open("mailto:contact@asifarko.com", "_blank")}
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Directly
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              window.open("https://www.linkedin.com/in/asifimch/", "_blank")
            }
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open("https://github.com/asifarko", "_blank")}
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open("/resume.pdf", "_blank")}
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <FileText className="mr-2 h-4 w-4" />
            Resume
          </Button>
        </div>

        <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
          Feel free to reach out through any of these channels. I'm always open
          to discussing new opportunities and collaborations.
        </p>
      </div>
    </div>
  );
}
