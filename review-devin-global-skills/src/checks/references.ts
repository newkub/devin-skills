import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { textOutsideInlineCode } from "../parse";
import type { Context, SkillMeta } from "../types";

const MD_LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
const SKILL_REF_RE = /(?<![\w/฀-๿])\/([a-z][a-z0-9]+(?:-[a-z0-9]+)*)\b(?![\w/])/g;

const IGNORED_PATH_TOKENS = new Set([
  "api", "docs", "usr", "bin", "etc", "tmp", "var", "opt", "home", "dev",
]);

export function checkReferences(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");

  // references/ dir must have index.md
  if (m.hasReferences && !m.hasReferencesIndex) {
    ctx.addFinding({ file: rpath, line: 1, category: "file-structure", severity: "Medium", finding: "references/ exists without index.md", evidence: "missing references/index.md", fixable: true }, m.skill);
  }

  const dir = dirname(m.path);
  const skillDir = resolve(dir);
  const seenSkillRefs = new Set<string>();

  for (let i = 0; i < m.nonCodeLines.length; i++) {
    const line = m.nonCodeLines[i];
    const outside = textOutsideInlineCode(line);
    const isUrlLine = /https?:\/\//.test(line);

    // Markdown links -> relative target must exist
    for (const mm of line.matchAll(MD_LINK_RE)) {
      const target = mm[1];
      if (/^(https?:|mailto:|#|\/)/.test(target)) continue;
      if (target.includes("%APPDATA%") || /^[A-Za-z]:[\\/]/.test(target)) continue;
      const resolved = resolve(skillDir, target.split("#")[0]);
      if (!existsSync(resolved)) {
        ctx.addFinding({ file: rpath, line: i + 1, category: "references", severity: "High", finding: "broken markdown link", evidence: `link: ${target}` }, m.skill);
      }
    }

    // /skill-name references -> must be an existing skill dir.
    // Only flag when the line looks like a skill invocation (ทำ/เรียก/ใช้/ดูเพิ่มเติม/delegate)
    // or the token is hyphenated (clearly a skill-style name), to avoid path/verb noise.
    const invocation = /ทำ\s*\/|เรียก\s*\/|ใช้\s*\/|ดูเพิ่มเติม|delegate|ส่งต่อ\s*\/|→\s*\//.test(outside);
    for (const mm of outside.matchAll(SKILL_REF_RE)) {
      const token = mm[1];
      if (token.includes("*")) continue;
      if (isUrlLine && line.slice(0, mm.index).includes("://")) continue;
      if (IGNORED_PATH_TOKENS.has(token)) continue;
      if (seenSkillRefs.has(token)) continue;
      seenSkillRefs.add(token);
      if (!ctx.skillDirs.has(token)) {
        if (!token.includes("-") && !invocation) continue;
        const sev = token.includes("-") ? "Medium" : "Info";
        ctx.addFinding({ file: rpath, line: i + 1, category: "references", severity: sev, finding: "slash reference to unknown skill", evidence: `/${token}` }, m.skill);
      }
    }
  }
}
