import { cn } from "@/lib/cn";
import { statusMeta, statusOrder } from "@/data/status";
import { StatusPill } from "@/components/ui/StatusPill";

/** Explains all four labels. Shown once on the homepage and on the Vision page. */
export function StatusLegend({ className, title = "How to read our labels" }: { className?: string; title?: string }) {
  return (
    <section aria-label={title} className={cn("rounded-panel border border-border bg-surface-1 p-5 md:p-6", className)}>
      <h2 className="mb-4 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">{title}</h2>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusOrder.map((status) => (
          <div key={status} className="flex flex-col items-start gap-2">
            <dt>
              <StatusPill status={status} interactive={false} />
            </dt>
            <dd className="text-small text-text-muted">{statusMeta[status].meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
