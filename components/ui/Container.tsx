import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const widths = {
  content: "max-w-content",
  wide: "max-w-wide",
  reading: "max-w-reading",
  narrow: "max-w-narrow",
} as const;

export function Container({
  as: Tag = "div",
  width = "content",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  width?: keyof typeof widths;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Tag className={cn("mx-auto w-full gutter-x", widths[width], className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted", className)}>{children}</p>
  );
}
