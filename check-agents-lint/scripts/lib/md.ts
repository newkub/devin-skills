import type { SkillDoc } from "./types.ts";

export interface Heading {
  level: number;
  text: string;
  line: number;
}

export function stripInlineCode(line: string): string {
  return line.replace(/`[^`]*`/g, "");
}

export function headings(doc: SkillDoc): Heading[] {
  const out: Heading[] = [];
  const lines = doc.body.split(/\r?\n/);
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (m) out.push({ level: m[1].length, text: m[2].trim(), line: i + 1 + doc.fmLines });
  }
  return out;
}

export function sectionEnd(heads: Heading[], index: number): number {
  const level = heads[index].level;
  for (let i = index + 1; i < heads.length; i++) if (heads[i].level <= level) return i;
  return heads.length;
}

const DELIMITER = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/;

function splitCells(line: string): string[] {
  let s = line.replace(/\\\|/g, "\u0000");
  s = s.replace(/`[^`]*`/g, (m) => m.replace(/\|/g, "\u0001"));
  const cells = s.split("|").map((c) => c.replace(/[\u0000\u0001]/g, "|").trim());
  if (/^\s*\|/.test(line) && cells.length) cells.shift();
  if (/\|\s*$/.test(line) && cells.length) cells.pop();
  return cells;
}

export interface TableIssue {
  line: number;
  message: string;
}

export function tableIssues(body: string, fmLines: number): TableIssue[] {
  const out: TableIssue[] = [];
  const lines = body.split(/\r?\n/);
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const next = lines[i + 1] ?? "";
    if (!line.includes("|") || !DELIMITER.test(next)) continue;
    const header = splitCells(line).length;
    const delimiter = splitCells(next).length;
    if (header !== delimiter)
      out.push({
        line: i + 1 + fmLines,
        message: `table header has ${header} cells but delimiter row has ${delimiter}`,
      });
    let j = i + 2;
    for (; j < lines.length; j++) {
      const row = lines[j];
      if (!row.trim() || !row.includes("|")) break;
      if (/^\s*(```|~~~)/.test(row)) break;
      const cells = splitCells(row).length;
      if (cells !== header)
        out.push({
          line: j + 1 + fmLines,
          message: `table row has ${cells} cells (header has ${header})`,
        });
    }
    i = j - 1;
  }
  return out;
}
