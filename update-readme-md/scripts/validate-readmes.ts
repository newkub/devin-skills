#!/usr/bin/env bun
/**
 * validate-readmes.ts
 * Check all D: project READMEs against update-readme-md rules.
 */

import { join } from "node:path";

const PROJECTS = [
  "D:\\forked\\terax-ai",
  "D:\\newkub\\github-ship-bots",
  "D:\\newkub\\newkub",
  "D:\\newkub\\notes",
  "D:\\newkub\\slides",
  "D:\\newkub\\solid-ui",
  "D:\\newkub\\template-starter",
  "C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills\\create-github-pr",
  "D:\\newkub\\wpackages",
  "D:\\newkub\\newkub\\slides",
  "D:\\newkub\\products\\agents-manager",
  "D:\\newkub\\products\\explore-opensource",
  "D:\\newkub\\products\\registry",
  "D:\\newkub\\products\\wrikka-com",
  "D:\\newkub\\web-side-projects\\animal-dance",
  "D:\\newkub\\web-side-projects\\awesome-opensource",
  "D:\\newkub\\web-side-projects\\compareit",
  "D:\\newkub\\web-side-projects\\tiermaker",
  "D:\\newkub\\wpackages\\browser-extensions",
  "D:\\newkub\\wpackages\\bun-packages",
  "D:\\newkub\\wpackages\\rust-packages",
  "D:\\newkub\\wpackages\\vscode-extensions",
  "D:\\newkub\\wpackages\\wpackages-temp",
  "D:\\saas\\booking-platform",
  "D:\\saas\\compare-platform",
  "D:\\saas\\skills-as-a-services",
  "D:\\saas\\trading",
  "D:\\saas\\wrikka-platform",
  "D:\\saas\\wrikka-platform\\apps\\mobile",
];

async function readReadme(path: string): Promise<string | null> {
  try {
    return await Bun.file(join(path, "README.md")).text();
  } catch {
    return null;
  }
}

function validate(path: string, content: string): string[] {
  const issues: string[] = [];
  const lines = content.split(/\r?\n/);

  if (!content.startsWith("> ")) {
    issues.push("missing status callout at top");
  }

  const has5ColFeatures = /\|\s*Icon\s*\|\s*Feature\s*\|\s*Description\s*\|\s*Benefit\s*\|\s*Usage\s*\|/.test(content);
  if (!has5ColFeatures) {
    issues.push("features table does not have 5 columns");
  }

  if (content.includes("```ansi")) {
    issues.push("uses forbidden ```ansi codeblock");
  }

  const hasWebAccordion = /###\s+Usage via Web[\s\S]*?<details>[\s\S]*?<\/details>/.test(content);
  const hasTUIAccordion = /###\s+Usage via TUI[\s\S]*?<details>[\s\S]*?<\/details>/.test(content);
  const hasCliHelp = /###\s+Usage via CLI[\s\S]*?(--help)[\s\S]*?```text/.test(content);

  if (!hasCliHelp && !hasWebAccordion) {
    issues.push("no usage sections found");
  }

  // Check section order roughly
  const sectionOrder = ["## Get Started", "## Features", "## Usage"];
  const positions = sectionOrder.map((s) => content.indexOf(s));
  for (let i = 0; i < positions.length - 1; i++) {
    if (positions[i] === -1) {
      issues.push(`missing ${sectionOrder[i]}`);
    } else if (positions[i + 1] !== -1 && positions[i] > positions[i + 1]) {
      issues.push(`section order wrong: ${sectionOrder[i]} after ${sectionOrder[i + 1]}`);
    }
  }

  // Check ANSI box-drawing line lengths
  const textBlocks: string[] = [];
  let inText = false;
  let buffer: string[] = [];
  for (const line of lines) {
    if (line.startsWith("```text")) {
      inText = true;
      buffer = [];
    } else if (inText && line.startsWith("```")) {
      inText = false;
      textBlocks.push(buffer.join("\n"));
      buffer = [];
    } else if (inText) {
      buffer.push(line);
    }
  }

  for (const block of textBlocks) {
    const blockLines = block.split("\n");
    if (blockLines.some((l) => l.includes("┌") || l.includes("└") || l.includes("│"))) {
      const widths = blockLines.map((l) => [...l].length);
      const max = Math.max(...widths);
      const min = Math.min(...widths);
      if (max !== min) {
        issues.push(`ANSI box-drawing line widths vary (${min}-${max})`);
      }
    }
  }

  return issues;
}

async function main() {
  const results: { path: string; issues: string[] }[] = [];
  for (const path of PROJECTS) {
    const content = await readReadme(path);
    if (!content) {
      results.push({ path, issues: ["README.md missing"] });
      continue;
    }
    const issues = validate(path, content);
    results.push({ path, issues });
  }

  let ok = 0;
  for (const r of results) {
    if (r.issues.length === 0) {
      console.log(`OK ${r.path}`);
      ok++;
    } else {
      console.log(`FAIL ${r.path}`);
      for (const issue of r.issues) {
        console.log(`  - ${issue}`);
      }
    }
  }

  console.log(`\n${ok}/${results.length} projects passed validation.`);
}

await main();
