import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Logistics", href: "/logistics" },
  { label: "Safety", href: "/safety" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div className="relative mx-auto flex min-h-[80svh] max-w-content flex-col justify-center gap-6 gutter-x pt-[calc(var(--header-h)+3rem)] pb-20">
        <Eyebrow>404 · Route not found</Eyebrow>
        <h1 id="nf-title" className="max-w-headline text-h1 text-text">
          This route doesn&apos;t exist yet.
        </h1>
        <p className="max-w-reading text-body-l text-text-muted">The page you asked for is not here. These are good places to continue.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/" size="lg" icon="arrow">
            Back to home
          </Button>
          {links.map((l) => (
            <Button key={l.href} href={l.href} size="lg" variant="secondary">
              {l.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
