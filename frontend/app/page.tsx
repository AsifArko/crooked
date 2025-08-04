import { Suspense } from "react";
import { Hero } from "@/components/hero/Hero";
import { Loading } from "@/components/layout/Loading";
import { GithubActivity } from "@/components/github/components/GithubActivity";
import { Projects } from "@/components/projects/Projects";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <Hero />
        <GithubActivity />
        <Projects />
      </Suspense>
    </main>
  );
}
