"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; title: string; content: ReactNode };

type AccordionProps = {
  items: AccordionItem[];
  /** "single" closes others when one opens; "multiple" allows many open. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  headingLevel?: "h3" | "h4";
  className?: string;
};

export function Accordion({ items, type = "multiple", defaultOpen = [], headingLevel = "h3", className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const base = useId();
  const Heading = headingLevel;

  function toggle(id: string) {
    setOpen((prev) => {
      const isOpen = prev.includes(id);
      if (type === "single") return isOpen ? [] : [id];
      return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => {
        const expanded = open.includes(item.id);
        const buttonId = `${base}-${item.id}-button`;
        const panelId = `${base}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <Heading className="font-sans text-body font-medium">
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-text hover:text-accent-text"
              >
                <span>{item.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-text-muted transition-transform duration-ui ease-standard motion-reduce:transition-none",
                    expanded && "rotate-180",
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="pb-5 text-body text-text-muted"
            >
              <div className="max-w-reading">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
