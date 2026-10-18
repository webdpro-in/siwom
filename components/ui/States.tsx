import type { ReactNode } from "react";
import { CircleAlert, SearchX } from "lucide-react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-skeleton rounded-control bg-surface-3", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-strong px-6 py-10 text-center",
        className,
      )}
    >
      <SearchX aria-hidden className="size-6 text-text-muted" strokeWidth={1.5} />
      <p className="font-medium text-text">{title}</p>
      {description ? <p className="max-w-reading text-small text-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "This view could not load",
  reason,
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  title?: string;
  reason: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-sev-critical/40 px-6 py-10 text-center",
        className,
      )}
    >
      <CircleAlert aria-hidden className="size-6 text-sev-critical" strokeWidth={1.5} />
      <p className="font-medium text-text">{title}</p>
      <p className="max-w-reading text-small text-text-muted">{reason}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex h-10 items-center rounded-control border border-border-strong px-4 text-small font-medium text-text hover:bg-surface-2"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
