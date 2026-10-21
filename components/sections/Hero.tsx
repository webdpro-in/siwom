import { getImageProps } from "next/image";
import { ArrowDownRight } from "lucide-react";
import { contactHref } from "@/data/navigation";
import { Button } from "@/components/ui/Button";

const alt = "Container cranes and freight vessels at a working port at sunset.";

export function Hero() {
  const { props: desktop } = getImageProps({ src: "/images/port-hero.webp", width: 2200, height: 1451, alt, sizes: "100vw", quality: 75 });
  const { props: mobile } = getImageProps({ src: "/images/port-hero-mobile.webp", width: 900, height: 1200, alt, sizes: "100vw", quality: 60, loading: "eager", fetchPriority: "high" });
  // No explicit <link rel="preload">: the <picture> is in the initial HTML with fetchpriority="high",
  // and a preload would be hoisted into other pages' prefetches of "/" and go unused there.

  return (
    <section data-hero aria-labelledby="hero-title" className="photo-surface relative isolate flex min-h-180 flex-col justify-end overflow-hidden md:min-h-200 lg:min-h-[min(920px,100svh)]">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
        <img {...mobile} alt={alt} className="hero-photo absolute inset-0 -z-30 size-full object-cover" />
      </picture>
      <div aria-hidden className="hero-photo-overlay absolute inset-0 -z-20" />
      <div className="mx-auto w-full max-w-content gutter-x pt-36 pb-12 md:pt-48 md:pb-16">
        <div className="flex max-w-[60rem] flex-col items-start gap-7">
          <p className="hero-rise flex items-center gap-3 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
            <span aria-hidden className="h-px w-8 bg-accent" /> SIWOM · Industrial technology, built in India
          </p>
          <h1 id="hero-title" className="hero-heading global-hero-heading font-display font-medium text-text">
            {/* Lines flow together on phones (three lines max) and split from 768 px. */}
            <span className="hero-rise md:block">Intelligence for </span>
            <span className="hero-rise hero-delay-1 text-accent-text md:block">the physical world.</span>
          </h1>
          <p className="hero-rise hero-delay-1 max-w-[40rem] text-body-l text-text-muted">
            SIWOM builds the intelligence layer for industrial systems, starting with SIWOM Logistics: one shared record
            of every international shipment, from the supplier&apos;s door to final delivery.
          </p>
          <div className="hero-rise hero-delay-2 flex flex-wrap gap-3 pt-2">
            <Button href={contactHref({ interest: "logistics", pilot: true })} size="lg" icon="arrow" trackAs="hero_discuss_pilot">
              Discuss a pilot
            </Button>
            <Button href="#platform" size="lg" variant="secondary" trackAs="hero_see_platform">
              See the platform
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-content grid-cols-1 gap-4 border-t border-border/70 gutter-x py-7 sm:grid-cols-3 sm:gap-8">
        <p className="flex items-center gap-3 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
          <span className="size-2 rounded-full bg-accent" aria-hidden /> Built in India
        </p>
        <p className="text-small text-text">Logistics · Space · Mobility · Robotics · Energy · Industrial AI</p>
        <a href="#journey" className="hidden items-center justify-end gap-4 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted hover:text-text sm:flex">
          How a shipment moves
          <ArrowDownRight aria-hidden className="size-5" />
        </a>
      </div>
    </section>
  );
}
