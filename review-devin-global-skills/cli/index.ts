import { cac } from "cac";
import picocolors from "picocolors";

const cli = cac("review-devin-global-skills");

function runCheck(file: string) {
  return async () => {
    console.log(picocolors.blue(`--- running ${file} ---`));
    const proc = Bun.spawn(["bun", "run", `./${file}`], {
      cwd: import.meta.dir,
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    });
    await proc.exited;
    process.exit(proc.exitCode ?? 0);
  };
}

cli
  .command("frontmatter", "validate skill frontmatter")
  .action(runCheck("check-frontmatter.ts"));

cli
  .command("content-structure", "validate content section structure")
  .action(runCheck("check-content-structure.ts"));

cli
  .command("file-structure", "validate directory and file names")
  .action(runCheck("check-file-structure.ts"));

cli
  .command("long-files", "find files over 250 lines")
  .action(runCheck("check-long-files-250.ts"));

cli
  .command("missing-skills", "find broken skill references")
  .action(runCheck("check-missing-skills-references.ts"));

cli
  .command("all", "run all checks")
  .action(async () => {
    const checks = [
      "check-frontmatter.ts",
      "check-content-structure.ts",
      "check-file-structure.ts",
      "check-long-files-250.ts",
      "check-missing-skills-references.ts",
    ];
    let failed = false;
    for (const file of checks) {
      console.log(picocolors.blue(`\n--- running ${file} ---`));
      const proc = Bun.spawn(["bun", "run", `./${file}`], {
        cwd: import.meta.dir,
        stdout: "inherit",
        stderr: "inherit",
        stdin: "inherit",
      });
      await proc.exited;
      if (proc.exitCode !== 0) failed = true;
    }
    if (failed) {
      console.log(picocolors.red("\nSome checks failed."));
      process.exit(1);
    }
    console.log(picocolors.green("\nAll checks passed."));
  });

cli.help();
cli.version("0.0.1");
cli.parse();
