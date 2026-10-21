import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { interestOptions, type Interest } from "@/data/navigation";
import { NextBlock } from "@/components/layout/NextBlock";
import { Eyebrow } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/States";
import { ContactFormLazy as ContactForm } from "@/components/contact/ContactFormLazy";

export const metadata: Metadata = pageMetadata({
  title: "Contact: discuss a pilot",
  description: "Talk to SIWOM about a logistics or safety pilot, a partnership or global trade. Tell us about your operation and the problem you want to solve.",
  path: "/contact",
});

/** Reads ?interest= and ?pilot=1 so the visitor never re-states what they clicked. */
async function PrefilledForm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  // Older links used ?interest=logistics-os and ?interest=safety-ai.
  const legacy: Record<string, string> = {
    "logistics-os": "logistics",
    "safety-ai": "safety",
    mobility: "automotive",
    autonomy: "robotics",
    "green-energy": "energy",
  };
  const given = typeof params.interest === "string" ? params.interest : undefined;
  const raw = given ? (legacy[given] ?? given) : undefined;
  const interest = interestOptions.some((o) => o.value === raw) ? (raw as Interest) : undefined;
  const pilot = params.pilot === "1" || params.pilot === "true";
  return <ContactForm defaultInterest={interest} defaultPilot={pilot} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined} />;
}

function FormSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading the contact form" className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-14 w-48" />
    </div>
  );
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <>
      <section data-hero aria-labelledby="page-title" className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-grid" />
        <div className="relative mx-auto max-w-content gutter-x pt-[calc(var(--header-h)+2.5rem)] pb-10 md:pt-[calc(var(--header-h)+4rem)]">
          <div className="flex max-w-narrow flex-col gap-5">
            <Eyebrow className="hero-rise">Contact</Eyebrow>
            <h1 id="page-title" className="hero-rise text-h1 text-text">
              Talk to SIWOM
            </h1>
            <p className="hero-rise hero-delay-1 max-w-reading text-body-l text-text-muted">
              Tell us about your operation and the problem you want to solve first. A real problem is the best place to
              start.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content gutter-x pb-20">
        <div className="layout-grid gap-y-12">
          <div id="contact-form" className="relative col-span-4 md:col-span-8 lg:col-span-7">
            <Suspense fallback={<FormSkeleton />}>
              <PrefilledForm searchParams={searchParams} />
            </Suspense>
          </div>
          <section aria-labelledby="next-steps-title" className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-col gap-6 rounded-panel border border-border bg-surface-1 p-6 lg:sticky lg:top-[calc(var(--header-h-compact)+2rem)]">
              <h2 id="next-steps-title" className="text-h3 text-text">
                What happens next
              </h2>
              <ol className="flex flex-col gap-5">
                {[
                  ["We read your message.", "A person on our team, not an autoresponder."],
                  ["We reply to set up a call.", "To understand your operation and constraints."],
                  ["We scope a real problem together.", "One lane, hub or hazard type, with agreed measures of success."],
                ].map(([title, text], i) => (
                  <li key={title} className="flex gap-4">
                    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border-strong font-mono text-small text-text">
                      {i + 1}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-body font-medium text-text">{title}</span>
                      <span className="text-small text-text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="border-t border-border pt-5">
                <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Your enquiry, handled with care</p>
                <p className="mt-2 text-small text-text-muted">Use the form to reach the team. We use your details to respond to your enquiry.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <NextBlock title="Logistics" description="While you are here, try the Logistics demo with illustrative Indian routes and exceptions." href="/logistics" />
    </>
  );
}
