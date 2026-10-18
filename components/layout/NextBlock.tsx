import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Container";

/** Ends every long page: points to the most relevant next page, never a dead end. */
export function NextBlock({
  title,
  description,
  href,
  label = "Next",
}: {
  title: string;
  description: string;
  href: string;
  label?: string;
}) {
  return (
    <section aria-label="Next page" className="border-t border-border">
      <div className="mx-auto max-w-content gutter-x py-16 md:py-20">
        <Link
          href={href}
          data-track={`next_${href}`}
          className="group flex flex-col gap-4 rounded-panel border border-border bg-surface-1 p-6 transition-colors duration-hover hover:border-border-strong md:flex-row md:items-center md:justify-between md:p-10"
        >
          <span className="flex flex-col gap-3">
            <Eyebrow>{label}</Eyebrow>
            <span className="font-display text-h2 font-semibold text-text">{title}</span>
            <span className="max-w-reading text-body text-text-muted">{description}</span>
          </span>
          <span
            aria-hidden
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-border-strong text-text transition-colors duration-hover group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
          >
            <ArrowRight
              className="size-6 transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
              strokeWidth={1.5}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
