import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.APPDATA + "\\devin\\skills";
const dirs = [
  "new-skills",
  "follow-deep",
  "follow-framework-svelte",
  "follow-service-vercel",
  "follow-solid-tanstack",
  "follow-tool-playwright",
  "follow-tool-renovate",
  "list-devin-global-skills",
  "open-github",
  "review-workflow",
  "update-project-skills",
  "visualize-in-web",
];

for (const d of dirs) {
  const p = join(ROOT, d, "SKILL.md");
  const raw = readFileSync(p, "utf8");
  const hasBom = raw.charCodeAt(0) === 0xfeff;
  const text = hasBom ? raw.slice(1) : raw;
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") {
    console.log(`${d}: SKIP no opening ---`);
    continue;
  }
  const kept = lines.filter((l) => !/^\s*- --\s*$/.test(l));
  const end = kept.findIndex((l, i) => i > 0 && l.trim() === "");
  if (end < 0) {
    console.log(`${d}: SKIP no blank line`);
    continue;
  }
  kept.splice(end, 0, "---");
  writeFileSync(p, kept.join(eol));
  console.log(`${d}: fixed${hasBom ? " (BOM stripped)" : ""}`);
}
