export type CrawlParams = {
  search?: string;
  countryCode?: string;
  location?: string;
  source?: string;
};

export type NormalizedJob = {
  externalId: string;
  source: string;
  sourceVariant?: string;
  title: string;
  companyName: string;
  description: string;
  url: string;
  locationRaw: string;
  remote: boolean;
  jobType?: string;
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  postedAt: string;
  tags?: string[];
  urlDomain?: string;
};
