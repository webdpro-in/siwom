"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type TocItem = { id: string; label: string };

/**
 * Sticky in-page contents. Desktop: left column, highlights the current
 * section. Mobile: a collapsible "On this page" control.
 */
export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);
  const listId = useId();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const first = items.find((i) => visible.get(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  const list = (onNavigate?: () => void) => (
    <ul className="flex flex-col">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              onClick={onNavigate}
              className={cn(
                "flex min-h-10 items-center border-l-2 py-1.5 pl-4 text-small transition-colors duration-hover",
                current ? "border-accent text-text" : "border-border text-text-muted hover:text-text",
              )}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav aria-label="On this page" className="sticky top-[calc(var(--header-h-compact)+2rem)] hidden lg:block">
        <p className="mb-4 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">On this page</p>
        {list()}
      </nav>
      <nav aria-label="On this page" className="rounded-card border border-border bg-surface-1 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-12 w-full items-center justify-between px-4 text-small font-medium text-text"
        >
          On this page
          <ChevronDown
            aria-hidden
            className={cn("size-5 text-text-muted transition-transform duration-ui motion-reduce:transition-none", open && "rotate-180")}
            strokeWidth={1.5}
          />
        </button>
        <div id={listId} hidden={!open} className="px-4 pb-4">
          {list(() => setOpen(false))}
        </div>
      </nav>
    </>
  );
}
