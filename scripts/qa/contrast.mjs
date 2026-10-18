#!/usr/bin/env node
// WCAG 2.x contrast check for the token pairs used in the UI.
// Usage: node scripts/qa/contrast.mjs
import fs from "node:fs";

const css = fs.readFileSync("styles/globals.css", "utf8");
const parse = text => Object.fromEntries([...text.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map(([,k,v]) => [k,v.toLowerCase()]));
const dark = parse(css.split("/* Typography */")[0]);
const light = { ...dark, ...parse(css.match(/:root\[data-theme="light"\]\s*\{([^}]+)\}/)[1]) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const l = c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const backgrounds = ["bg", "surface-1", "surface-2", "surface-3"];
const pairs = [
  ["text", 4.5],
  ["text-muted", 4.5],
  ["text-subtle", 4.5, "disabled only"],
  ["accent-text", 4.5],
  ["sev-critical", 4.5],
  ["sev-high", 4.5],
  ["sev-medium", 4.5],
  ["sev-low", 4.5],
  ["border-control", 3, "form control boundary"],
  ["border-strong", 3, "decorative only"],
];

let failures = 0;
for (const [theme, tokens] of Object.entries({dark, light})) {
console.log(theme);
console.log("fg".padEnd(16), backgrounds.map((b) => b.padStart(11)).join(""), "  min");
for (const [fg, min, note] of pairs) {
  const values = backgrounds.map((bg) => ratio(tokens[fg], tokens[bg]));
  const ok = values.every((v) => v >= min);
  if (!ok && !note) failures++;
  console.log(
    fg.padEnd(16),
    values.map((v) => v.toFixed(2).padStart(11)).join(""),
    `  ${min}:1 ${ok ? "pass" : note ? `fail (${note})` : "FAIL"}`,
  );
}
console.log("accent-ink on accent:", ratio(tokens["accent-ink"], tokens.accent).toFixed(2));
}
process.exitCode = failures ? 1 : 0;
