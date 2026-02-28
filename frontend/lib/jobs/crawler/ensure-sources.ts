import { writeClient } from "@/sanity/lib/writeClient";

const SOURCES: Array<{
  _id: string;
  slug: string;
  name: string;
  url: string;
  attribution: string;
  enabled: boolean;
}> = [
  { _id: "jobSource-remotive", slug: "remotive", name: "Remotive", url: "https://remotive.com", attribution: "Jobs by Remotive", enabled: true },
  { _id: "jobSource-arbeitnow", slug: "arbeitnow", name: "Arbeitnow", url: "https://arbeitnow.com", attribution: "Jobs by Arbeitnow", enabled: true },
  { _id: "jobSource-adzuna", slug: "adzuna", name: "Adzuna", url: "https://www.adzuna.com", attribution: "Jobs by Adzuna", enabled: true },
  { _id: "jobSource-themuse", slug: "themuse", name: "The Muse", url: "https://www.themuse.com", attribution: "Jobs by The Muse", enabled: true },
  { _id: "jobSource-usajobs", slug: "usajobs", name: "USAJOBS", url: "https://www.usajobs.gov", attribution: "U.S. federal jobs", enabled: true },
  { _id: "jobSource-remoteok", slug: "remoteok", name: "Remote OK", url: "https://remoteok.com", attribution: "Jobs by Remote OK", enabled: true },
  { _id: "jobSource-jobscollider", slug: "jobscollider", name: "JobsCollider", url: "https://jobscollider.com", attribution: "Jobs by JobsCollider", enabled: true },
  { _id: "jobSource-weworkremotely", slug: "weworkremotely", name: "We Work Remotely", url: "https://weworkremotely.com", attribution: "Jobs by We Work Remotely", enabled: true },
  { _id: "jobSource-remoteco", slug: "remoteco", name: "Remote.co", url: "https://remote.co", attribution: "Jobs by Remote.co", enabled: true },
  { _id: "jobSource-stackoverflow", slug: "stackoverflow", name: "Stack Overflow Jobs", url: "https://stackoverflow.com/jobs", attribution: "Jobs by Stack Overflow", enabled: true },
  { _id: "jobSource-hackernews", slug: "hackernews", name: "Hacker News", url: "https://news.ycombinator.com/jobs", attribution: "Jobs by Y Combinator", enabled: true },
  { _id: "jobSource-authenticjobs", slug: "authenticjobs", name: "Authentic Jobs", url: "https://authenticjobs.com", attribution: "Jobs by Authentic Jobs", enabled: true },
  { _id: "jobSource-dribbble", slug: "dribbble", name: "Dribbble", url: "https://dribbble.com/jobs", attribution: "Jobs by Dribbble", enabled: true },
  { _id: "jobSource-smashingmagazine", slug: "smashingmagazine", name: "Smashing Magazine", url: "https://www.smashingmagazine.com/jobs", attribution: "Jobs by Smashing Magazine", enabled: true },
  { _id: "jobSource-eurobrussels", slug: "eurobrussels", name: "EuroBrussels", url: "https://eurobrussels.com", attribution: "EU jobs by EuroBrussels", enabled: true },
  { _id: "jobSource-greenhouse", slug: "greenhouse", name: "Greenhouse (ATS)", url: "https://boards.greenhouse.io", attribution: "Company job boards via Greenhouse", enabled: true },
  { _id: "jobSource-serpapi-google-jobs", slug: "serpapi-google-jobs", name: "Google Jobs (SerpApi)", url: "https://serpapi.com", attribution: "Jobs via SerpApi Google Jobs", enabled: true },
];

export async function ensureJobSources(): Promise<void> {
  for (const src of SOURCES) {
    const existing = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "jobSource" && _id == $id][0]{ _id }`,
      { id: src._id }
    );
    if (!existing) {
      const { _id, ...rest } = src;
      await writeClient.create({
        _id,
        _type: "jobSource",
        ...rest,
      });
    }
  }
}
