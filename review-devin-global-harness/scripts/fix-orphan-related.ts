import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { escapeRegExp, parseFrontmatter, stripFrontmatter } from "../src/parse";

const ROOT = process.env.APPDATA + "\\devin\\skills";
const skillDirs = new Set(
  readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => {
      try {
        return readFileSync(join(ROOT, n, "SKILL.md")).length > 0;
      } catch {
        return false;
      }
    }),
);

let touched = 0;
for (const dir of skillDirs) {
  const p = join(ROOT, dir, "SKILL.md");
  const text = readFileSync(p, "utf8");
  const fm = parseFrontmatter(text);
  if (!fm || fm.related.length === 0) continue;

  const body = stripFrontmatter(text);
  const seen = new Set<string>();
  const kept = fm.related.filter((ref) => {
    if (seen.has(ref)) return false;
    seen.add(ref);
    if (!skillDirs.has(ref)) return false;
    return new RegExp(`(?:\\b|/)${escapeRegExp(ref)}\\b`).test(body);
  });
  const removed = fm.related.length - kept.length;
  if (removed === 0) continue;

  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const fmEnd = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (fmEnd < 0) continue;

  const relIdx = lines.findIndex((l, i) => i < fmEnd && l.startsWith("related:"));
  if (relIdx < 0) continue;

  let listEnd = relIdx + 1;
  while (listEnd < fmEnd && /^\s+- /.test(lines[listEnd])) listEnd++;

  const newBlock = kept.length ? ["related:", ...kept.map((r) => `  - ${r}`)] : [];
  lines.splice(relIdx, listEnd - relIdx, ...newBlock);
  writeFileSync(p, lines.join(eol));
  touched++;
  console.log(`${dir}: ${fm.related.length} -> ${kept.length} (-${removed})`);
}
console.log(`\nTotal skills updated: ${touched}`);
