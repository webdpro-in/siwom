import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { colors } from "@/lib/tokens";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Medium.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Inter-Regular.ttf")),
]);

import { SIWOM_SYMBOL_PATH, SIWOM_SYMBOL_VIEWBOX, SIWOM_SYMBOL_TRANSFORM } from "@/lib/brand";

/** Brand Open Graph card: symbol, eyebrow, title, optional status label. */
export async function renderOg({ eyebrow, title, status }: { eyebrow: string; title: string; status?: string }) {
  const [display, mono, sans] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: colors.bg,
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          color: colors.text,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox={SIWOM_SYMBOL_VIEWBOX}>
            <path d={SIWOM_SYMBOL_PATH} transform={SIWOM_SYMBOL_TRANSFORM} fill="none" stroke={colors.accent} strokeWidth="36" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: "Space Grotesk", fontSize: 40, letterSpacing: 1.6 }}>SIWOM</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: 3, color: colors.textMuted, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            {status ? (
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 18,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  // Same label styles as the site: only "In development" is lime.
                  border: `2px ${status === "Long-term vision" ? "dashed" : "solid"} ${status === "In development" ? colors.accent : colors.textMuted}`,
                  color: status === "In development" ? colors.accent : colors.text,
                  borderRadius: 999,
                  padding: "6px 16px",
                }}
              >
                {status}
              </div>
            ) : null}
          </div>
          <div style={{ fontFamily: "Space Grotesk", fontSize: 76, lineHeight: 1.04, letterSpacing: -2, maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: colors.textMuted }}>
          <div>Moving industries forward. Safety first.</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20 }}>Built from India</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
        { name: "Inter", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
