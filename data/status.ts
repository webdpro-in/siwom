/**
 * The status-label system (Section 2). Every product, card, demo and roadmap
 * item carries exactly one of these. Do not add "LIVE" or "AVAILABLE" until a
 * product actually ships.
 */
export type Status = "in-development" | "research" | "vision" | "demo";

export const statusMeta: Record<Status, { label: string; meaning: string }> = {
  "in-development": {
    label: "In development",
    meaning: "Actively being built and validated. Not yet generally available.",
  },
  research: {
    label: "Research",
    meaning: "Being explored. Feasibility is not yet proven.",
  },
  vision: {
    label: "Long-term vision",
    meaning: "An ambition we are working toward. No build has started.",
  },
  demo: {
    label: "Demo data",
    meaning: "Sample data for illustration, not connected to live operations.",
  },
};

export const statusOrder: Status[] = ["in-development", "research", "vision", "demo"];

/**
 * Product-status badges (In development, Research, Long-term vision) are
 * hidden across the public site by the owner's decision. "Demo data" always
 * shows, because demo records are fictional. Set to true to show them again.
 */
export const showProductStatus = false;
