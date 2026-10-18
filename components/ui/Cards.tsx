import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Status } from "@/data/status";
import { StatusPill } from "./StatusPill";

type IconType = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const cardBase =
  "group relative flex flex-col rounded-card border border-border bg-surface-1 transition-colors duration-hover ease-standard";
const cardHover = "hover:border-border-strong focus-within:border-border-strong";

type FeatureCardProps = {
  icon?: IconType;
  title: string;
  description: ReactNode;
  status?: Status;
  href?: string;
  linkLabel?: string;
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * Icon, title, two-line description, optional status pill and link. When it
 * links, the whole card is clickable via a stretched link on the title, so
 * the pill's tooltip button is never nested inside the link.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  status,
  href,
  linkLabel,
  headingLevel: Heading = "h3",
  className,
}: FeatureCardProps) {
  return (
    <article className={cn(cardBase, href && cardHover, "gap-4 p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        {Icon ? (
          <Icon
            aria-hidden
            className="size-6 text-text-muted transition-colors duration-hover group-hover:text-accent-text"
            strokeWidth={1.5}
          />
        ) : null}
        {status ? <StatusPill status={status} /> : null}
      </div>
      <Heading className="text-h3 text-text">
        {href ? (
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      <p className="text-body text-text-muted">{description}</p>
      {href && linkLabel ? (
        <span aria-hidden className="mt-auto inline-flex items-center gap-2 pt-2 text-small font-medium text-text">
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            strokeWidth={1.5}
          />
        </span>
      ) : null}
    </article>
  );
}

type MediaCardProps = {
  image: StaticImageData;
  alt: string;
  title: string;
  description: ReactNode;
  status?: Status;
  href?: string;
  linkLabel?: string;
  concept?: boolean;
  aspect?: "4/3" | "4/5" | "3/4";
  sizes?: string;
  className?: string;
  headingLevel?: "h3" | "h4";
  eyebrow?: string;
};

const aspects = { "4/3": "aspect-card", "4/5": "aspect-tall", "3/4": "aspect-tile" } as const;

export function MediaCard({
  image,
  alt,
  title,
  description,
  status,
  href,
  linkLabel,
  concept,
  aspect = "4/3",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  headingLevel: Heading = "h3",
  eyebrow,
}: MediaCardProps) {
  return (
    <article className={cn(cardBase, href && cardHover, "overflow-hidden", className)}>
      <div className={cn("relative overflow-hidden border-b border-border bg-surface-2", aspects[aspect])}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover transition-transform duration-reveal ease-emphasis group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {concept ? <ConceptCaption className="absolute bottom-3 left-3" /> : null}
      </div>
      {status ? (
        <div className="absolute left-3 top-3">
          <StatusPill status={status} className="bg-bg/85 backdrop-blur-header" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {eyebrow ? (
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{eyebrow}</p>
        ) : null}
        <Heading className="text-h3 text-text">
          {href ? (
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        <p className="text-body text-text-muted">{description}</p>
        {href && linkLabel ? (
          <span aria-hidden className="mt-auto inline-flex items-center gap-2 pt-2 text-small font-medium text-text">
            {linkLabel}
            <ArrowRight
              className="size-4 transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
              strokeWidth={1.5}
            />
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function ConceptCaption({ className, label = "Concept render" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-xs border border-border-strong bg-bg/85 px-2 font-mono text-pill uppercase tracking-pill text-text",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Only for real values or values explicitly labelled as demo data. */
export function StatBlock({
  label,
  value,
  unit,
  footnote,
  className,
  size = "lg",
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  footnote?: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{label}</dt>
      <dd className="flex items-baseline gap-1.5">
        <span className={cn("font-mono font-medium tabular text-text", size === "lg" ? "text-h2" : "text-h3")}>
          {value}
        </span>
        {unit ? <span className="font-mono text-small text-text-muted">{unit}</span> : null}
      </dd>
      {footnote ? <dd className="text-small text-text-muted">{footnote}</dd> : null}
    </div>
  );
}
