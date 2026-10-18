import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center rounded-xs underline-offset-4 hover:text-text hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-text")}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight aria-hidden className="size-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-80 -translate-y-24 rounded-control bg-accent px-4 py-3 text-small font-medium text-accent-ink transition-transform duration-ui focus:translate-y-0 motion-reduce:transition-none"
    >
      Skip to main content
    </a>
  );
}
