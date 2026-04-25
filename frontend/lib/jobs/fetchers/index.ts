import type { NormalizedJob } from "../types";
import type { CrawlParams } from "../types";
import { fetchRemotiveJobs } from "./remotive";
import { fetchArbeitnowJobs } from "./arbeitnow";
import { fetchAdzunaJobs } from "./adzuna";
import { fetchTheMuseJobs } from "./themuse";
import { fetchUsaJobs } from "./usajobs";
import { fetchRemoteOkJobs } from "./remoteok";
import { fetchAllRssJobs } from "./rss-batch";
import { fetchGreenhouseJobs } from "./greenhouse";

export type { NormalizedJob, CrawlParams } from "../types";

export type FetcherResult = { source: string; jobs: NormalizedJob[]; error?: string };

const run = (
  p: PromiseSettledResult<NormalizedJob[]>,
  source: string
): FetcherResult => {
  if (p.status === "fulfilled") {
    return { source, jobs: p.value };
  }
  return {
    source,
    jobs: [],
    error: p.reason?.message ?? "Unknown error",
  };
};

export async function fetchAllJobs(params?: CrawlParams): Promise<FetcherResult[]> {
  const results: FetcherResult[] = [];

  const crawlParams = {
    countryCode: params?.countryCode,
    search: params?.search,
    location: params?.location,
  };

  const [apiSettled, rssResults, greenhouseResult] = await Promise.all([
    Promise.allSettled([
      fetchRemotiveJobs(),
      fetchArbeitnowJobs(),
      fetchAdzunaJobs(crawlParams),
      fetchTheMuseJobs({
        search: params?.search,
        category: params?.search ? undefined : undefined,
      }),
      fetchUsaJobs({ search: params?.search }),
      fetchRemoteOkJobs(),
    ]),
    fetchAllRssJobs(),
    fetchGreenhouseJobs(),
  ]);

  const [r, a, ad, t, u, ro] = apiSettled as PromiseSettledResult<NormalizedJob[]>[];
  results.push(run(r, "remotive"));
  results.push(run(a, "arbeitnow"));
  results.push(run(ad, "adzuna"));
  results.push(run(t, "themuse"));
  results.push(run(u, "usajobs"));
  results.push(run(ro, "remoteok"));

  for (const { source, jobs, error } of rssResults) {
    results.push({ source, jobs, error });
  }

  results.push({
    source: greenhouseResult.source,
    jobs: greenhouseResult.jobs,
    error: greenhouseResult.error,
  });

  return results;
}
