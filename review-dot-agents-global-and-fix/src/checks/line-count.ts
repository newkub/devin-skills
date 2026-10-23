import type { Context, SkillMeta } from "../types";

export function checkLineCount(m: SkillMeta, ctx: Context) {
  for (const mdf of m.allMdFiles) {
    if (mdf.lines <= 250) continue;
    let sev: "Critical" | "Medium" | "Low";
    if (mdf.isSkill) {
      sev = mdf.lines > 300 ? "Critical" : mdf.lines <= 260 ? "Low" : "Medium";
    } else {
      sev = mdf.lines <= 260 ? "Low" : "Medium";
    }
    ctx.addFinding({ file: mdf.path, line: mdf.lines, category: "line-count", severity: sev, finding: "file exceeds 250 lines", evidence: `lines: ${mdf.lines}` }, m.skill);
  }
}
