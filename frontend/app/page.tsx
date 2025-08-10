import { Suspense } from "react";
import { Hero } from "@/components/hero/Hero";
import { Loading } from "@/components/layout/Loading";
import { GithubActivity } from "@/components/github/components/GithubActivity";
import { SourceCodes } from "@/components/sourcecodes";
import { Stacks } from "@/components/stacks";
import { Testimonials } from "@/components/testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <Hero />
        <GithubActivity />
        <SourceCodes />
        <Testimonials />
        <Stacks />
      </Suspense>
    </main>
  );
}
