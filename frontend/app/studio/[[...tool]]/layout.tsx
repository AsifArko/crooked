import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Content management for the portfolio website",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
