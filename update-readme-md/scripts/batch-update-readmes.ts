#!/usr/bin/env bun
/**
 * batch-update-readmes.ts
 * Baseline README generator for the remaining D: projects.
 * Run: bun ./batch-update-readmes.ts
 */

import { join } from "node:path";
import { hasFile, isDir, readJson, getProjectName } from "./readme-data";
import { buildFeaturesTable, buildGetStarted, buildHero, buildUISketch, buildUsage } from "./readme-sections";

const REMAINING = [
  "D:\\newkub\\newkub\\slides",
  "D:\\newkub\\wpackages",
  "D:\\newkub\\wpackages\\rust-packages",
  "D:\\newkub\\wpackages\\vscode-extensions",
  "D:\\newkub\\products\\explore-opensource",
  "D:\\newkub\\solid-ui",
  "D:\\saas\\wrikka-platform",
  "D:\\saas\\wrikka-platform\\apps\\mobile",
  "D:\\saas\\booking-platform",
];

async function buildReadme(path: string): Promise<string> {
  const pkg = await readJson(join(path, "package.json"));
  const projectName = getProjectName(path, pkg);

  const sections: string[] = [];
  sections.push(await buildHero(path, pkg));
  sections.push(buildUISketch(projectName));
  sections.push(buildGetStarted(pkg));
  sections.push(buildFeaturesTable(pkg, projectName));
  sections.push(buildUsage(path, pkg, projectName));

  if (await hasFile(path, "CONTRIBUTING.md")) {
    sections.push("## Contributing", "", "See [CONTRIBUTING.md](CONTRIBUTING.md).", "");
  }
  if (await hasFile(path, "LICENSE.md")) {
    const license = pkg?.license || "License";
    sections.push("## License", "", `${license} — see [LICENSE](LICENSE.md).`, "");
  }

  return sections.join("\n");
}

async function main() {
  for (const path of REMAINING) {
    if (!isDir(path)) {
      console.error(`Skip: not a directory ${path}`);
      continue;
    }
    if (!(await hasFile(path, "README.md"))) {
      console.error(`Skip: no README.md in ${path}`);
      continue;
    }
    console.log(`Updating ${path}...`);
    try {
      const content = await buildReadme(path);
      await Bun.write(join(path, "README.md"), content);
      console.log(`  OK`);
    } catch (e: any) {
      console.error(`  FAIL: ${e.message}`);
    }
  }
}

await main();
