"use client";

import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, FileText, Twitter } from "lucide-react";
import { downloadResume } from "@/lib/resumeDownload";

export function ContactInfo() {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Other Ways to Connect
            </span>
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => window.open("https://x.com/asif_imch", "_blank")}
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Follow on Twitter
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
            onClick={() => downloadResume()}
            className="border-border/50 hover:bg-accent hover:text-accent-foreground h-12"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
        </div>

        <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-6">
          Feel free to reach out through any of these channels. I&apos;m always
          open to discussing new opportunities and collaborations.
        </p>

        {/* Browse Source Codes Section */}
        <div className="relative">
          {/* Styled container */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 backdrop-blur-sm">
            <div className="text-center">
              <span className="text- font-semibold text-foreground mb-3">
                Explore My Work
              </span>
              <p className="text-sm text-muted-foreground/70 mb-5 max-w-sm mx-auto">
                Check out my latest source code projects and ready-to-use
                components
              </p>

              <Button
                size="lg"
                className="w-full max-w-sm mx-auto bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  window.location.href = "/#sourcecodes";
                }}
              >
                Browse Source Codes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
