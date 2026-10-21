import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import safetyTeam from "@/public/images/safety-team.webp";
import type { Status } from "@/data/status";
import { tradePhotos, type Photo } from "@/data/trade";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";

const tracks: { title: string; status: Status; href: string; linkLabel: string; text: string; photo: Photo }[] = [
  {
    title: "Global Trade, starting with space",
    status: "research",
    href: "/global-trade",
    linkLabel: "Read about Global Trade",
    text: "Plan and hand off high-value technology cargo, such as satellites and rocket parts, and help Indian manufacturers source and export it.",
    photo: tradePhotos.coreStageBarge,
  },
  {
    title: "Safety",
    status: "research",
    href: "/safety",
    linkLabel: "Read about Safety",
    text: "Camera-assisted flags for possible hazards at ports and yards, always reviewed by a qualified person before anyone acts.",
    photo: {
      src: safetyTeam,
      alt: "Industrial workers wearing helmets, safety glasses and protective workwear.",
      credit: "Representative photograph (Pexels).",
    },
  },
  {
    title: "Robotics and electric mobility",
    status: "vision",
    href: "/vision",
    linkLabel: "Read our vision",
    text: "Where SIWOM is headed next: warehouse robotics and vehicle software, built on the same platform.",
    photo: tradePhotos.robotics,
  },
];

export function MoreSection() {
  return (
    <section aria-labelledby="more-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal>
          <SectionHeader
            id="more-title"
            eyebrow="05 — More from SIWOM"
            title="Beyond shipment coordination."
            intro="The same platform extends to global technology trade and site safety."
          />
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {tracks.map((t, i) => (
            <li key={t.href} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-1 transition-colors duration-hover hover:border-border-strong">
                <div className="relative aspect-card overflow-hidden border-b border-border bg-surface-2">
                  <Image src={t.photo.src} alt={t.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <StatusPill status={t.status} className="w-fit" />
                  <h3 className="text-h3 text-text">
                    <Link href={t.href} className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent">
                      {t.title}
                    </Link>
                  </h3>
                  <p className="text-body text-text-muted">{t.text}</p>
                  <p className="text-small text-text-muted">Photo: {t.photo.credit}</p>
                  <span aria-hidden className="mt-auto inline-flex items-center gap-2 pt-2 text-small font-medium text-text">
                    {t.linkLabel}
                    <ArrowRight className="size-4 transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" strokeWidth={1.5} />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
