"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Industry } from "@/data/industries";
import { StatusPill } from "@/components/ui/StatusPill";

type Item = Pick<Industry, "id" | "name" | "image" | "alt" | "useCase" | "product" | "credit">;

/**
 * Desktop: large names on the left; the image panel swaps on hover and on
 * keyboard focus. Mobile: stacked cards with the image on top.
 */
export function IndustriesExplorer({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-12">
        <ul className="col-span-6 flex flex-col border-t border-border">
          {items.map((item, i) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="border-b border-border">
                <Link
                  href={`/industries#${item.id}`}
                  onMouseEnter={() => setActive(item.id)}
                  onFocus={() => setActive(item.id)}
                  aria-describedby={isActive ? "industry-usecase" : undefined}
                  className="group flex items-center justify-between gap-6 py-6"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-small tabular text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "font-display text-h3 font-medium transition-colors duration-hover",
                        isActive ? "text-text" : "text-text-muted group-hover:text-text",
                      )}
                    >
                      {item.name}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={cn(
                      "size-6 shrink-0 transition-[color,transform] duration-hover motion-reduce:transition-none",
                      isActive ? "translate-x-0 text-accent-text" : "-translate-x-1 text-text-muted",
                    )}
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="col-span-6">
          <div className="relative aspect-tile max-h-160 w-full overflow-hidden rounded-panel border border-border bg-surface-2">
            {items.map((item) => (
              <Image
                key={item.id}
                src={item.image}
                alt={item.id === active ? item.alt : ""}
                aria-hidden={item.id === active ? undefined : true}
                fill
                sizes="(min-width: 1440px) 640px, 45vw"
                placeholder="blur"
                className={cn(
                  "object-cover transition-opacity duration-ui ease-standard motion-reduce:transition-none",
                  item.id === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 scrim-b p-6 pt-20">
              <StatusPill status={current.product.status} className="w-fit bg-bg/85" />
              <p id="industry-usecase" className="max-w-reading text-body text-text">
                <span className="text-text-muted">{current.product.name}: </span>
                {current.useCase}
              </p>
            </div>
          </div>
          {current.credit ? <p className="mt-3 text-small text-text-muted">{current.credit}</p> : null}
        </div>
      </div>

      {/* Mobile and tablet */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-1">
              <div className="relative aspect-card overflow-hidden">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 640px) 50vw, 100vw" placeholder="blur" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <StatusPill status={item.product.status} className="w-fit" />
                <h3 className="text-h3 text-text">
                  <Link href={`/industries#${item.id}`} className="after:absolute after:inset-0 after:content-['']">
                    {item.name}
                  </Link>
                </h3>
                <p className="text-body text-text-muted">{item.useCase}</p>
                {item.credit ? <p className="mt-auto text-small text-text-muted">{item.credit}</p> : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
