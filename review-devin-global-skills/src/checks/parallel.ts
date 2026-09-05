import type { Context, SkillMeta } from "../types";

export function checkParallel(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");
  const rulesIdx = m.body.indexOf("## Rules");
  const expectedIdx = m.body.indexOf("## Expected Outcome");
  const ruleRegion = rulesIdx >= 0 ? m.body.slice(rulesIdx, expectedIdx >= 0 ? expectedIdx : undefined) : "";
  const expectedRegion = expectedIdx >= 0 ? m.body.slice(expectedIdx) : "";
  if (/[∥]/.test(ruleRegion)) {
    ctx.addFinding({ file: rpath, line: 1, category: "parallel", severity: "High", finding: "parallel marker in Rules", evidence: "contains ∥ in Rules section" }, m.skill);
  }
  if (/[∥]/.test(expectedRegion)) {
    ctx.addFinding({ file: rpath, line: 1, category: "parallel", severity: "High", finding: "parallel marker in Expected Outcome", evidence: "contains ∥ in Expected Outcome" }, m.skill);
  }
}
