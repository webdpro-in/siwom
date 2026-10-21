import Image from "next/image";
import ctaImg from "@/public/images/port-hero.webp";
import { contactHref } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Container";

/** Full-bleed closing call to action. The only centred section on the site. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="photo-surface relative isolate overflow-hidden">
      <Image src={ctaImg} alt="" fill sizes="100vw" placeholder="blur" className="-z-30 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-scrim-heavy" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid" />
      <div className="mx-auto flex max-w-narrow flex-col items-center gap-6 gutter-x py-28 text-center md:py-40">
        <Eyebrow className="text-text">07 — Next step</Eyebrow>
        <h2 id="cta-title" className="text-h1 text-text">
          Start with one lane or one hub.
        </h2>
        <p className="max-w-reading text-body-l text-text-muted">
          Tell us how your shipments move today and where they get stuck. We will tell you honestly whether SIWOM
          Stream can help, and scope a small pilot if it can.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button href={contactHref({ interest: "logistics-os", pilot: true })} size="lg" icon="arrow" trackAs="cta_pilot">
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
