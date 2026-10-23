import { finding } from "./catalog.ts";
import { entryItems, fmEntry, relPath } from "./parse.ts";
import type { Ctx, Finding } from "./types.ts";

const ALLOWED_KEYS = new Set([
  "name",
  "description",
  "argument-hint",
  "related",
  "allowed-tools",
  "model",
  "subagent",
  "agent",
  "permissions",
  "triggers",
]);

const NAME_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function runFm(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const doc of ctx.skills) {
    if (!doc.hasSkillMd) continue;
    const file = relPath(ctx.root, doc.file);
    if (doc.fmError) {
      out.push(finding("struct/frontmatter-parse", file, 1, doc.fmError));
      continue;
    }

    const name = fmEntry(doc, "name");
    const description = fmEntry(doc, "description");

    if (!name) out.push(finding("struct/frontmatter-required", file, 1, "frontmatter is missing required key name"));
    if (!description)
      out.push(finding("struct/frontmatter-required", file, 1, "frontmatter is missing required key description"));

    if (name) {
      const value = name.value.trim();
      if (value && value !== doc.dir)
        out.push(
          finding(
            "struct/name-matches-dir",
            file,
            name.line,
            `frontmatter name "${value}" does not match directory "${doc.dir}"`,
          ),
        );
      if (value && !NAME_FORMAT.test(value))
        out.push(finding("struct/name-format", file, name.line, `frontmatter name "${value}" is not lowercase kebab-case`));
    }

    if (description) {
      const length = description.value.trim().length;
      if (length > 100)
        out.push(
          finding(
            "struct/description-length",
            file,
            description.line,
            `description is ${length} characters (limit 100)`,
          ),
        );
    }

    if (!doc.parent) {
      if (!fmEntry(doc, "argument-hint"))
        out.push(finding("struct/frontmatter-argument-hint", file, 1, "argument-hint is not declared"));
      if (entryItems(doc, "related").length === 0)
        out.push(finding("struct/frontmatter-related", file, 1, "related list is missing or empty"));
    }

    for (const [key, entry] of doc.fm) {
      if (!ALLOWED_KEYS.has(key))
        out.push(finding("struct/frontmatter-unknown-key", file, entry.line, `unknown frontmatter key "${key}"`));
    }
  }
  return out;
}
