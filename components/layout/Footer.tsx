import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { cacheLife } from "next/cache";
import { site } from "@/lib/site";
import { footerNav } from "@/data/navigation";
import { Lockup } from "@/components/brand/Logo";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const socialLabels: Record<keyof typeof site.social, string> = {
  linkedin: "LinkedIn",
  x: "X",
  github: "GitHub",
};

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">{title}</h2>
      <ul className="flex flex-col gap-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-10 items-center rounded-xs text-small text-text-muted transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const socials = (Object.entries(site.social) as [keyof typeof site.social, string][]).filter(([, url]) => url);
  return (
    <footer className="border-t border-border bg-bg pb-24 md:pb-0">
      <div className="mx-auto max-w-content gutter-x py-16">
        <div className="layout-grid gap-y-12">
          <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-5">
            <Link href="/" className="inline-flex w-fit items-center gap-2.5 rounded-control" aria-label="SIWOM home">
              <Lockup />
            </Link>
            <p className="max-w-xs text-body text-text-muted">
              Moving industries forward. <span className="text-text">Safety first.</span>
            </p>
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
              Indian industrial technology initiative
            </p>
            <p className="text-small text-text-muted">
              <a href="/contact" className="underline underline-offset-4 hover:text-text">
                Get in touch
              </a>
            </p>
            {socials.length > 0 ? (
              <ul className="flex gap-4">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a href={url} className="text-small text-text-muted hover:text-text" rel="noopener noreferrer" target="_blank">
                      {socialLabels[key]}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <nav aria-label="Footer" className="col-span-4 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <FooterColumn title="Products" links={footerNav.products} />
            <FooterColumn title="Company" links={footerNav.company} />
            <FooterColumn title="Legal" links={footerNav.legal} />
          </nav>
        </div>
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-small text-text-muted">
            © <CopyrightYear /> SIWOM. All rights reserved.
          </p>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 rounded-control text-small text-text-muted hover:text-text"
          >
            Back to top
            <ArrowUp aria-hidden className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
