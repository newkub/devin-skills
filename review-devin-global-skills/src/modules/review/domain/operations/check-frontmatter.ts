import { join } from "node:path";
import { KNOWN_TOP_KEYS, VALID_TRIGGERS } from "../../../../shared/constants.ts";
import { lineOf, parseFrontmatter } from "../../../../shared/utils.ts";
import type { Issue, Skill } from "../../../../shared/types.ts";

export function checkFrontmatter(skills: Skill[], allNames: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const seenNames = new Map<string, string>();

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
      add(name, 1, "missing or malformed frontmatter");
      continue;
    }
    const { raw, data } = fm;

    if (!data.name) {
      add(name, 1, "missing 'name' in frontmatter");
    } else if (data.name !== name) {
      add(name, lineOf(raw, "name"), `name '${data.name}' does not match directory '${name}'`);
    }

    if (typeof data.name === "string") {
      if (seenNames.has(data.name)) {
        add(name, lineOf(raw, "name"), `duplicate name '${data.name}' also used in '${seenNames.get(data.name)}'`);
      } else {
        seenNames.set(data.name, name);
      }
    }

    if (!data.description) {
      add(name, 1, "missing 'description' in frontmatter");
    } else if (typeof data.description === "string" && data.description.length > 100) {
      add(name, lineOf(raw, "description"), `description is ${data.description.length} chars (max 100)`);
    }

    const allowedTools = data["allowed-tools"];
    if (!Array.isArray(allowedTools)) {
      add(name, lineOf(raw, "allowed-tools"), "'allowed-tools' must be a list");
    } else {
      for (const tool of allowedTools) {
        if (typeof tool !== "string" || !tool.trim()) {
          add(name, lineOf(raw, "allowed-tools"), `invalid tool in 'allowed-tools': ${tool}`);
        }
      }
    }

    const triggers = data.triggers;
    if (!Array.isArray(triggers)) {
      add(name, lineOf(raw, "triggers"), "'triggers' must be a list");
    } else {
      for (const t of triggers) {
        if (!VALID_TRIGGERS.has(t)) {
          add(name, lineOf(raw, "triggers"), `invalid trigger '${t}'`);
        }
      }
    }

    const related = data.related;
    if (!Array.isArray(related)) {
      add(name, lineOf(raw, "related"), "'related' must be a list");
    } else {
      for (const rel of related) {
        const clean = String(rel).replace(/#.*$/, "").trim();
        if (!clean) continue;
        if (clean === name) {
          add(name, lineOf(raw, "related"), `'related' must not include the skill itself '${name}'`);
        } else if (!allNames.has(clean)) {
          add(name, lineOf(raw, "related"), `missing related skill '${clean}'`);
        }
      }
    }

    for (const k of Object.keys(data)) {
      if (!KNOWN_TOP_KEYS.has(k)) {
        add(name, lineOf(raw, k), `unknown frontmatter key '${k}'`);
      }
    }
  }

  return issues;
}
