import type { CheckName, Issue } from "../../../shared/types.ts";
import type { Reporter, SkillRepository } from "../ports.ts";
import { runSingleCheck } from "./run-single-check.usecase.ts";

const CHECK_ORDER: Exclude<CheckName, "all">[] = [
  "frontmatter",
  "content-structure",
  "file-structure",
  "long-files",
  "missing-skills",
];

export function runReview(repo: SkillRepository, reporter: Reporter): Issue[] {
  const allIssues: Issue[] = [];

  for (const name of CHECK_ORDER) {
    const issues = runSingleCheck(name, repo, reporter);
    allIssues.push(...issues);
  }

  reporter.report(`Total issues: ${allIssues.length}`);
  return allIssues;
}
