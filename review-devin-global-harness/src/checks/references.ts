import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { relativePath, textOutsideInlineCode } from "../parse";
import type { Context, SkillMeta } from "../types";

const MD_LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
// A trailing `-` is excluded so `/follow-tool` never matches the prefix of `/follow-tool-*`.
const SKILL_REF_RE = /(?<![\w/฀-๿])\/([a-z][a-z0-9]+(?:-[a-z0-9]+)*)\b(?![-\w/])/g;
// A slash ref must be preceded by a delimiter. A slash that directly follows a
// CLOSING backtick is a slash-list in prose (`theme.colors`/non-color), not a skill ref.
const ALLOWED_PREV = /[\s([{"':,*|→]/;
// Slash commands of other products, and placeholder names used in prose.
const FOREIGN_SLASH_TOKENS = new Set([
  "skill-name", "plugin-name", "web-proto", "non-color", "feature-check", "edge-cases",
  "add-dir", "accept-edits", "rm-session", "reload-plugins", "agents", "workspace", "title", "ls",
  "seo-audit", "keyword-research", "competitor-analysis", "seo-coach",
]);
// Historical notes keep a deleted skill's old name on purpose (`merged from \`/x\``).
const HISTORICAL_RE = /merged\s+(?:from|into|the|`)|folded into|renamed from|replaced by|deleted without merge|was deleted/;

const isOpeningBacktick = (line: string, index: number) => {
  let ticks = 0;
  for (let i = 0; i < index; i++) if (line[i] === "`") ticks++;
  return ticks % 2 === 0;
};

const IGNORED_PATH_TOKENS = new Set([
  "api", "docs", "usr", "bin", "etc", "tmp", "var", "opt", "home", "dev",
]);

export function checkReferences(m: SkillMeta, ctx: Context) {
  const rpath = relativePath(m.path, ctx.skillsRoot);

  const dir = dirname(m.path);
  const skillDir = resolve(dir);
  const seenSkillRefs = new Set<string>();

  for (let i = 0; i < m.nonCodeLines.length; i++) {
    const line = m.nonCodeLines[i];
    const outside = textOutsideInlineCode(line);
    const isUrlLine = /https?:\/\//.test(line);

    // Markdown links -> relative target must exist (only outside inline code)
    for (const mm of outside.matchAll(MD_LINK_RE)) {
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
    const invocation = /ทำ\s*\/|เรียก\s*\/|ใช้\s*\/|ดูเพิ่มเติม|delegate|ส่งต่อ\s*\/|→\s*\//.test(line);
    const historical = HISTORICAL_RE.test(line);
    for (const mm of line.matchAll(SKILL_REF_RE)) {
      const token = mm[1];
      if (token.includes("*")) continue;
      if (historical) continue;
      if (isUrlLine && line.slice(0, mm.index).includes("://")) continue;
      const prev = mm.index > 0 ? line[mm.index - 1] : "";
      if (prev === "`") {
        if (!isOpeningBacktick(line, mm.index - 1)) continue;
      } else if (prev && !ALLOWED_PREV.test(prev)) continue;
      if (FOREIGN_SLASH_TOKENS.has(token)) continue;
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
