"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
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
              <h3 className="text-lg font-semibold text-foreground">Crooked</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Full Stack Developer passionate about building modern web
                applications with cutting-edge technologies and clean,
                maintainable code.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="https://github.com/asifarko"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link
                href="https://linkedin.com/in/asifarko"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="mailto:contact@asifarko.com">
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
                <h3 className="text-sm font-semibold text-foreground">
                  Portfolio
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="#projects"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#documents"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Documents
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#github"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">
                  Contact
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="mailto:contact@asifarko.com"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Email
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://linkedin.com/in/asifarko"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/asifarko"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">About</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="#about"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      About Me
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#skills"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Skills
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#experience"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Experience
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-muted-foreground hover:text-foreground"
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
          <p className="text-sm text-muted-foreground">
            © 2024 Asif Arko. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
