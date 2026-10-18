"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

/**
 * Slim mobile "Talk to SIWOM" bar. Appears once the visitor has scrolled past
 * the page hero ([data-hero]) and hides while the contact form is on screen.
 */
export function StickyCta() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const hero = document.querySelector("[data-hero]");
    const form = document.getElementById("contact-form");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      io.observe(hero);
      observers.push(io);
    } else {
      const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (form) {
      const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));
      io.observe(form);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  const onContact = pathname.startsWith("/contact");
  const visible = pastHero && !formVisible && !onContact;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-1/95 backdrop-blur-header md:hidden",
        "px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-[transform,opacity] duration-ui ease-standard motion-reduce:transition-opacity",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-small text-text-muted">Have a real problem to solve?</p>
        <Button href="/contact" size="sm" trackAs="sticky_talk">
          Talk to SIWOM
        </Button>
      </div>
    </div>
  );
}
