"use client";

import { ExperienceHeader } from "./components/ExperienceHeader";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ExperienceStats } from "./components/ExperienceStats";
import { ExperienceSkills } from "./components/ExperienceSkills";

// Experience data parsed from resume
const experienceData = {
  positions: [
    {
      id: 1,
      company: "Cefalo",
      location: "Dhaka, Bangladesh",
      position: "Senior Software Engineer",
      duration: "2020–2024",
      applications: [
        {
          title: "SportEdit",
          link: "#",
          countries: [
            "Norway",
            // "Denmark",
            "Sweden",
            "Finland",
            "Iceland",
            "United Kingdom",
            "Ireland",
            "Germany",
            // "France",
            // "Spain",
            // "Italy",
            // "Netherlands",
            // "Belgium",
            // "Austria",
            // "Switzerland",
            // "Portugal",
            // "Poland",
            // "Czech Republic",
            // "Hungary",
            // "Slovakia",
            // "Slovenia",
            // "Croatia",
            // "Romania",
            // "Bulgaria",
            // "Greece",
            // "Estonia",
            // "Latvia",
            // "Lithuania",
          ],
        },
      ],
      achievements: [
        "API and Web App Development: Developed a multilingual sports data API for my client NTB in Norway, which broadcasts live winter sports data from all over Europe, covering major events like the World Cup, the World Championship, Grand Prix and the Olympics. This API has been widely used by our customers, the major television channels in Norway such as NRK, TV2, and Nettavisen. I also provided solutions with GraphQL and ReactJS in our admin panel's internal tools, with different modules such as broadcasting service, standings calculation, results service, export tool.",
        "Cache management: Developed a cache invalidation service that invalidates cache based on database mutation, the mutation triggers invalidation of cache for specified endpoints to ensure the most recent data.",
        'Cloud automation: Automated cloud workflows using Bitbucket CI, TeamCity, Octopus, and AWS for building, tagging, and deploying applications. My work with AWS includes working on an integration testing framework with "aws-local", which simulates AWS services (S3, SNS, SQS, RDS, EC2) to further validate our backend services on local machines.',
        "Neo4j query framework: Developed a Neo4j query framework for my client that allows developers to construct complex Cypher queries with minimal code while reducing error rates. In longer Cypher queries, traversing through many nodes within a single query, it is hard to keep track of heavily aggregated matched nodes in the query runtime. This query framework tried to minimize that and we were able to rewrite thousands of lines of Cypher query with just 20-30 lines of code.",
      ],
      technologies: [
        "GraphQL",
        "ReactJS",
        "AWS",
        "Neo4j",
        "Bitbucket CI",
        "TeamCity",
        "Octopus",
        "S3",
        "SNS",
        "SQS",
        "RDS",
        "EC2",
      ],
    },
    {
      id: 2,
      company: "Kickbackapps Inc.",
      location: "Dhaka, Bangladesh",
      position: "Software Engineer",
      duration: "2019–2020",
      applications: [
        {
          title: "PhoneLine",
          link: "#",
          countries: ["United States", "Canada", "United Kingdom"],
        },
        {
          title: "GhostCall",
          link: "#",
          countries: ["United States", "Canada", "United Kingdom"],
        },
        {
          title: "PrankDial",
          link: "#",
          countries: ["United States", "Canada", "United Kingdom"],
        },
        {
          title: "Chatflix",
          link: "#",
          countries: ["Bangladesh"],
        },
        { title: "Cogman Admin", link: "#", countries: ["Bangladesh"] },
        { title: "Gokada", link: "#", countries: ["Nigeria"] },
      ],
      achievements: [
        "Software development: Worked on backend services for applications such as PhoneLine, Gokada, Prankdial, Chatflix. On these applications, my responsibility was to integrate new third party services as Twilio, Plivo, InfoBIP. I have provided fullstack solution for Chatflix application, database design, backend development, frontend development, and deployments.",
      ],
      technologies: [
        "Twilio",
        "Plivo",
        "InfoBIP",
        "Fullstack Development",
        "Database Design",
      ],
    },
    {
      id: 3,
      company: "Shimahin Limited",
      location: "Dhaka, Bangladesh",
      position: "Software Engineer",
      duration: "2018–2019",
      applications: [
        { title: "Shimahin Ecommerce", link: "#", countries: ["Bangladesh"] },
      ],
      achievements: [
        "Backend development: My responsibilities were building microservices and APIs for key operational services including order processing, delivery management, payment gateway integration, social-networking platform integration, Ecommerce store and other third party plugin integrations.",
      ],
      technologies: [
        "Microservices",
        "APIs",
        "Payment Gateway",
        "Ecommerce",
        "Third Party Integrations",
      ],
    },
  ],
  stats: {
    totalYears: 6,
    companies: 3,
    projects: 15,
    technologies: 25,
  },
  skills: {
    frontend: ["ReactJS", "GraphQL", "TypeScript", "JavaScript", "HTML", "CSS"],
    backend: ["Node.js", "Python", "Java", "Microservices", "APIs", "REST"],
    cloud: ["AWS", "S3", "SNS", "SQS", "RDS", "EC2", "CI/CD"],
    database: ["Neo4j", "MongoDB", "PostgreSQL", "MySQL"],
    tools: ["Bitbucket CI", "TeamCity", "Octopus", "Docker", "Git"],
  },
};

export function Experience() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary/30 to-primary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ExperienceHeader />
        <ExperienceStats stats={experienceData.stats} />
        <ExperienceTimeline positions={experienceData.positions} />
        <ExperienceSkills skills={experienceData.skills} />
      </div>
    </div>
  );
}
