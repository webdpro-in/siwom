export type NavItem = {
  label: string;
  href: string;
  description: string;
};

/**
 * Primary navigation, in order: the current product, where it applies, the
 * research and development programmes, then the company. Labels must match
 * page headings.
 */
export const mainNav: NavItem[] = [
  { label: "Logistics", href: "/logistics", description: "SIWOM Logistics: international shipment coordination" },
  { label: "Industries", href: "/industries", description: "Six industries, from logistics to space and energy" },
  { label: "Global Trade", href: "/global-trade", description: "Research and development: sourcing and trade intelligence" },
  { label: "Safety", href: "/safety", description: "Research and development: human-reviewed hazard flagging" },
  { label: "Technology", href: "/technology", description: "The platform and SIWOM Intelligence (SI)" },
  { label: "Vision", href: "/vision", description: "Roadmap and long-term directions" },
  { label: "About", href: "/about", description: "Who we are and how we work" },
];

export const footerNav = {
  product: [
    { label: "SIWOM Logistics", href: "/logistics" },
    { label: "The workspace", href: "/logistics#demo" },
    { label: "Industries", href: "/industries" },
  ],
  research: [
    { label: "SIWOM Global Trade", href: "/global-trade" },
    { label: "SIWOM Safety", href: "/safety" },
    { label: "Vision and roadmap", href: "/vision" },
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
  { value: "logistics", label: "Logistics" },
  { value: "ai", label: "AI & industrial intelligence" },
  { value: "space", label: "Space & aerospace" },
  { value: "automotive", label: "Automotive & mobility" },
  { value: "robotics", label: "Robotics" },
  { value: "energy", label: "Energy & infrastructure" },
  { value: "global-trade", label: "Global trade" },
  { value: "safety", label: "Safety" },
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
