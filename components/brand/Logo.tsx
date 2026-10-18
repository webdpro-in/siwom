import { cn } from "@/lib/cn";

import { SIWOM_SYMBOL_PATH, SIWOM_SYMBOL_VIEWBOX, SIWOM_SYMBOL_TRANSFORM } from "@/lib/brand";

type SymbolProps = {
  className?: string;
  /** "filled": lime tile with ink chevron. "mono": single colour, currentColor. */
  variant?: "filled" | "mono";
  title?: string;
};

export function SiwomSymbol({ className, variant = "filled", title }: SymbolProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox={SIWOM_SYMBOL_VIEWBOX}
      className={cn("shrink-0", className)}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={SIWOM_SYMBOL_PATH} transform={SIWOM_SYMBOL_TRANSFORM} fill="none" stroke="currentColor" strokeWidth="36" strokeLinecap="butt" strokeLinejoin="round" className={variant === "filled" ? "text-accent-text" : undefined} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-wordmark leading-none text-text", className)}>
      SIWOM
    </span>
  );
}

/** Symbol + wordmark lockup used in the header and footer. */
export function Lockup({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SiwomSymbol className={size === "lg" ? "size-11" : "size-9"} />
      <Wordmark className={size === "lg" ? "text-h3" : "text-body-l"} />
    </span>
  );
}
