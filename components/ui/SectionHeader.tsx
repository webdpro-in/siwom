import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Container";

type SectionHeaderProps = {
  /** Numbered kicker, e.g. "03 — Safety". Rendered uppercase mono. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional status pill or other badge shown beside the eyebrow. */
  badge?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  size?: "h1" | "h2";
};

export function SectionHeader({
  eyebrow,
  title,
  intro,
  badge,
  action,
  align = "left",
  as: Heading = "h2",
  id,
  className,
  size = "h2",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-5", centered && "items-center text-center", className)}>
      {(eyebrow || badge) && (
        <div className={cn("flex flex-wrap items-center gap-3", centered && "justify-center")}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {badge}
        </div>
      )}
      <Heading id={id} className={cn(size === "h1" ? "text-h1" : "text-h2", "max-w-headline text-text")}>
        {title}
      </Heading>
      {intro ? (
        <div className={cn("max-w-reading text-body-l text-text-muted", centered && "mx-auto")}>{intro}</div>
      ) : null}
      {action ? <div className={cn("mt-2 flex flex-wrap gap-3", centered && "justify-center")}>{action}</div> : null}
    </div>
  );
}
