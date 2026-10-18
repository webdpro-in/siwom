"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem<V extends string = string> = {
  value: V;
  label: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
};

type TabsProps<V extends string> = {
  label: string;
  items: TabItem<V>[];
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /**
   * "underline" (default), "chips" (scrollable pills), or "adaptive": chips
   * below 768 px and underline above (mobile scenario switchers).
   */
  variant?: "underline" | "chips" | "adaptive";
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  /** When false, panels are not rendered (the parent renders content itself). */
  renderPanels?: boolean;
  idBase?: string;
  fullWidth?: boolean;
  /** When the parent renders panels itself, their id is `${panelIdPrefix}-${value}`. */
  panelIdPrefix?: string;
};

/** ARIA tabs pattern: arrow keys move between tabs, Home/End jump, automatic activation. */
export function Tabs<V extends string>({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  className,
  listClassName,
  panelClassName,
  renderPanels = true,
  idBase,
  fullWidth,
  panelIdPrefix,
}: TabsProps<V>) {
  const autoId = useId();
  const base = idBase ?? autoId;
  const [internal, setInternal] = useState<V>(defaultValue ?? items[0].value);
  const current = value ?? internal;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(next: V) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((i) => i.value === current);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    select(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          variant === "underline" && "flex gap-6 overflow-x-auto border-b border-border no-scrollbar",
          variant === "chips" && "flex gap-2 overflow-x-auto no-scrollbar",
          variant === "adaptive" && "flex gap-2 overflow-x-auto no-scrollbar md:gap-6",
          fullWidth && variant === "underline" && "gap-0",
          listClassName,
        )}
      >
        {items.map((item, i) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={
                renderPanels ? `${base}-panel-${item.value}` : panelIdPrefix ? `${panelIdPrefix}-${item.value}` : undefined
              }
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-small font-medium transition-colors duration-hover",
                variant === "underline" &&
                  cn(
                    "relative h-11 border-b-2 -mb-px",
                    selected ? "border-accent text-text" : "border-transparent text-text-muted hover:text-text",
                    fullWidth && "flex-1 justify-center",
                  ),
                variant === "chips" &&
                  cn(
                    "h-10 rounded-full border px-4",
                    selected ? "border-accent bg-accent/10 text-text" : "border-border-strong text-text-muted hover:text-text",
                  ),
                variant === "adaptive" &&
                  cn(
                    "h-10 rounded-full border px-4 md:h-11 md:rounded-none md:border-0 md:border-b-2 md:px-0",
                    selected
                      ? "border-accent bg-accent/10 text-text md:bg-transparent"
                      : "border-border-strong text-text-muted hover:text-text md:border-transparent",
                  ),
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
      {renderPanels
        ? items.map((item) => (
            <div
              key={item.value}
              role="tabpanel"
              id={`${base}-panel-${item.value}`}
              aria-labelledby={`${base}-tab-${item.value}`}
              hidden={item.value !== current}
              tabIndex={0}
              className={cn("focus-visible:outline-offset-4", panelClassName)}
            >
              {item.value === current ? item.content : null}
            </div>
          ))
        : null}
    </div>
  );
}
