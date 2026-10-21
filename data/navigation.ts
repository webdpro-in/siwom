export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/**
 * Primary navigation, in order. The product comes first, then who it is for,
 * then the research tracks. Labels must match page headings.
 */
export const mainNav: NavItem[] = [
  {
    label: "Logistics OS",
    href: "/logistics-os",
    description: "SIWOM Stream: shipments, vehicles and delays in one place",
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Ports, freight, warehousing and manufacturing",
  },
  {
    label: "Global Trade",
    href: "/global-trade",
    description: "Research: logistics for space and advanced-technology cargo",
  },
  {
    label: "Safety AI",
    href: "/safety-ai",
    description: "Research: hazard flagging with people accountable",
  },
  {
    label: "Technology",
    href: "/technology",
    description: "How the platform works and what we are researching",
  },
  {
    label: "About",
    href: "/about",
    description: "Who we are and how we work",
  },
];

export const footerNav = {
  product: [
    { label: "Logistics OS", href: "/logistics-os" },
    { label: "Try the demo", href: "/logistics-os#demo" },
    { label: "Industries", href: "/industries" },
  ],
  research: [
    { label: "Global Trade", href: "/global-trade" },
    { label: "Safety AI", href: "/safety-ai" },
    { label: "Our Vision", href: "/vision" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Technology", href: "/technology" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
} as const;

/** Values accepted by the contact form's ?interest= parameter. */
export const interestOptions = [
  { value: "logistics-os", label: "Logistics OS" },
  { value: "global-trade", label: "Global trade" },
  { value: "space", label: "Space logistics" },
  { value: "safety-ai", label: "Safety AI" },
  { value: "robotics", label: "Robotics" },
  { value: "mobility", label: "Mobility" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export type Interest = (typeof interestOptions)[number]["value"];

export function contactHref(options: { interest?: Interest; pilot?: boolean } = {}) {
  const params = new URLSearchParams();
  if (options.interest) params.set("interest", options.interest);
  if (options.pilot) params.set("pilot", "1");
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}
