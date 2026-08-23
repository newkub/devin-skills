import { cac } from "cac";
import picocolors from "picocolors";
import { resolve } from "node:path";
import { BunFilesystemSkillRepository } from "../adapters/bun-filesystem-skill-repository.adapter.ts";
import { ConsoleReporter } from "../adapters/console-reporter.adapter.ts";
import { runReview } from "../modules/review/application/run-review.usecase.ts";
import { runSingleCheck } from "../modules/review/application/run-single-check.usecase.ts";
import type { CheckName } from "../shared/types.ts";

const DEFAULT_ROOT = resolve(import.meta.dir, "..", "..", "..");
const cli = cac("review-devin-global-skills");

cli.option("--root <root>", "Skills root directory", { default: DEFAULT_ROOT });

function runSingle(name: Exclude<CheckName, "all">) {
  return (options: { root: string }) => {
    const reporter = new ConsoleReporter();
    try {
      const repo = new BunFilesystemSkillRepository(options.root);
      const issues = runSingleCheck(name, repo, reporter);
      process.exit(issues.length > 0 ? 1 : 0);
    } catch (error) {
      reporter.reportError(error);
      process.exit(1);
    }
  };
}

cli
  .command("frontmatter", "validate skill frontmatter")
  .action(runSingle("frontmatter"));

cli
  .command("content-structure", "validate content section structure")
  .action(runSingle("content-structure"));

cli
  .command("file-structure", "validate directory and file names")
  .action(runSingle("file-structure"));

cli
  .command("long-files", "find files over 250 lines")
  .action(runSingle("long-files"));

cli
  .command("missing-skills", "find broken skill references")
  .action(runSingle("missing-skills"));

cli
  .command("all", "run all checks")
  .action((options: { root: string }) => {
    const reporter = new ConsoleReporter();
    try {
      const repo = new BunFilesystemSkillRepository(options.root);
      const issues = runReview(repo, reporter);
      if (issues.length > 0) {
        console.log(picocolors.red("\nSome checks failed."));
        process.exit(1);
      }
      console.log(picocolors.green("\nAll checks passed."));
      process.exit(0);
    } catch (error) {
      reporter.reportError(error);
      process.exit(1);
    }
  });

cli.help();
cli.version("0.0.1");
cli.parse();
