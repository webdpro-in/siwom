/**
 * Site-wide configuration. Nothing here may be invented: no addresses, phone
 * numbers or social accounts until real ones exist.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const site = {
  name: "SIWOM",
  tagline: "Moving industries forward.",
  principle: "Safety First. Intelligence Everywhere.",
  description:
    "SIWOM is building an intelligent platform connecting global supply chains across logistics, space, robotics and automotive, linking international suppliers, Indian manufacturers and buyers, and logistics providers across ocean, air and land. Safety first. Built from India.",
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
