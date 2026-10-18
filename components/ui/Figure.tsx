import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ConceptCaption } from "./Cards";

const aspects = {
  video: "aspect-video",
  card: "aspect-card",
  tile: "aspect-tile",
  tall: "aspect-tall",
  square: "aspect-square",
} as const;

/** Image with caption. Concept renders always carry the "CONCEPT RENDER" label. */
export function Figure({
  src,
  alt,
  caption,
  concept,
  aspect = "video",
  sizes = "(min-width: 1280px) 1200px, 100vw",
  preload,
  className,
  imageClassName,
  rounded = true,
}: {
  src: StaticImageData;
  alt: string;
  caption?: ReactNode;
  concept?: boolean;
  aspect?: keyof typeof aspects;
  sizes?: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
  rounded?: boolean;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-surface-2",
          rounded && "rounded-panel",
          aspects[aspect],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          preload={preload}
          className={cn("object-cover", imageClassName)}
        />
        {concept ? <ConceptCaption className="absolute bottom-3 left-3" /> : null}
      </div>
      {caption ? <figcaption className="text-small text-text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
