import Image from "next/image";
import ctaImg from "@/public/images/port-hero.webp";
import { contactHref } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Container";

/** Full-bleed partnership band. The only centred section on the site. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="photo-surface relative isolate overflow-hidden">
      <Image src={ctaImg} alt="" fill sizes="100vw" placeholder="blur" className="-z-30 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-scrim-heavy" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid" />
      <div className="mx-auto flex max-w-narrow flex-col items-center gap-6 gutter-x py-28 text-center md:py-40">
        <Eyebrow className="text-text">09 — Partner with us</Eyebrow>
        <h2 id="cta-title" className="text-h1 text-text">
          Let&apos;s build smarter, safer industry.
        </h2>
        <p className="max-w-reading text-body-l text-text-muted">
          Whether you&apos;re operating a logistics network, managing an industrial facility, exploring safety
          technology, or building the next generation of industrial systems, let&apos;s start with a real problem.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button href={contactHref({ pilot: true })} size="lg" icon="arrow" trackAs="cta_pilot">
            Discuss a pilot
          </Button>
          <Button href="/contact" size="lg" variant="secondary" trackAs="cta_contact">
            Contact SIWOM
          </Button>
        </div>
      </div>
    </section>
  );
}
