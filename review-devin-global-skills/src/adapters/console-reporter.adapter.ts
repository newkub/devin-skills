import picocolors from "picocolors";
import type { CheckName, Issue } from "../shared/types.ts";
import type { Reporter } from "../modules/review/ports.ts";

export class ConsoleReporter implements Reporter {
  report(message: string): void {
    console.log(message);
  }

  reportIssue(issue: Issue): void {
    console.log(`${issue.file}:${issue.line}: ${issue.message}`);
  }

  reportSummary(checkName: CheckName, issues: Issue[]): void {
    if (issues.length === 0) {
      console.log(picocolors.green(`No ${checkName} issues found.`));
      return;
    }

    for (const issue of issues) {
      this.reportIssue(issue);
    }
    console.log(picocolors.red(`\nTotal ${checkName} issues: ${issues.length}`));
  }

  reportError(error: unknown): void {
    console.error(picocolors.red(error instanceof Error ? error.message : String(error)));
  }
}
