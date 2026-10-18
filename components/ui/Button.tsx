import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-hover ease-standard " +
  "active:translate-y-px active:duration-micro motion-reduce:active:translate-y-0 " +
  "disabled:pointer-events-none aria-disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink rounded-control hover:shadow-glow focus-visible:shadow-glow " +
    "disabled:bg-surface-3 disabled:text-text-subtle aria-disabled:bg-surface-3 aria-disabled:text-text-subtle",
  secondary:
    "border border-border-strong bg-transparent text-text rounded-control hover:border-text-muted hover:bg-surface-2 " +
    "disabled:text-text-subtle disabled:border-border",
  ghost: "text-text rounded-control hover:text-accent-text px-0! disabled:text-text-subtle",
  destructive:
    "border border-sev-critical/60 text-sev-critical rounded-control hover:bg-sev-critical/10 disabled:text-text-subtle disabled:border-border",
};

/* sm is 40 px tall per the spec; its hit area is extended to 48 px with ::after. */
const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-small after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-6 text-body",
};

type IconOption = "arrow" | "external" | "none" | ReactNode;

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon. Ghost buttons default to the arrow. */
  icon?: IconOption;
  /** Leading icon (rendered before the label). */
  leadingIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  /** Analytics label for CTA tracking (picked up by the global click tracker). */
  trackAs?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function renderIcon(icon: IconOption, variant: ButtonVariant) {
  const resolved = icon === undefined ? (variant === "ghost" ? "arrow" : "none") : icon;
  if (resolved === "none" || resolved === null || resolved === false) return null;
  if (resolved === "arrow") {
    return (
      <ArrowRight
        aria-hidden
        className="size-5 shrink-0 transition-transform duration-hover ease-standard group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        strokeWidth={1.5}
      />
    );
  }
  if (resolved === "external") {
    return <ExternalLink aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />;
  }
  return resolved;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Pick<CommonProps, "variant" | "size" | "fullWidth" | "className">) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    leadingIcon,
    loading = false,
    fullWidth,
    className,
    children,
    trackAs,
    ...rest
  } = props;

  const trailing = renderIcon(icon, variant);
  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
      {loading ? <Spinner className="size-5" /> : trailing}
    </>
  );
  const classes = buttonClasses({ variant, size, fullWidth, className });
  const track = trackAs ? { "data-track": trackAs } : {};

  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...linkRest } = rest as ButtonAsLink;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...track}>
          {content}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...track} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...track}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
