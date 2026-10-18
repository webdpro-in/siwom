import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { site, absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/cn";
import { colors } from "@/lib/tokens";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { RevealController } from "@/components/layout/RevealController";
import { SkipLink } from "@/components/ui/Breadcrumbs";
import { ToastProvider } from "@/components/ui/Toast";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-space-grotesk",
  fallback: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false, // Keep early bandwidth for the hero; font-display swap keeps labels readable.
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "SIWOM — Moving industries forward",
    template: "%s · SIWOM",
  },
  description: site.description,
  applicationName: "SIWOM",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SIWOM",
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: colors.bg,
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/brand/siwom-symbol.png"),
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={cn(display.variable, sans.variable, mono.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t;try{t=localStorage.getItem('siwom-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()` }} />
        {plausibleDomain ? (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body>
        <div id="top" />
        <SkipLink />
        <ToastProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <StickyCta />
        </ToastProvider>
        <RevealController />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
