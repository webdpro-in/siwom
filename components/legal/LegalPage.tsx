import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Container";
import { NextBlock } from "@/components/layout/NextBlock";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Readable 68ch legal layout with contents list and the draft banner. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <div className="mx-auto max-w-reading gutter-x pt-[calc(var(--header-h)+2.5rem)] pb-16 md:box-content md:pt-[calc(var(--header-h)+4rem)]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} className="mb-8" />
        <div role="note" className="mb-10 flex gap-3 rounded-card border border-sev-medium/50 bg-surface-1 p-4">
          <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-sev-medium" strokeWidth={1.75} />
          <p className="text-small text-text">
            <strong className="font-medium">Draft — to be reviewed by qualified legal counsel before publication.</strong>{" "}
            <span className="text-text-muted">This starter text is not legal advice and may change.</span>
          </p>
        </div>
        <Eyebrow>Legal</Eyebrow>
        <h1 id="page-title" className="mt-4 text-h1 text-text">
          {title}
        </h1>
        <p className="mt-3 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Draft, last edited {updated}</p>
        <div className="mt-6 text-body-l text-text-muted">{intro}</div>

        <nav aria-label="Contents" className="mt-10 rounded-card border border-border bg-surface-1 p-5">
          <h2 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">Contents</h2>
          <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-small marker:text-text-muted">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-text underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
              <h2 id={`${s.id}-title`} className="text-h3 text-text">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 text-body text-text-muted [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-text">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
      <NextBlock title="Contact SIWOM" description="Questions about this policy? Write to us." href="/contact" />
    </>
  );
}
