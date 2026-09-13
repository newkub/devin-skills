import type { Context, SkillMeta } from "../types";

const REQUIRED = ["Goal", "Scope", "Execute", "Rules", "Expected Outcome"];

export function checkSections(m: SkillMeta, ctx: Context) {
  const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");

  const h2s = m.sections.filter((l) => l.startsWith("## ")).map((l) => l.slice(3));
  for (const r of REQUIRED) {
    if (!h2s.includes(r)) {
      ctx.addFinding({ file: rpath, line: 1, category: "sections", severity: "Critical", finding: `missing section: ${r}`, evidence: `h2 sections: [${h2s.join(", ")}]` }, m.skill);
    }
  }
  const indices = REQUIRED.map((r) => h2s.indexOf(r));
  const sorted = [...indices].sort((a, b) => a - b);
  if (indices.every((i) => i >= 0) && JSON.stringify(indices) !== JSON.stringify(sorted)) {
    ctx.addFinding({ file: rpath, line: 1, category: "sections", severity: "High", finding: "section order incorrect", evidence: `indices: ${indices.join(",")}` }, m.skill);
  }
  if (m.executeSteps > 10) {
    ctx.addFinding({ file: rpath, line: 1, category: "sections", severity: "Medium", finding: "Execute has more than 10 steps", evidence: `steps: ${m.executeSteps}` }, m.skill);
  }

  // Each numbered step must have "> Goal:" before the next heading
  let inExecute = false;
  for (let i = 0; i < m.bodyLines.length; i++) {
    const l = m.bodyLines[i];
    if (l.startsWith("## Execute")) { inExecute = true; continue; }
    if (l.startsWith("## ") && inExecute) { inExecute = false; continue; }
    if (inExecute && /^###\s+\d+\.\s+/.test(l)) {
      let found = false;
      for (let j = i + 1; j < m.bodyLines.length; j++) {
        const next = m.bodyLines[j];
        if (next.startsWith("### ") || next.startsWith("## ")) break;
        if (next.trim().startsWith("> Goal:")) { found = true; break; }
      }
      if (!found) {
        ctx.addFinding({ file: rpath, line: i + 1, category: "sections", severity: "High", finding: "step missing > Goal:", evidence: l }, m.skill);
      }
    }
  }
}
