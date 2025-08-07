import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TermsAnimation } from "@/components/animations";
import {
  FileText,
  Shield,
  Users,
  Globe,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Scale,
  Gavel,
  Lock,
  Eye,
  Heart,
  Mail,
  Github,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Crooked",
  description:
    "Terms of Service for Crooked, Asif's personal portfolio and software engineering showcase.",
};

const termsSections = [
  {
    icon: BookOpen,
    title: "Acceptance of Terms",
    description:
      "By accessing and using Crooked, you accept and agree to be bound by these terms",
    badge: "Legal",
    content:
      "These Terms of Service govern your use of the Crooked portfolio website. By accessing or using this site, you agree to be bound by these terms and all applicable laws and regulations.",
  },
  {
    icon: Users,
    title: "Portfolio Usage",
    description:
      "Guidelines for viewing and interacting with my portfolio content",
    badge: "Usage",
    content:
      "This portfolio is for informational and professional networking purposes. You may view, share, and reference the content for legitimate professional purposes while respecting intellectual property rights.",
  },
  {
    icon: Shield,
    title: "Privacy & Data",
    description: "How I handle your data and maintain your privacy",
    badge: "Privacy",
    content:
      "I am committed to protecting your privacy. Any data collected through this portfolio site is minimal and used only for site functionality. Please review my Privacy Policy for detailed information.",
  },
  {
    icon: Globe,
    title: "Intellectual Property",
    description: "Rights and restrictions regarding portfolio content",
    badge: "IP",
    content:
      "All content on this portfolio, including code samples, designs, and written content, is my intellectual property. You may reference and share links, but reproduction requires permission.",
  },
  {
    icon: Zap,
    title: "Site Availability",
    description: "Information about site availability and maintenance",
    badge: "Service",
    content:
      "I strive to maintain high site availability but cannot guarantee uninterrupted access. The site may be temporarily unavailable for maintenance or updates.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    description: "Limitations on liability for portfolio use",
    badge: "Legal",
    content:
      "This portfolio is provided as-is without warranties. I am not liable for any damages arising from the use of this site or its content.",
  },
];

const keyTerms = [
  {
    icon: CheckCircle,
    title: "Acceptance Required",
    description: "You must accept these terms to use this portfolio site",
    color: "text-foreground/70",
  },
  {
    icon: AlertCircle,
    title: "Respectful Use",
    description: "Use this portfolio respectfully and for legitimate purposes",
    color: "text-foreground/70",
  },
  {
    icon: Clock,
    title: "Effective Date",
    description: "These terms are effective as of the date of publication",
    color: "text-foreground/70",
  },
  {
    icon: Lock,
    title: "Privacy Protection",
    description: "Your privacy is protected according to our policy",
    color: "text-foreground/70",
  },
];

const portfolioPrinciples = [
  {
    icon: Gavel,
    title: "Professional Standards",
    description: "All interactions should maintain professional standards",
    badge: "Professional",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "I am transparent about my work and practices",
    badge: "Transparency",
  },
  {
    icon: Heart,
    title: "User Respect",
    description: "I respect all visitors and their privacy",
    badge: "Respect",
  },
  {
    icon: Scale,
    title: "Fair Use",
    description: "Content should be used fairly and responsibly",
    badge: "Fair Use",
  },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email Contact",
    description: "Reach out for professional inquiries or collaborations",
    link: "mailto:asif.imch@gmail.com",
    external: true,
  },
  {
    icon: Github,
    title: "GitHub Profile",
    description: "View my open source contributions and projects",
    link: "https://github.com/asifarko",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Privacy Policy",
    description: "Review my privacy practices and data handling",
    link: "/privacy",
    external: false,
  },
  {
    icon: FileText,
    title: "Resume",
    description: "Download my professional resume and credentials",
    link: "/resume.pdf",
    external: true,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-12 sm:py-16 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Legal
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Terms of Service
              </h1>
              <p className="text-sm text-foreground/70 font-normal">
                Understanding your rights and responsibilities
              </p>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground/80 sm:text-sm max-w-lg font-light tracking-wide">
              These terms govern your use of my personal portfolio website,
              Crooked. Please read them carefully to understand your rights and
              obligations when accessing and using this site.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-border/50 hover:bg-background/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12 !px-6"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/privacy" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-border/50 hover:bg-background/50 transition-all duration-300 w-full sm:w-auto min-w-[200px] h-12"
                >
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-center">
            <div className="w-full max-w-md h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border/50 flex items-center justify-center">
              <TermsAnimation size="lg" className="w-48 h-48" theme="legal" />
            </div>
          </div>
        </div>

        {/* Enhanced Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary/30 to-primary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Key Terms */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Key Terms
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Important Information
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              Essential terms and conditions you need to understand before using
              this portfolio site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTerms.map((term) => (
              <Card
                key={term.title}
                className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-sm"
              >
                <CardHeader className="pb-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                      <term.icon
                        className={`h-4 w-4 ${term.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {term.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground/70 leading-relaxed font-light">
                    {term.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Terms Sections
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Detailed Terms
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              Comprehensive breakdown of the terms governing this portfolio
              website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {termsSections.map((section) => (
              <Card
                key={section.title}
                className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-sm h-full"
              >
                <CardHeader className="pb-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                      <section.icon className="h-4 w-4 text-foreground/70 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light"
                    >
                      {section.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground/70 leading-relaxed mb-3 font-light">
                    {section.description}
                  </div>
                  <div className="text-xs text-muted-foreground/60 leading-relaxed text-justify font-light">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Principles */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Portfolio Principles
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              My Professional Standards
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              The principles that guide my professional practices and portfolio
              interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioPrinciples.map((principle) => (
              <Card
                key={principle.title}
                className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-sm"
              >
                <CardHeader className="pb-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                      <principle.icon className="h-4 w-4 text-foreground/70 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light"
                    >
                      {principle.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground/70 leading-relaxed font-light">
                    {principle.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
                Contact
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Get in Touch
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              Contact me for professional inquiries, collaborations, or to learn
              more about my work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((contact) => (
              <Card
                key={contact.title}
                className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden hover:shadow-sm cursor-pointer"
              >
                <CardHeader className="pb-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                      <contact.icon className="h-4 w-4 text-foreground/70 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {contact.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground/70 leading-relaxed mb-4 font-light">
                    {contact.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/70 font-medium">
                    <span>Learn more</span>
                    {contact.external ? (
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
