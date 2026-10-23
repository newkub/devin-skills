import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HEADING_TOKEN = /^#{2,6}\s+\S/;
const REF_TOKEN = /^\/?([a-z0-9][a-z0-9-]+)(?:\/([A-Za-z0-9._/-]+\.md))?$/;

// A heading is attributed only inside the same citation cluster as the skill
// ref: nothing but separators between the spans. Prose in between (a later
// `## Conventions → X` that belongs to the current skill) must not inherit an
// earlier ref from the same line. `—` and `→` are excluded: they separate a
// ref from a flow/output spec ("skill — output", "a → b → c"), and no real
// citation in the repo is joined to its heading that way.
const CITATION_GAP = /^[\s()`\[\](),]*$/;

export type AnchorCheck = (body: string, offset: number) => string[];

// Verifies a cross-skill citation written as `skill` `## Heading`
// (or `skill/references/file.md` `## Heading`) against the target file.
export function anchorChecker(root: string): AnchorCheck {
  const known = new Set(
    readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(root, e.name, "SKILL.md")))
      .map((e) => e.name),
  );
  const headingCache = new Map<string, { level: number; text: string }[]>();

  function headingsOf(file: string): { level: number; text: string }[] {
    const cached = headingCache.get(file);
    if (cached) return cached;
    const heads: { level: number; text: string }[] = [];
    if (existsSync(file)) {
      let fence = false;
      for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        if (/^\s*(```|~~~)/.test(line)) {
          fence = !fence;
          continue;
        }
        if (fence) continue;
        const m = line.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/);
        if (m) heads.push({ level: m[1].length, text: m[2].trim() });
      }
    }
    headingCache.set(file, heads);
    return heads;
  }

  function matchesHeadingText(head: string, want: string): boolean {
    const w = want.toLowerCase();
    const raw = head.toLowerCase();
    for (const h of [raw, raw.replace(/^\d+\.\s+/, "")]) {
      if (h === w || h.startsWith(`${w}:`)) return true;
      if (/^\d+$/.test(w) && h.startsWith(`${w}.`)) return true;
    }
    return false;
  }

  function hasHeading(file: string, token: string): boolean {
    const heads = headingsOf(file);
    const segs = token.split("→").map((s) => s.trim()).filter(Boolean);
    let at = -1;
    for (const seg of segs) {
      const m = seg.match(/^(#{2,6})\s+(.+)$/);
      const level = m ? m[1].length : 0;
      const want = (m ? m[2] : seg).trim();
      const idx = heads.findIndex(
        (h, i) => i > at && (!level || h.level === level) && matchesHeadingText(h.text, want),
      );
      if (idx < 0) return false;
      at = idx;
    }
    return segs.length > 0;
  }

  function isHeadingToken(span: string): boolean {
    return HEADING_TOKEN.test(span) && !/[<>…*]/.test(span);
  }

  return (body, offset) => {
    const issues: string[] = [];
    let fence = false;
    let n = 0;
    for (const line of body.split(/\r?\n/)) {
      n++;
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
        continue;
      }
      if (fence) continue;
      let target: { file: string; label: string } | null = null;
      let prevEnd = -1;
      for (const m of line.matchAll(/`([^`\n]+)`/g)) {
        const gap = prevEnd < 0 ? "" : line.slice(prevEnd, m.index);
        if (prevEnd >= 0 && !CITATION_GAP.test(gap)) target = null;
        prevEnd = m.index! + m[0].length;
        const span = m[1].trim();
        const ref = span.match(REF_TOKEN);
        if (ref && known.has(ref[1])) {
          target = {
            file: ref[2] ? join(root, ref[1], ref[2]) : join(root, ref[1], "SKILL.md"),
            label: ref[2] ? `${ref[1]}/${ref[2]}` : ref[1],
          };
        } else if (isHeadingToken(span)) {
          if (target && !hasHeading(target.file, span))
            issues.push(`L${n + offset - 1} ${target.label}: ${span} missing`);
        } else {
          target = null;
        }
      }
    }
    return [...new Set(issues)];
  };
}
