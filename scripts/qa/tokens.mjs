#!/usr/bin/env node
/**
 * "Tokens only" check: flags hard-coded colours, font sizes and durations in
 * components and routes. Intentional exceptions are allow-listed below.
 */
import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components", "lib", "data"];
const allow = [
  // Values that must be literal: metadata theme colour, OG image renderer.
  /app\/layout\.tsx: .*themeColor/,
  // The JS mirror of the colour tokens.
  /lib\/tokens\.ts/,
  /lib\/og\.tsx/,
  /opengraph-image\.tsx/,
  // Styleguide documents each token's hex value as text.
  /app\/styleguide\/page\.tsx: \["[a-z0-9-]+", "bg-[a-z0-9-]+", "#/,
];
const patterns = [
  { name: "hex colour", re: /#[0-9a-fA-F]{3,8}\b(?![-\w])/g },
  { name: "rgb()/hsl() colour", re: /\b(?:rgb|rgba|hsl|hsla)\(/g },
  { name: "arbitrary px/rem font size", re: /text-\[\d/g },
  { name: "arbitrary duration/delay", re: /(?:duration|delay)-\[|animation-delay:\s*\d|transition-delay:\s*\d|\d+ms["'`]/g },
  { name: "arbitrary colour class", re: /(?:bg|text|border|fill|stroke)-\[#/g },
];

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(entry.name)) files.push(p);
  }
};
roots.forEach((r) => fs.existsSync(r) && walk(r));

let issues = 0;
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    for (const { name, re } of patterns) {
      re.lastIndex = 0;
      if (re.test(line)) {
        const ref = `${file}: ${line.trim()}`;
        if (allow.some((a) => a.test(ref))) continue;
        issues++;
        console.log(`${file}:${i + 1}  ${name}\n    ${line.trim().slice(0, 140)}`);
      }
    }
  });
}
console.log(issues ? `\n${issues} potential token violations` : "No hard-coded colours, sizes or durations found.");
process.exitCode = issues ? 1 : 0;
