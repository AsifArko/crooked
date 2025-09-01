import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Database,
  Cloud,
  Settings,
  Layers,
  Zap,
  Server,
  Globe,
  Shield,
  Cpu,
  ShieldCheck,
  Bug,
  Brackets,
} from "lucide-react";

export interface StackCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  technologies: string[];
}

export interface StacksProps {
  categories?: StackCategory[];
  className?: string;
}

const defaultCategories: StackCategory[] = [
  {
    id: "programming",
    title: "Programming Languages & Frameworks",
    icon: Brackets,
    color: "text-muted-foreground/70",
    technologies: [
      "Node.js",
      "TypeScript",
      "Golang",
      "Python",
      "Solidity",
      "PHP",
      "Dart",
      "React.js",
      "React Native",
      "Next.js",
      "Flutter",
      "Laravel",
    ],
  },
  {
    id: "databases",
    title: "Databases & Storage",
    icon: Database,
    color: "text-muted-foreground/70",
    technologies: [
      "Neo4j",
      "MongoDB",
      "Redis",
      "MySQL",
      "Couchbase",
      "PostgreSQL",
      "DynamoDB",
      "Amazon RDS",
      "Amazon S3",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Automation and Monitoring",
    icon: Cloud,
    color: "text-muted-foreground/70",
    technologies: [
      "CloudWatch",
      "Lambda",
      "EC2/ECS",
      "EKS/ EFS/ EBS",
      "SNS/SQS",
      "S3",
      "RDS",
      "DynamoDB",
      "Amazon Lex",
      "Amazon API Gateway",
      "Apache Server",
      "Nginx",
      "Prometheus",
      "Grafana",
      "Serverless",
      "TeamCity",
      "Octopus",
      "CI/CD Automation",
      "Sanity",
      "Vercel",
      "Appsheet",
      "Glide",
      "Webflow",
      "Varnish",
      "HAProxy",
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructural Skills",
    icon: ShieldCheck,
    color: "text-muted-foreground/70",
    technologies: [
      "Linux",
      "System and Network Administration",
      "Docker",
      "Message Brokers",
      "Voice over IP",
      "Scaling and Load Balancers",
      "Firewalls",
      "REST APIs",
      "gRPC",
      "GraphQL",
      "Web Scraping",
      "Blockchain",
      "Ethereum",
      "GDPR Compliance",
      "Smart Contracts",
      "Access Control and File Systems",
      "Virtualization",
      "Containerization",
      "Monitoring",
      "Logging and Alerts",
      "Incident Response",
      "Disaster Recovery",
      "Rollbacks",
      "Data Protection and Governance",
      "Privacy and Security",
      "Data Migration",
      "Data Warehousing",
      "Data Modeling",
      "Data Integration",
      "Business Continuity",
      "Multi-language Support",
      "Cache Management",
    ],
  },
  {
    id: "testing",
    title: "Testing and Quality Assurance",
    icon: Bug,
    color: "text-muted-foreground/70",
    technologies: [
      "Unit Testing",
      "Service Testing",
      "Api Testing",
      "Integration Testing",
      "Performance Testing",
      "System Testing",
      "Acceptance Testing",
      "Regression Testing",
      "Sanity Testing",
      "Stress Testing",
      "Security Testing",
    ],
  },
];

export const Stacks: React.FC<StacksProps> = ({
  categories = defaultCategories,
  className = "",
}) => {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Tech Stack
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group bg-card border border-border/50 bg-gradient-to-br from-background to-background/50 rounded-sm shadow-none transition-all duration-200 overflow-hidden"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted/50">
                    <category.icon
                      className={`h-5 w-5 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                    {category.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs rounded-sm bg-secondary/70 text-muted-foreground/90 font-light hover:bg-secondary/90 transition-colors duration-200"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
