import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
// Vercel always serves over HTTPS, including when NEXT_PUBLIC_SITE_URL is not set.
const https = siteUrl.startsWith("https://") || process.env.VERCEL === "1";
const turnstile = Boolean(process.env.TURNSTILE_SITE_KEY);
const plausible = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

/*
 * Static CSP without nonces so every page stays prerendered (a nonce would
 * force dynamic rendering). Third-party origins are added only when the
 * matching feature is configured.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${turnstile ? " https://challenges.cloudflare.com" : ""}${plausible ? " https://plausible.io" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' https://api.web3forms.com${plausible ? " https://plausible.io" : ""}${isDev ? " ws:" : ""}`,
  `frame-src ${turnstile ? "https://challenges.cloudflare.com" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(https ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(https ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    deviceSizes: [640, 750, 828, 1080, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Product pages were renamed (Logistics OS → Logistics, Safety AI → Safety).
  async redirects() {
    return [
      { source: "/logistics-os", destination: "/logistics", permanent: true },
      { source: "/safety-ai", destination: "/safety", permanent: true },
    ];
  },
};

export default nextConfig;
