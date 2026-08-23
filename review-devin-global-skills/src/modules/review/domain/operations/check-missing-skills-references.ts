import { join } from "node:path";
import { IGNORE_REFS } from "../../../../shared/constants.ts";
import { bodyOffset, parseFrontmatter } from "../../../../shared/utils.ts";
import type { Issue, Skill } from "../../../../shared/types.ts";

const BACKTICK_RE = /`\s*\/([a-z][-a-z0-9]*)\s*`/g;
const VERB_SLASH_RE = /(?:ทำ|ใช้|เรียก|ตาม|ทำตาม)\s+\/([a-z][-a-z0-9]*)\b/g;

function isIgnored(ref: string): boolean {
  if (ref.includes("*")) return true;
  if (IGNORE_REFS.has(ref)) return true;
  if (ref.endsWith("-")) return true;
  return false;
}

export function checkMissingSkillsReferences(skills: Skill[], allNames: Set<string>): Issue[] {
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
    const offset = bodyOffset(fm.raw) - 1;
    const bodyLines = fm.body.split(/\r?\n/);

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      if (line.startsWith("```")) continue;
      for (const re of [BACKTICK_RE, VERB_SLASH_RE]) {
        let m: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((m = re.exec(line)) !== null) {
          const ref = m[1];
          if (isIgnored(ref)) continue;
          if (!allNames.has(ref)) {
            add(name, offset + i + 1, `missing skill reference '/${ref}'`);
          }
        }
      }
    }

    const related = Array.isArray(fm.data.related) ? (fm.data.related as unknown[]) : [];
    for (const rel of related) {
      const clean = String(rel).replace(/#.*$/, "").trim();
      if (!clean || isIgnored(clean) || clean === name) continue;
      if (!allNames.has(clean)) {
        add(name, 1, `missing related skill '${clean}'`);
      }
    }
  }

  return issues;
}
