export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/** Primary navigation, in order. Labels must match page headings. */
export const mainNav: NavItem[] = [
  {
    label: "Logistics OS",
    href: "/logistics-os",
    description: "Shipments, fleets and dispatch in one view",
  },
  {
    label: "Global Trade",
    href: "/global-trade",
    description: "Space, robotics and mobility supply chains",
  },
  {
    label: "Safety AI",
    href: "/safety-ai",
    description: "Hazard flagging and inspection, with people accountable",
  },
  {
    label: "Technology",
    href: "/technology",
    description: "Platform, architecture and research areas",
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Ports, freight, space, green energy and robotics",
  },
  {
    label: "Our Vision",
    href: "/vision",
    description: "Autonomy, mobility and industrial intelligence",
  },
  {
    label: "About",
    href: "/about",
    description: "Mission, principles and how we work",
  },
];

export const footerNav = {
  products: [
    { label: "Logistics OS", href: "/logistics-os" },
    { label: "Global Trade", href: "/global-trade" },
    { label: "Safety AI", href: "/safety-ai" },
  ],
  company: [
    { label: "Technology", href: "/technology" },
    { label: "Industries", href: "/industries" },
    { label: "Our Vision", href: "/vision" },
    { label: "About", href: "/about" },
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
