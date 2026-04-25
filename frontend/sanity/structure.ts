import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  CodeIcon,
  ImageIcon,
  DocumentIcon,
  LinkIcon,
  ActivityIcon,
  ChartUpwardIcon,
} from "@sanity/icons";
import { Activity, Monitor, Briefcase, Database, Rss, Globe, MapPin, Building2, Download } from "lucide-react";
import { SiteAnalyticsDashboard } from "@/components/admin/SiteAnalyticsDashboard";
import { SystemMonitoringDashboard } from "@/components/admin/SystemMonitoringDashboard";
import { JobsDashboard } from "@/components/admin/JobsDashboard";
import { CrawlsDashboard } from "@/components/admin/CrawlsDashboard";
import { RSSFeedsDashboard } from "@/components/admin/RSSFeedsDashboard";
import { SourcesDashboard } from "@/components/admin/SourcesDashboard";
import { CountriesDashboard } from "@/components/admin/CountriesDashboard";
import { CitiesDashboard } from "@/components/admin/CitiesDashboard";
import { CompaniesDashboard } from "@/components/admin/CompaniesDashboard";
import { SeedDashboard } from "@/components/admin/SeedDashboard";

const CONTENT_TYPES = ["sourceCode", "docFile", "imageFile"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Content documents
      ...S.documentTypeListItems()
        .filter((item) => CONTENT_TYPES.includes(item.getId() as string))
        .map((item) => {
          const id = item.getId() as string;
          const iconMap: Record<string, React.ComponentType> = {
            sourceCode: CodeIcon,
            imageFile: ImageIcon,
            docFile: DocumentIcon,
          };
          return item
            .title((item.getTitle() as string) + "s")
            .icon(iconMap[id] ?? DocumentIcon);
        }),

      // Site Settings
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("settings").documentId("siteSettings")),

      S.divider(),

      // Events - custom dashboard (Site Analytics)
      S.listItem()
        .title("Events")
        .icon(Activity)
        .child(S.component(SiteAnalyticsDashboard).title("Events")),

      // System Monitoring - custom dashboard
      S.listItem()
        .title("System Monitoring")
        .icon(Monitor)
        .child(
          S.component(SystemMonitoringDashboard).title("Monitoring Dashboard"),
        ),

      // Jobs - custom dashboard
      S.listItem()
        .id("jobs")
        .title("Jobs")
        .icon(Briefcase)
        .child(S.component(JobsDashboard).title("Jobs")),

      // Crawls - crawling sessions & metadata
      S.listItem()
        .id("crawls")
        .title("Crawls")
        .icon(Database)
        .child(S.component(CrawlsDashboard).title("Crawl Sessions")),

      // RSS Feeds - RSS/Atom feed registry (tabular view)
      S.listItem()
        .id("rssFeeds")
        .title("RSS Feeds")
        .icon(Rss)
        .child(S.component(RSSFeedsDashboard).title("RSS Feeds")),

      // Sources - job source registry (tabular view)
      S.listItem()
        .id("sources")
        .title("Sources")
        .icon(Globe)
        .child(S.component(SourcesDashboard).title("Sources")),

      S.divider(),

      // Countries - custom dashboard (countries with geolocation)
      S.listItem()
        .id("countries")
        .title("Countries")
        .icon(MapPin)
        .child(S.component(CountriesDashboard).title("Countries & Cities")),

      // Cities - dedicated cities dashboard (elegant custom UI)
      S.listItem()
        .id("cities")
        .title("Cities")
        .icon(Building2)
        .child(S.component(CitiesDashboard).title("Cities")),

      // Seed - geography seed from OpenStreetMap
      S.listItem()
        .id("seed")
        .title("Seed")
        .icon(Download)
        .child(S.component(SeedDashboard).title("Geography Seed")),

      // Companies - custom dashboard (IT/software companies + crawl runs)
      S.listItem()
        .id("companies")
        .title("Companies")
        .icon(Building2)
        .child(S.component(CompaniesDashboard).title("Companies")),

      S.divider(),

      /*
      // User Activity - document type lists
      S.listItem()
        .title("User Activity")
        .icon(ActivityIcon)
        .child(
          S.list()
            .title("User Activity")
            .items([
              S.listItem()
                .title("Page Views")
                .child(S.documentTypeList("pageView").title("Page Views")),
              S.listItem()
                .title("User Events")
                .child(S.documentTypeList("userEvent").title("User Events")),
            ]),
        ),

      // System Metrics - document type lists
      S.listItem()
        .title("System Metrics")
        .icon(ChartUpwardIcon)
        .child(
          S.list()
            .title("System Metrics")
            .items([
              S.listItem()
                .title("System Metrics")
                .child(
                  S.documentTypeList("systemMetric").title("System Metrics"),
                ),
              S.listItem()
                .title("Performance Metrics")
                .child(
                  S.documentTypeList("performanceMetric").title(
                    "Performance Metrics",
                  ),
                ),
              S.listItem()
                .title("Error Logs")
                .child(S.documentTypeList("errorLog").title("Error Logs")),
            ]),
        ),

      S.listItem()
        .title("Resume Downloads")
        .icon(LinkIcon)
        .child(S.documentTypeList("resumeDownload").title("Resume Downloads")),
      */
    ]);
