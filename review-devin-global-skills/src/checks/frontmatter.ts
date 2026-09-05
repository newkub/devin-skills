import { escapeRegExp } from "../parse";
import type { Context, SkillMeta } from "../types";

export function checkFrontmatter(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");
  const { frontmatter: fm, body } = m;

  if (!fm) {
    ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Critical", finding: "missing frontmatter", evidence: "no --- frontmatter block" }, m.skill);
    return;
  }
  if (!fm.name) {
    ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Critical", finding: "missing name", evidence: "frontmatter has no name" }, m.skill);
  } else if (fm.name !== m.skill) {
    ctx.addFinding({ file: rpath, line: 2, category: "frontmatter", severity: "Critical", finding: "name mismatch", evidence: `name: ${fm.name}, directory: ${m.skill}` }, m.skill);
  }
  if (fm.description !== undefined) {
    const descLen = [...fm.description].length;
    if (descLen > 100) {
      ctx.addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Low", finding: "description over 100 chars", evidence: `length: ${descLen}` }, m.skill);
    }
    if (descLen < 20) {
      ctx.addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Info", finding: "description too short", evidence: `length: ${descLen}` }, m.skill);
    }
  } else {
    ctx.addFinding({ file: rpath, line: 3, category: "frontmatter", severity: "Critical", finding: "missing description", evidence: "frontmatter has no description" }, m.skill);
  }
  if (!fm.argumentHint) {
    ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Info", finding: "missing argument-hint", evidence: "frontmatter has no argument-hint" }, m.skill);
  }
  if (fm.related.length > 15) {
    ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Medium", finding: "related exceeds 15 skills", evidence: `count: ${fm.related.length}` }, m.skill);
  }
  for (const ref of fm.related) {
    if (!ctx.skillDirs.has(ref)) {
      ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "High", finding: "missing related skill", evidence: `related: ${ref}` }, m.skill);
    } else {
      const mention = new RegExp(`(?:\\b|/)${escapeRegExp(ref)}\\b`).test(body);
      if (!mention) {
        ctx.addFinding({ file: rpath, line: 1, category: "frontmatter", severity: "Medium", finding: "orphan related reference", evidence: `related: ${ref} not mentioned in body` }, m.skill);
      }
    }
  }
}
