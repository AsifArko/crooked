"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const scrollToSection = (sectionId: string, router: any, pathname: string) => {
  // Check if we're on the homepage
  if (pathname !== "/") {
    // Navigate to homepage with hash
    router.push(`/#${sectionId}`);
    return;
  }

  // If already on homepage, scroll to section
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.footer
      className="bg-background border-t"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground/80">
                Crooked
              </h3>
              <p className="mt-4 text-sm text-muted-foreground/70">
                Full Stack Developer passionate about building modern web
                applications with cutting-edge technologies and clean,
                maintainable code.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="https://x.com/asif_imch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link
                href="https://github.com/quantum-atmosphere"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground/80">
                  Portfolio
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <button
                      onClick={() =>
                        scrollToSection("sourcecodes", router, pathname)
                      }
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80 cursor-pointer"
                    >
                      Source Codes
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() =>
                        scrollToSection("github", router, pathname)
                      }
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80 cursor-pointer"
                    >
                      GitHub
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground/80">
                  Contact
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.linkedin.com/in/asifimch/"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://x.com/asif_imch"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Twitter
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground/80">
                  About
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <button
                      onClick={() => scrollToSection("about", router, pathname)}
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80 cursor-pointer"
                    >
                      About Me
                    </button>
                  </li>

                  <li>
                    <Link
                      href="/experience"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Experience
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground/80">
                  Legal
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground/70">
            © 2025 Crooked. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Thank you for supporting Crooked.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
