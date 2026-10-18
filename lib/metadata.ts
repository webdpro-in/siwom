import type { Metadata } from "next";

/** Unique title, description and canonical URL per page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · SIWOM`, description, url: path, siteName: "SIWOM", type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title: `${title} · SIWOM`, description },
  };
}
