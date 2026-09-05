import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Context, SkillMeta } from "../types";

const TEMPLATE_DIR = join("follow-create-devin-global-skills", "templates");

const PREFIX_MAP: [RegExp, string][] = [
  [/^follow-.*-architecture$/, "follow-architecture"],
  [/^follow-lib-/, "lib"],
  [/^follow-/, "follow"],
  [/^run-/, "run"],
  [/^check-/, "check"],
  [/^analyze-/, "analyze"],
  [/^deep-/, "deep"],
  [/^review-/, "review"],
  [/^idea-/, "idea"],
  [/^report-/, "report"],
];

function templateFor(skill: string): string | null {
  for (const [re, tpl] of PREFIX_MAP) if (re.test(skill)) return tpl;
  return null;
}

export function checkTemplate(m: SkillMeta, ctx: Context) {
  const tpl = templateFor(m.skill);
  if (!tpl) return; // custom/unprefixed names are legitimate — prefix coverage is reported by cross-skill checks
  const tplPath = join(ctx.skillsRoot, TEMPLATE_DIR, `${tpl}.md`);
  if (!existsSync(tplPath)) {
    const rpath = m.path.replace(ctx.skillsRoot + "\\", "").replace(ctx.skillsRoot + "/", "");
    ctx.addFinding({ file: rpath, line: 1, category: "template", severity: "Low", finding: "template file missing for prefix", evidence: `${TEMPLATE_DIR}/${tpl}.md` }, m.skill);
  }
}
