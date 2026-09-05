import type { Frontmatter } from "./types";

export function parseFrontmatter(text: string): Frontmatter | null {
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const hintMatch = fm.match(/^argument-hint:\s*(.+)$/m);
  const related: string[] = [];
  let inRelated = false;
  for (const line of fm.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inRelated = line.startsWith("related:");
    } else if (inRelated && line.startsWith("  - ")) {
      related.push(line.slice(4).trim());
    }
  }
  return {
    name: nameMatch?.[1].trim(),
    description: descMatch?.[1].trim(),
    argumentHint: hintMatch?.[1].trim(),
    related,
  };
}

export function stripFrontmatter(text: string): string {
  return text.replace(/^---[\s\S]*?---\r?\n/, "");
}

export function extractSectionsWithLevels(text: string): string[] {
  const sections: string[] = [];
  for (const m of stripFrontmatter(text).matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    sections.push(`${m[1]} ${m[2].trim()}`);
  }
  return sections;
}

export function countExecuteSteps(text: string): number {
  const body = stripFrontmatter(text);
  const execStart = body.search(/^## Execute\s*$/m);
  if (execStart < 0) return 0;
  const rest = body.slice(execStart);
  const nextH2 = rest.slice(10).search(/^## /m);
  const region = nextH2 < 0 ? rest : rest.slice(0, nextH2 + 10);
  let count = 0;
  for (const _ of region.matchAll(/^###\s+\d+\.\s+/gm)) count++;
  return count;
}

export function nonCodeLines(text: string): string[] {
  const out: string[] = [];
  let inCode = false;
  for (const line of stripFrontmatter(text).split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (!inCode) out.push(line);
  }
  return out;
}

export function textOutsideInlineCode(line: string): string {
  const chunks = line.split("`");
  let out = "";
  for (let i = 0; i < chunks.length; i += 2) out += chunks[i] + " ";
  return out;
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isPlaceholderMarker(line: string): boolean {
  const t = textOutsideInlineCode(line);
  if (/(?:^|\s)(?:TODO|MOCK|placeholder)\s*[:：]/.test(t)) return true;
  if (/^\s*[-*]\s+(?:TODO|MOCK|placeholder)\b/i.test(t)) return true;
  return false;
}

export function isProhibitedOrLegit(line: string): boolean {
  const t = textOutsideInlineCode(line).toLowerCase();
  if (/\b(todo|mock|placeholder)\b/.test(t)) {
    if (/ห้าม|ไม่มี|ตรวจ|ใช้|แปลง|production code|report-scan-todo|update-todo-md|implement-todo-md/.test(t)) return true;
  }
  return false;
}

export function visibleLines(s: string): number {
  return s.trimEnd().split(/\r?\n/).length;
}
