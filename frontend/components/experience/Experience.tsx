"use client";

import { ExperienceHeader } from "./components/ExperienceHeader";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ExperienceStats } from "./components/ExperienceStats";
import { ExperienceSkills } from "./components/ExperienceSkills";
import { experienceData } from "./data";

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
        {/* <ExperienceSkills skills={experienceData.skills} /> */}
      </div>
    </div>
  );
}
