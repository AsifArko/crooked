import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";
import { ContactHero, ContactForm, ContactInfo } from "@/components/contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <ContactHero />
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-6 pb-12 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
