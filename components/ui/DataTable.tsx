import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { EmptyState, Skeleton } from "./States";

export type SortDirection = "asc" | "desc";
export type SortState<K extends string = string> = { key: K; direction: SortDirection } | null;

export type Column<Row, K extends string = string> = {
  key: K;
  header: string;
  /** Cell renderer. */
  cell: (row: Row) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right";
  /** Hide on the stacked mobile card (e.g. when already in the card title). */
  hideOnCard?: boolean;
  className?: string;
};

type DataTableProps<Row, K extends string> = {
  caption: string;
  columns: Column<Row, K>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  /** Renders the primary identifier as a button so rows are keyboard-selectable. */
  rowLabel: (row: Row) => string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  sort?: SortState<K>;
  onSortChange?: (key: K) => void;
  loading?: boolean;
  empty?: ReactNode;
  /** Card title on mobile; defaults to rowLabel. */
  cardTitle?: (row: Row) => ReactNode;
  cardAside?: (row: Row) => ReactNode;
  className?: string;
  maxHeightClass?: string;
};

/**
 * Pure (hook-free) so it renders identically on the server as a demo poster
 * and in the interactive client demo. Sorting and selection are controlled.
 * Desktop: sticky-header table. Mobile: stacked cards, never horizontal scroll.
 */
export function DataTable<Row, K extends string>({
  caption,
  columns,
  rows,
  getRowId,
  rowLabel,
  selectedId,
  onSelect,
  sort,
  onSortChange,
  loading,
  empty,
  cardTitle,
  cardAside,
  className,
  maxHeightClass = "max-h-96",
}: DataTableProps<Row, K>) {
  if (loading) {
    return (
      <div role="status" className={cn("flex flex-col gap-2 p-4", className)} aria-busy="true" aria-label={`${caption}: loading`}>
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className={className}>{empty ?? <EmptyState title="Nothing to show" />}</div>;
  }

  return (
    <div className={className}>
      {/* Desktop and tablet table */}
      <div className={cn("relative hidden overflow-y-auto md:block", maxHeightClass)}>
        <table className="w-full border-separate border-spacing-0 text-left text-small">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key;
                const ariaSort = active ? (sort!.direction === "asc" ? "ascending" : "descending") : undefined;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={col.sortable ? (ariaSort ?? "none") : undefined}
                    className={cn(
                      "sticky top-0 z-10 h-10 border-b border-border bg-surface-2 px-3 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {col.sortable && onSortChange ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(col.key)}
                        className={cn(
                          "-mx-1 inline-flex h-8 items-center gap-1 rounded-xs px-1 uppercase hover:text-text",
                          active && "text-text",
                        )}
                      >
                        {col.header}
                        {active ? (
                          sort!.direction === "asc" ? (
                            <ArrowUp aria-hidden className="size-3.5" />
                          ) : (
                            <ArrowDown aria-hidden className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown aria-hidden className="size-3.5 opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = getRowId(row);
              const selected = id === selectedId;
              return (
                <tr
                  key={id}
                  data-selected={selected || undefined}
                  onClick={onSelect ? () => onSelect(id) : undefined}
                  className={cn(
                    "group/row transition-colors duration-hover",
                    onSelect && "cursor-pointer hover:bg-surface-3",
                    selected && "bg-surface-3",
                  )}
                >
                  {columns.map((col, i) => (
                    <td
                      key={col.key}
                      className={cn(
                        "h-11 border-b border-border px-3 tabular text-text-muted",
                        i === 0 && "relative font-mono text-text",
                        col.align === "right" && "text-right",
                        col.className,
                      )}
                    >
                      {i === 0 && selected ? (
                        <span aria-hidden className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />
                      ) : null}
                      {i === 0 && onSelect ? (
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(id);
                          }}
                          className="rounded-xs text-left font-mono text-text underline-offset-4 hover:underline"
                        >
                          {rowLabel(row)}
                        </button>
                      ) : (
                        col.cell(row)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="flex flex-col gap-2 md:hidden" aria-label={caption}>
        {rows.map((row) => {
          const id = getRowId(row);
          const selected = id === selectedId;
          return (
            <li key={id}>
              <div
                className={cn(
                  "relative rounded-card border bg-surface-1 p-4",
                  selected ? "border-accent" : "border-border",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  {onSelect ? (
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelect(id)}
                      className="text-left font-mono text-body text-text after:absolute after:inset-0 after:rounded-card after:content-['']"
                    >
                      {cardTitle ? cardTitle(row) : rowLabel(row)}
                    </button>
                  ) : (
                    <p className="font-mono text-body text-text">{cardTitle ? cardTitle(row) : rowLabel(row)}</p>
                  )}
                  {cardAside ? <div className="relative">{cardAside(row)}</div> : null}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {columns
                    .filter((c, i) => i !== 0 && !c.hideOnCard)
                    .map((col) => (
                      <div key={col.key} className="min-w-0">
                        <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
                          {col.header}
                        </dt>
                        <dd className="truncate text-small text-text">{col.cell(row)}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
