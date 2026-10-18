/**
 * Privacy-friendly, cookieless analytics. When NEXT_PUBLIC_PLAUSIBLE_DOMAIN is
 * set, the root layout loads Plausible (no cookies, no consent banner needed)
 * and these events are forwarded to it. Otherwise every call is a no-op.
 */

export type AnalyticsEvent =
  | { name: "cta_click"; props: { label: string; href: string; location: string } }
  | { name: "demo_interaction"; props: { demo: "logistics" | "safety"; action: string } }
  | { name: "contact_submit"; props: { result: "success" | "error"; interest?: string } };

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  if (!plausible) return;
  plausible(event.name, { props: event.props as Record<string, string> });
}
