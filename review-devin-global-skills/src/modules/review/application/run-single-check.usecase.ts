import { ReviewError } from "../../../shared/errors.ts";
import type { CheckName, Issue, PackageNode, Skill, SkillFile } from "../../../shared/types.ts";
import type { Reporter, SkillRepository } from "../ports.ts";
import { checkFrontmatter } from "../domain/operations/check-frontmatter.ts";
import { checkContentStructure } from "../domain/operations/check-content-structure.ts";
import { checkFileStructure } from "../domain/operations/check-file-structure.ts";
import { checkLongFiles } from "../domain/operations/check-long-files-250.ts";
import { checkMissingSkillsReferences } from "../domain/operations/check-missing-skills-references.ts";

export function runSingleCheck(
  name: Exclude<CheckName, "all">,
  repo: SkillRepository,
  reporter: Reporter,
): Issue[] {
  const skillNames = repo.listSkillNames();
  const allNames = new Set(skillNames);
  const skills: Skill[] = skillNames.map((n) => ({ name: n, content: repo.readSkillFile(n) }));

  let issues: Issue[] = [];

  switch (name) {
    case "frontmatter":
      issues = checkFrontmatter(skills, allNames);
      break;
    case "content-structure":
      issues = checkContentStructure(skills);
      break;
    case "file-structure": {
      const trees: PackageNode[] = skillNames.map((n) => repo.getPackageTree(n));
      issues = checkFileStructure(skillNames, trees);
      break;
    }
    case "long-files": {
      const files: Pick<SkillFile, "path" | "lineCount">[] = repo
        .listMarkdownFiles()
        .map((p) => ({ path: p, lineCount: repo.countLines(p) }));
      issues = checkLongFiles(files);
      break;
    }
    case "missing-skills":
      issues = checkMissingSkillsReferences(skills, allNames);
      break;
    default:
      throw new ReviewError(`Unknown check: ${String(name)}`);
  }

  reporter.reportSummary(name, issues);
  return issues;
}
