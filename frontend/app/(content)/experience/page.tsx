import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";
import { Experience } from "@/components/experience/Experience";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <Experience />
      </Suspense>
    </main>
  );
}
