import { join } from "node:path";
import { parseFrontmatter, bodyOffset } from "../../../../shared/utils.ts";
import type { Issue, Skill } from "../../../../shared/types.ts";

const REQUIRED_SECTIONS = ["Goal", "Scope", "Execute", "Rules", "Expected Outcome"];
const MAX_EXECUTE_STEPS = 10;

export function checkContentStructure(skills: Skill[]): Issue[] {
  const issues: Issue[] = [];

  function add(skillName: string, line: number, message: string) {
    issues.push({ file: join(skillName, "SKILL.md"), line, message });
  }

  for (const { name, content } of skills) {
    if (!content) {
      add(name, 1, "missing SKILL.md");
      continue;
    }
    const fm = parseFrontmatter(content);
    if (!fm) {
      add(name, 1, "malformed frontmatter");
      continue;
    }

    const lines = fm.body.split(/\r?\n/);
    const offset = bodyOffset(fm.raw) - 1;

    const headings: { name: string; fileLine: number }[] = [];
    const executeSteps: { title: string; fileLine: number }[] = [];
    let currentMainSection = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        currentMainSection = h2[1].trim();
        headings.push({ name: currentMainSection, fileLine: offset + i + 1 });
        continue;
      }
      const h3 = line.match(/^###\s+(\d+)\.\s+(.+)$/);
      if (h3 && currentMainSection === "Execute") {
        executeSteps.push({ title: h3[2].trim(), fileLine: offset + i + 1 });
      }
    }

    for (const req of REQUIRED_SECTIONS) {
      const found = headings.find((h) => h.name === req);
      if (!found) {
        add(name, 1, `missing required section '## ${req}'`);
      }
    }

    let prevIdx = -1;
    for (const req of REQUIRED_SECTIONS) {
      const idx = headings.findIndex((h) => h.name === req);
      if (idx === -1) continue;
      if (idx < prevIdx) {
        add(name, headings[idx].fileLine, `section '## ${req}' is out of order`);
      }
      prevIdx = idx;
    }

    if (executeSteps.length > MAX_EXECUTE_STEPS) {
      add(name, executeSteps[MAX_EXECUTE_STEPS].fileLine, `Execute has more than ${MAX_EXECUTE_STEPS} steps`);
    }

    for (const step of executeSteps) {
      const goalPattern = new RegExp(`^>\\s*Goal:.*${step.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`);
      const goalLine = lines.findIndex(
        (l, idx) => l.trim().startsWith("> Goal:") && idx > 0 && offset + idx + 1 > step.fileLine,
      );
      let hasGoal = false;
      for (let i = 0; i < lines.length; i++) {
        if (offset + i + 1 <= step.fileLine) continue;
        if (/^###\s+\d+\./.test(lines[i])) break;
        if (lines[i].trim().startsWith("> Goal:")) {
          hasGoal = true;
          break;
        }
      }
      if (!hasGoal) {
        add(name, step.fileLine, `step '${step.title}' is missing a '> Goal:' line`);
      }
    }
  }

  return issues;
}
