"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Drives the CSS-only section reveals ([data-reveal] in globals.css) after
 * hydration, so nothing is hidden before JavaScript runs. Elements already on
 * screen are marked revealed immediately (no flash); the rest fade and rise
 * once as they enter. Also forwards [data-track] clicks to analytics.
 */
export function RevealController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.dataset.revealed = "";
        } else {
          io.observe(el);
        }
      });
    };

    observe(document);
    root.dataset.revealReady = "";

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]:not([data-revealed])")) observe(node.parentNode ?? document);
            else observe(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  useLayoutEffect(() => {
    function onClick(event: MouseEvent) {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      track({
        name: "cta_click",
        props: {
          label: el.dataset.track ?? "",
          href: el.getAttribute("href") ?? "",
          location: window.location.pathname,
        },
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
