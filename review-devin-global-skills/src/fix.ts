import { existsSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";
import type { Context, Finding } from "./types";

// Auto-fix safe findings. Currently supports:
// - "references/ exists without index.md" -> generate index listing references/*.md
export async function applyFixes(findings: Finding[], ctx: Context): Promise<number> {
  let fixed = 0;
  for (const f of findings) {
    if (!f.fixable) continue;
    if (f.finding === "references/ exists without index.md") {
      const refDir = join(ctx.skillsRoot, f.skill, "references");
      const indexPath = join(refDir, "index.md");
      if (existsSync(indexPath)) continue;
      const files: string[] = [];
      for (const p of new Glob("*.md").scanSync(refDir)) {
        if (p !== "index.md") files.push(p as string);
      }
      files.sort();
      const rows = files.map((x, i) => `| ${i + 1} | [${x}](${x}) | - |`).join("\n");
      const content = `# References\n\n| No. | File | Responsibility |\n|-----|------|----------------|\n${rows}\n`;
      await Bun.write(indexPath, content);
      fixed++;
    }
  }
  return fixed;
}
