import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BatteryCharging,
  Bot,
  Drone,
  Factory,
  Globe2,
  Orbit,
  Plane,
  PlaneTakeoff,
  Radar,
  Rocket,
  Satellite,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Photo, SectorId } from "@/data/trade";

export const sectorIcons: Record<SectorId, LucideIcon> = {
  satellites: Satellite,
  rockets: Rocket,
  "space-robotics": Orbit,
  aerospace: Plane,
  "industrial-robots": Bot,
  "electric-vehicles": BatteryCharging,
  "autonomous-vehicles": Radar,
  drones: Drone,
  "flying-cars": PlaneTakeoff,
  "green-energy": Sun,
};

export const flowIcons: Record<string, LucideIcon> = {
  import: ArrowDownToLine,
  export: ArrowUpFromLine,
  domestic: Factory,
  global: Globe2,
};

const aspects = { card: "aspect-card", tall: "aspect-tall", video: "aspect-video", square: "aspect-square" } as const;

/** Photo with its credit underneath. Credits are required for every trade photo. */
export function PhotoTile({
  photo,
  aspect = "card",
  sizes,
  className,
  preload,
  flush = false,
  fixedHeight = false,
}: {
  photo: Photo;
  aspect?: keyof typeof aspects;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** Edge-to-edge inside a card: no own border or radius, padded caption. */
  flush?: boolean;
  /** From 768 px, use a fixed image height so tiles in one row line up. */
  fixedHeight?: boolean;
}) {
  return (
    <figure className={cn("flex flex-col", flush ? "gap-0" : "gap-2", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-surface-2",
          flush ? "border-b border-border" : "rounded-card border border-border",
          aspects[aspect],
          fixedHeight && "md:aspect-auto md:h-80",
        )}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} placeholder="blur" preload={preload} className="object-cover" />
      </div>
      <figcaption className={cn("text-small text-text-muted", flush && "px-6 pt-3")}>{photo.credit}</figcaption>
    </figure>
  );
}
