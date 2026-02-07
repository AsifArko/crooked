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
import { Activity, Monitor, Download } from "lucide-react";
import { SiteAnalyticsDashboard } from "@/components/admin/SiteAnalyticsDashboard";
import { SystemMonitoringDashboard } from "@/components/admin/SystemMonitoringDashboard";
import { UserDownloadsDashboard } from "@/components/admin/UserDownloadsDashboard";

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

      // Site Analytics - custom dashboard
      S.listItem()
        .title("Site Analytics")
        .icon(Activity)
        .child(
          S.component(SiteAnalyticsDashboard).title("Analytics Dashboard")
        ),

      // System Monitoring - custom dashboard
      S.listItem()
        .title("System Monitoring")
        .icon(Monitor)
        .child(
          S.component(SystemMonitoringDashboard).title("Monitoring Dashboard")
        ),

      // User Downloads - custom dashboard
      S.listItem()
        .title("User Downloads")
        .icon(Download)
        .child(
          S.component(UserDownloadsDashboard).title("User Download Management")
        ),

      S.divider(),

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
            ])
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
                  S.documentTypeList("systemMetric").title("System Metrics")
                ),
              S.listItem()
                .title("Performance Metrics")
                .child(
                  S.documentTypeList("performanceMetric").title(
                    "Performance Metrics"
                  )
                ),
              S.listItem()
                .title("Error Logs")
                .child(S.documentTypeList("errorLog").title("Error Logs")),
            ])
        ),

      S.listItem()
        .title("Resume Downloads")
        .icon(LinkIcon)
        .child(
          S.documentTypeList("resumeDownload").title("Resume Downloads")
        ),
    ]);
