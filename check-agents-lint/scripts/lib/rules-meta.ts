import { finding } from "./catalog.ts";
import { allDocs, entryItems, entryLine, fmEntry, fmValue, relPath } from "./parse.ts";
import type { Ctx, Finding, SkillDoc } from "./types.ts";

const CHECK_TOOLS = ["exec", "grep", "glob", "find_file_by_name"];

function mentioned(body: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z0-9_-])/?${escaped}(?![A-Za-z0-9_-])`).test(body);
}

function meta(ctx: Ctx, doc: SkillDoc, out: Finding[]): void {
  if (doc.fmError) return;
  const file = relPath(ctx.root, doc.file);
  const related = entryItems(doc, "related");
  const own = doc.parent ? fmValue(doc, "name") : doc.dir;
  const seen = new Set<string>();

  for (let i = 0; i < related.length; i++) {
    const name = related[i];
    const line = entryLine(doc, "related", i);
    if (!name) continue;
    if (name === own) out.push(finding("meta/related-self", file, line, `related lists the skill itself: "${name}"`));
    if (seen.has(name)) out.push(finding("meta/related-duplicate", file, line, `related has a duplicate entry: "${name}"`));
    seen.add(name);
    if (!ctx.skillNames.has(name))
      out.push(finding("meta/related-exists", file, line, `related target "${name}" is not a skill package`));
    if (!doc.parent && !mentioned(doc.body, name))
      out.push(finding("meta/related-mentioned", file, line, `related target "${name}" is not mentioned in the body`));
  }

  if (related.length > 15)
    out.push(finding("meta/related-max", file, 1, `related has ${related.length} entries (limit 15)`));

  if (!doc.parent && doc.dir.startsWith("check-")) {
    const tools = entryItems(doc, "allowed-tools");
    const missing = CHECK_TOOLS.filter((tool) => !tools.includes(tool));
    if (missing.length)
      out.push(
        finding("meta/check-allowed-tools", file, 1, `check-* allowed-tools is missing: ${missing.join(", ")}`),
      );
  }
}

export function runMeta(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const doc of allDocs(ctx)) meta(ctx, doc, out);

  for (const wf of ctx.workflows) {
    if (!wf.hasSkillMd) {
      out.push(
        finding("meta/workflow-skill-valid", relPath(ctx.root, wf.dirPath), 1, "workflow directory has no SKILL.md"),
      );
      continue;
    }
    const parts = wf.dir.split("/");
    const expected = `${parts[0]}-${parts[2]}`;
    const entry = fmEntry(wf, "name");
    if (entry && entry.value.trim() && entry.value.trim() !== expected)
      out.push(
        finding(
          "meta/workflow-name-format",
          relPath(ctx.root, wf.file),
          entry.line,
          `workflow name "${entry.value.trim()}" should be "${expected}"`,
        ),
      );
  }
  return out;
}
