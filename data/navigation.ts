export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/**
 * Primary navigation, in order. The product comes first, then who it is for,
 * then the other solutions. Labels must match page headings.
 */
export const mainNav: NavItem[] = [
  {
    label: "Logistics",
    href: "/logistics",
    description: "SIWOM Logistics: shipments, vehicles and delays in one place",
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Ports, freight, warehousing and manufacturing",
  },
  {
    label: "Global Trade",
    href: "/global-trade",
    description: "Space and advanced-technology cargo, imports and exports",
  },
  {
    label: "Safety",
    href: "/safety",
    description: "Hazard flagging with people accountable",
  },
  {
    label: "Technology",
    href: "/technology",
    description: "How the platform works",
  },
  {
    label: "About",
    href: "/about",
    description: "Who we are and how we work",
  },
];

export const footerNav = {
  solutions: [
    { label: "Logistics", href: "/logistics" },
    { label: "Global Trade", href: "/global-trade" },
    { label: "Safety", href: "/safety" },
    { label: "Try the demo", href: "/logistics#demo" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Industries", href: "/industries" },
    { label: "Technology", href: "/technology" },
    { label: "Our Vision", href: "/vision" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
} as const;

/** Values accepted by the contact form's ?interest= parameter. */
export const interestOptions = [
  { value: "logistics", label: "Logistics" },
  { value: "global-trade", label: "Global trade" },
  { value: "space", label: "Space logistics" },
  { value: "safety", label: "Safety" },
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
