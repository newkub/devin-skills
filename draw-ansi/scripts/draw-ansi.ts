#!/usr/bin/env bun
/**
 * draw-ansi.ts
 * Normalize and wrap content in a uniform ANSI outer box.
 * Usage:
 *   bunx ./draw-ansi.ts [options] [input-file]
 *   echo "line1" | bunx ./draw-ansi.ts --width 60 --title "My App"
 */

import { parseArgs } from "node:util";

const options = {
  width: { type: "string" as const },
  title: { type: "string" as const },
  fix: { type: "boolean" as const, default: false },
  format: { type: "string" as const, default: "text" },
  help: { type: "boolean" as const, default: false },
};

const args = parseArgs({ options, allowPositionals: true });

if (args.values.help) {
  console.log(`Usage: draw-ansi [options] [input-file]

Options:
  --width <number>   Inner width (default: auto from content)
  --title <string>   Title shown at the top line
  --fix              Re-wrap an existing box
  --format <text|markdown>  Output format (default: text)
  --help             Show this help
`);
  process.exit(0);
}

async function getInputText(): Promise<string> {
  const pos = args.positionals[0];
  if (pos) {
    return Bun.file(pos).text();
  }
  if (!process.stdin.isTTY) {
    return Bun.stdin.text();
  }
  return "";
}

function stripExistingBox(lines: string[]): string[] {
  // If first and last line look like a box border, strip them
  if (lines.length >= 2 && lines[0].startsWith("┌") && lines[lines.length - 1].startsWith("└")) {
    return lines.slice(1, -1).map((line) => {
      // strip leading │ and trailing │
      const m = line.match(/^([│┃\u2502\u2503]?)(.*)([│┃\u2502\u2503]?)$/);
      if (m) {
        return m[2].replace(/[│┃\u2502\u2503]$/, "").replace(/^[│┃\u2502\u2503]/, "");
      }
      return line;
    });
  }
  return lines;
}

function visualWidth(s: string): number {
  // Simple width for ANSI box drawing: count codepoints.
  // This is not a full East Asian width implementation,
  // but works for the Latin/box-drawing README use case.
  return [...s].length;
}

function padRight(s: string, width: number): string {
  const w = visualWidth(s);
  if (w >= width) return s.slice(0, width);
  return s + " ".repeat(width - w);
}

function makeBorder(prefix: string, char: string, width: number, suffix: string): string {
  return prefix + char.repeat(width) + suffix;
}

function drawBox(content: string, totalWidth: number, title?: string): string {
  const leftFrame = "│ ";
  const rightFrame = " │";
  const innerWidth = totalWidth - leftFrame.length - rightFrame.length;
  const rawLines = content.split(/\r?\n/);
  const lines: string[] = [];

  if (title) {
    const titleLine = ` ${title}`;
    lines.push(padRight(titleLine, innerWidth));
  }

  // Add one blank line after title to avoid touching the top border
  if (title) {
    lines.push("");
  }

  for (const line of rawLines) {
    // Each raw line is padded and wrapped with left/right border later
    lines.push(line);
  }

  const topBorder = makeBorder("┌", "─", totalWidth - 2, "┐");
  const bottomBorder = makeBorder("└", "─", totalWidth - 2, "┘");

  const body = lines.map((line) => {
    const inner = padRight(line, innerWidth);
    return leftFrame + inner + rightFrame;
  });

  const box = [topBorder, ...body, bottomBorder].join("\n");
  return box;
}

async function main() {
  let input = await getInputText();
  if (input.trim() === "") {
    console.error("Error: no input provided.");
    process.exit(1);
  }

  let lines = input.split(/\r?\n/);

  if (args.values.fix) {
    lines = stripExistingBox(lines);
  }

  // Compute total box width (default 60, total includes outer borders)
  let totalWidth = 60;
  if (args.values.width) {
    const parsed = parseInt(args.values.width, 10);
    if (!isNaN(parsed) && parsed >= 12) {
      totalWidth = parsed;
    }
  } else {
    const maxVisual = Math.max(...lines.map(visualWidth), 0);
    totalWidth = Math.max(60, maxVisual + 4);
  }

  const innerWidth = totalWidth - 4;

  // Truncate or pad each line
  const normalizedLines = lines.map((line) => {
    const w = visualWidth(line);
    if (w > innerWidth) {
      // truncate and warn
      console.warn(`Line longer than width (${w} > ${innerWidth}): ${line.slice(0, 40)}...`);
      return line.slice(0, innerWidth);
    }
    return padRight(line, innerWidth);
  });

  const content = normalizedLines.join("\n");
  const box = drawBox(content, totalWidth, args.values.title);

  let output = box;
  if (args.values.format === "markdown") {
    output = "```text\n" + box + "\n```";
  }

  console.log(output);
}

await main();
