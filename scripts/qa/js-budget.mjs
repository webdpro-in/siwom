#!/usr/bin/env node
// First-load JS for a route: gzipped size of every script the HTML references.
// Usage: node scripts/qa/js-budget.mjs --base http://localhost:3100 / /logistics
import zlib from "node:zlib";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:3100";
const paths = args.filter((a) => a.startsWith("/"));
const BUDGET_KB = 170;
let over = 0;
for (const path of paths.length ? paths : ["/"]) {
  const html = await (await fetch(base + path)).text();
  // noModule scripts are legacy polyfills that modern browsers never download.
  const tags = [...html.matchAll(/<script[^>]*>/g)].map((m) => m[0]).filter((t) => !/nomodule/i.test(t));
  const srcs = [...new Set(tags.map((t) => t.match(/src="([^"]+\.js)"/)?.[1]).filter(Boolean))];
  let total = 0;
  for (const src of srcs) {
    const buf = Buffer.from(await (await fetch(new URL(src, base))).arrayBuffer());
    total += zlib.gzipSync(buf, { level: 9 }).length;
  }
  const kb = total / 1024;
  if (kb > BUDGET_KB) over++;
  console.log(`${path.padEnd(16)} ${srcs.length} scripts  ${kb.toFixed(1)} KB gzipped  ${kb > BUDGET_KB ? "OVER" : "within"} ${BUDGET_KB} KB budget`);
}
process.exitCode = over ? 1 : 0;
