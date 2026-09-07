import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SKILLS_ROOT = (process.env.APPDATA || "C:/Users/Veerapong/AppData/Roaming") + "/devin/skills";
const report = JSON.parse(readFileSync("review-skills-report.json", "utf8"));

function getSkillPath(skill: string) {
  return join(SKILLS_ROOT, skill, "SKILL.md");
}

function removeFromRelated(content: string, target: string): string {
  const lines = content.split(/\r?\n/);
  const targetLine = `  - ${target}`;
  const filtered = lines.filter((line) => line.trim() !== targetLine.trim());
  return filtered.join("\n");
}

function removeBoldMarkers(content: string): string {
  return content.replace(/\*\*/g, "");
}

function fixUnknownSlashRef(content: string, evidence: string): string {
  if (evidence.includes("/update-devin-global")) {
    return content.replace(/\/update-devin-global(?!-skills)/g, "/update-devin-global-skills");
  }
  return content;
}

function fixFrontmatterLine(content: string, lineNum: number, transformer: (line: string) => string): string {
  const lines = content.split(/\r?\n/);
  if (lineNum >= 0 && lineNum < lines.length) {
    lines[lineNum] = transformer(lines[lineNum]);
  }
  return lines.join("\n");
}

let changed = 0;

for (const f of report.findings) {
  const skillPath = getSkillPath(f.skill);
  let content: string;
  try {
    content = readFileSync(skillPath, "utf8");
  } catch {
    console.log(`Skip ${f.skill}: file not found`);
    continue;
  }
  let modified = false;

  if (f.finding === "orphan related reference") {
    const m = f.evidence.match(/related:\s*(.+?)\s+not mentioned/);
    if (m) {
      const target = m[1].trim();
      const newContent = removeFromRelated(content, target);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
  } else if (f.finding === "related exceeds 15 skills") {
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      const fmLines = fm.split(/\r?\n/);
      const newFmLines: string[] = [];
      const relatedLines: string[] = [];
      let inRelated = false;
      for (const line of fmLines) {
        if (line.startsWith("related:")) {
          inRelated = true;
          newFmLines.push(line);
          continue;
        }
        if (inRelated) {
          if (line.match(/^\s*- /)) {
            relatedLines.push(line);
            if (relatedLines.length <= 15) {
              newFmLines.push(line);
            }
          } else {
            inRelated = false;
            newFmLines.push(line);
          }
        } else {
          newFmLines.push(line);
        }
      }
      const newFm = newFmLines.join("\n");
      content = content.replace(fmMatch[1], newFm);
      modified = true;
    }
  } else if (f.finding === "uses bold markers **") {
    const lineNum = f.line - 1;
    content = fixFrontmatterLine(content, lineNum, removeBoldMarkers);
    modified = true;
  } else if (f.finding === "slash reference to unknown skill") {
    content = fixUnknownSlashRef(content, f.evidence);
    modified = true;
  } else if (f.finding === "unclosed frontmatter") {
    console.log(`Manual check needed: ${f.file} unclosed frontmatter`);
  }

  if (modified) {
    writeFileSync(skillPath, content);
    changed++;
    console.log(`Fixed ${f.skill}: ${f.finding}`);
  }
}

console.log(`Total files modified: ${changed}`);
