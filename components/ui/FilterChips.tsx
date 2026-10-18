import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ChipOption<V extends string = string> = { value: V; label: string; count?: number };

type FilterChipsProps<V extends string> = {
  label: string;
  options: ChipOption<V>[];
  selected: V[];
  onToggle?: (value: V) => void;
  onClear?: () => void;
  multiple?: boolean;
  className?: string;
  /** Hide the visible group label (it stays available to screen readers). */
  hideLabel?: boolean;
};

/**
 * Single or multi-select chips. Controlled and hook-free; the parent owns the
 * state and mirrors it to the URL. Shows an active count and "Clear all".
 */
export function FilterChips<V extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
  multiple = true,
  className,
  hideLabel,
}: FilterChipsProps<V>) {
  const activeCount = selected.length;
  return (
    <div role={multiple ? "group" : "radiogroup"} aria-label={label} className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("mr-1 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted", hideLabel && "sr-only")}>
        {label}
        {activeCount > 0 ? <span className="text-text"> · {activeCount}</span> : null}
      </span>
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={multiple ? undefined : "radio"}
            aria-pressed={multiple ? active : undefined}
            aria-checked={multiple ? undefined : active}
            onClick={onToggle ? () => onToggle(opt.value) : undefined}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-small transition-colors duration-hover",
              "after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-[''] relative",
              active
                ? "border-accent bg-accent/10 text-text"
                : "border-border-strong text-text-muted hover:border-text-muted hover:text-text",
            )}
          >
            {active ? <Check aria-hidden className="size-3.5 text-accent-text" strokeWidth={2} /> : null}
            {opt.label}
            {typeof opt.count === "number" ? (
              <span className="font-mono text-eyebrow tabular text-text-muted">{opt.count}</span>
            ) : null}
          </button>
        );
      })}
      {activeCount > 0 && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="relative inline-flex h-8 items-center gap-1 rounded-full px-2 text-small text-text-muted underline-offset-4 hover:text-text hover:underline after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']"
        >
          <X aria-hidden className="size-3.5" />
          Clear all<span className="sr-only"> {label.toLowerCase()} filters</span>
        </button>
      ) : null}
    </div>
  );
}
