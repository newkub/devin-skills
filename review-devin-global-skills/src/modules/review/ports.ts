import type { CheckName, Issue, PackageNode } from "../../shared/types.ts";

export interface SkillRepository {
  rootDir: string;
  listSkillNames(): string[];
  readSkillFile(skillName: string): string | null;
  listMarkdownFiles(): string[];
  readFile(filePath: string): string | null;
  countLines(filePath: string): number;
  getPackageTree(skillName: string): PackageNode;
}

export interface Reporter {
  report(message: string): void;
  reportIssue(issue: Issue): void;
  reportSummary(checkName: CheckName, issues: Issue[]): void;
  reportError(error: unknown): void;
}
