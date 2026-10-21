"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { layout } from "@/lib/tokens";
import { mainNav } from "@/data/navigation";
import { Lockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed header: 72 px, compacting to 60 px after 24 px of scroll. Transparent
 * over the homepage photo (with the photo's light-on-dark tokens); otherwise
 * the page background with a 12 px backdrop blur, so the logo and navigation
 * keep full contrast in both themes. Never hides on scroll.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the menu on route change (state adjusted during render, not in an effect).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // The homepage opens on a full-bleed photo; the header sits on it until the visitor scrolls.
  const overPhoto = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > layout.headerCompactAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          "site-header fixed inset-x-0 top-0 z-40 border-b transition-[height,background-color,border-color] duration-ui ease-standard",
          scrolled ? "h-(--header-h-compact)" : "h-(--header-h)",
          // Over the homepage photo the header is transparent and uses the photo's light-on-dark
          // tokens, so no light bar sits on the photo in light theme. Elsewhere, and after scrolling,
          // it uses the page background.
          overPhoto
            ? "photo-surface border-transparent bg-transparent"
            : cn("bg-bg/90 backdrop-blur-header", scrolled ? "border-border" : "border-transparent"),
        )}
      >
        <div className="mx-auto flex h-full max-w-wide items-center justify-between gap-3 gutter-x">
          <Link
            href="/"
            className="-m-2 inline-flex min-h-11 items-center rounded-control p-2"
            aria-label="SIWOM home"
          >
            <Lockup />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center rounded-control px-2.5 text-small font-medium transition-colors duration-hover xl:px-3 xl:text-body",
                        active ? "text-text" : "text-text-muted hover:text-text",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span aria-hidden className="absolute inset-x-2.5 bottom-1.5 h-0.5 rounded-full bg-accent xl:inset-x-3" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button href="/contact" size="sm" className="hidden sm:inline-flex" trackAs="header_talk">
              Talk to SIWOM
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-control text-text hover:bg-surface-2 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(panelRef, open, { onEscape: onClose, initialFocus: closeRef });
  useScrollLock(open);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg lg:hidden"
    >
      <div className="flex h-(--header-h) shrink-0 items-center justify-between gutter-x">
        <Link href="/" className="-m-2 inline-flex min-h-11 items-center rounded-control p-2" onClick={onClose}>
          <Lockup />
          <span className="sr-only">Home</span>
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-control text-text hover:bg-surface-2"
        >
          <X aria-hidden className="size-6" strokeWidth={1.5} />
          <span className="sr-only">Close menu</span>
        </button>
      </div>
      <nav aria-label="Mobile" className="flex-1 gutter-x pt-4">
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                      prefetch={false}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "font-display text-h3 font-medium",
                        active ? "text-text underline decoration-accent decoration-2 underline-offset-8" : "text-text",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="text-small text-text-muted">{item.description}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 text-text-muted group-hover:text-accent-text" strokeWidth={1.5} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sticky bottom-0 shrink-0 border-t border-border bg-bg gutter-x pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button href="/contact" size="lg" fullWidth onClick={onClose} trackAs="menu_talk">
          Talk to SIWOM
        </Button>
      </div>
    </div>
  );
}
