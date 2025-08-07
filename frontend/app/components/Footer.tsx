"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
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
                    <Link
                      href="#projects"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#documents"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Documents
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#github"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      GitHub
                    </Link>
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
                      href="mailto:contact@asifarko.com"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Email
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://linkedin.com/in/asifarko"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/asifarko"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      GitHub
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
                    <Link
                      href="#about"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      About Me
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#skills"
                      className="text-sm text-muted-foreground/70 hover:text-foreground/80"
                    >
                      Skills
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#experience"
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
