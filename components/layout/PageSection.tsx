import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Status } from "@/data/status";
import { Eyebrow } from "@/components/ui/Container";
import { StatusPill } from "@/components/ui/StatusPill";
import { OnThisPage, type TocItem } from "./OnThisPage";

/** A titled section on a subpage, with an optional status pill. */
export function PageSection({
  id,
  eyebrow,
  title,
  intro,
  status,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  status?: Status;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("border-t border-border py-14 first:border-t-0 first:pt-0 md:py-20", className)}>
      <div data-reveal className="mb-8 flex flex-col gap-4">
        {eyebrow || status ? (
          <div className="flex flex-wrap items-center gap-3">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {status ? <StatusPill status={status} /> : null}
          </div>
        ) : null}
        <h2 id={`${id}-title`} className="max-w-headline text-h2 text-text">
          {title}
        </h2>
        {intro ? <div className="max-w-reading text-body-l text-text-muted">{intro}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Long subpages: sticky contents on the left (desktop), collapsible on mobile. */
export function LongPage({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-content gutter-x pb-8 pt-8 md:pt-12">
      <div className="layout-grid gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <OnThisPage items={toc} />
        </div>
        <div className="col-span-4 min-w-0 md:col-span-8 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex max-w-reading flex-col gap-4 text-body text-text-muted [&_strong]:font-medium [&_strong]:text-text", className)}>
      {children}
    </div>
  );
}

export function CheckList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("flex max-w-reading flex-col gap-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-body text-text-muted">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-text-muted" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
