import { z } from "zod";
import { interestOptions } from "@/data/navigation";

// Our CSP disallows eval; jitless mode stops Zod probing for it with Function("").
z.config({ jitless: true });

/** One schema, used by the form (client) and the route handler (server). */

export const industryOptions = [
  { value: "freight", label: "Logistics and freight" },
  { value: "ports", label: "Ports and maritime" },
  { value: "warehousing", label: "Warehousing" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "technology", label: "AI and industrial technology" },
  { value: "space", label: "Space and aerospace" },
  { value: "automotive", label: "Automotive and autonomous mobility" },
  { value: "robotics", label: "Robotics and autonomous systems" },
  { value: "green-energy", label: "Energy and infrastructure" },
  { value: "other", label: "Other" },
] as const;

const industryValues = industryOptions.map((o) => o.value) as [string, ...string[]];
const interestValues = interestOptions.map((o) => o.value) as [string, ...string[]];

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;
export const MIN_FILL_MS = 3000;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Enter your full name, at least 2 characters." })
    .max(80, { error: "Keep your name under 80 characters." }),
  company: z
    .string()
    .trim()
    .min(2, { error: "Enter your company or organisation name." })
    .max(120, { error: "Keep the company name under 120 characters." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Enter your work email, like name@company.com" })
    .pipe(z.email({ error: "Enter an email like name@company.com" })),
  industry: z.enum(industryValues, { error: "Choose the industry closest to yours." }),
  interest: z.enum(interestValues, { error: "Choose an area of interest." }),
  pilot: z.boolean(),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, { error: `Tell us a little more: at least ${MESSAGE_MIN} characters.` })
    .max(MESSAGE_MAX, { error: `Keep your message under ${MESSAGE_MAX.toLocaleString("en-IN")} characters.` }),
  consent: z.literal(true, { error: "Tick this box to agree to the Privacy Policy." }),
  /** Honeypot: hidden from people. Accepted here, rejected by the route if filled. */
  website: z.string().max(500).optional(),
  /** When the form was first shown, for the minimum time-to-submit check. */
  startedAt: z.number(),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type ContactResponse =
  | { ok: true; validated: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactData, string[]>> };
