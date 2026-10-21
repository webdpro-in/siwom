/**
 * Site-wide configuration. Nothing here may be invented: no addresses, phone
 * numbers or social accounts until real ones exist.
 */

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL to the production domain. On
 * Vercel, the project's production domain is used when it is not set, so
 * canonical URLs never point at a preview deployment. Only server code reads
 * this file, so the non-public Vercel variables are available at build time.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000");

/** Preview and development deployments must never be indexed. */
export const isIndexable = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export const site = {
  name: "SIWOM",
  tagline: "Shipment coordination software for logistics companies.",
  principle: "Safety First. Intelligence Everywhere.",
  description:
    "SIWOM is building SIWOM Stream, shipment coordination software for Indian logistics companies: shipments, vehicles, documents and delays in one shared view, from port or airport to final delivery. In development; pilot partners welcome.",
  url: rawSiteUrl.replace(/\/$/, ""),
  locale: "en_IN",
  /**
   * Social links render only when a URL is set. Leave empty until the accounts
   * exist; the footer shows nothing for empty entries.
   */
  social: {
    linkedin: "",
    x: "",
    github: "",
  } satisfies Record<string, string>,
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
