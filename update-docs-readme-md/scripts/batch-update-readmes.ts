#!/usr/bin/env bun
/**
 * batch-update-readmes.ts
 * Baseline README generator for the remaining D: projects.
 * Run: bun ./batch-update-readmes.ts
 */

import { statSync } from "node:fs";
import { join } from "node:path";

const DRAW_ANSI = "C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills\\draw-ansi\\scripts\\draw-ansi.ts";

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

async function readJson(path: string): Promise<any> {
  try {
    return await Bun.file(path).json();
  } catch {
    return null;
  }
}

function isDir(path: string): boolean {
  try { return statSync(path).isDirectory(); } catch { return false; }
}

async function hasFile(path: string, name: string): Promise<boolean> {
  return Bun.file(join(path, name)).exists();
}

function execDraw(title: string, content: string, totalWidth = 60): string {
  const result = Bun.spawnSync({
    cmd: ["bun", DRAW_ANSI, "--width", String(totalWidth), "--title", title],
    stdin: Buffer.from(content),
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode === 0) return result.stdout.toString().trim();
  // Fallback simple box
  const inner = totalWidth - 4;
  const top = "┌" + "─".repeat(inner) + "┐";
  const bottom = "└" + "─".repeat(inner) + "┘";
  const lines = (title ? [` ${title}`, ""] : []).concat(content.split("\n"));
  const body = lines.map((l) => "│ " + l.padEnd(inner) + " │");
  return [top, ...body, bottom].join("\n");
}

function detectTechStack(pkg: any): { name: string; color: string }[] {
  const badges: { name: string; color: string }[] = [];
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  if (deps.typescript) badges.push({ name: "TypeScript", color: "1976d2" });
  if (deps.bun || deps["@types/bun"]) badges.push({ name: "Bun", color: "f57c00" });
  if (deps.react) badges.push({ name: "React", color: "0097a7" });
  if (deps["solid-js"]) badges.push({ name: "SolidJS", color: "388e3c" });
  if (deps.nuxt) badges.push({ name: "Nuxt", color: "388e3c" });
  if (deps.next) badges.push({ name: "Next.js", color: "303f9f" });
  if (deps.tailwindcss) badges.push({ name: "Tailwind", color: "0097a7" });
  if (deps.elysia) badges.push({ name: "Elysia", color: "00796b" });
  if (deps.hono) badges.push({ name: "Hono", color: "ffa000" });
  if (deps["@tauri-apps/cli"]) badges.push({ name: "Tauri", color: "c2185b" });
  if (deps.electron) badges.push({ name: "Electron", color: "1976d2" });
  if (deps.vite) badges.push({ name: "Vite", color: "7b1fa2" });
  if (deps.turbo) badges.push({ name: "Turborepo", color: "00796b" });
  if (deps.moon) badges.push({ name: "moonrepo", color: "d32f2f" });
  if (deps.rust) badges.push({ name: "Rust", color: "f57c00" });
  return badges.slice(0, 5);
}

function badgeUrl(label: string, color: string) {
  const msg = label.replace(/ /g, "_");
  return `https://img.shields.io/badge/${msg}-${color}`;
}

async function getStatus(path: string): Promise<string> {
  return (await hasFile(path, "CHANGELOG.md")) ? "active" : "in development";
}

function getProjectName(path: string, pkg: any): string {
  if (pkg?.name) return pkg.name.split("/").pop() || pkg.name;
  const parts = path.split("\\");
  return parts[parts.length - 1];
}

function getDescription(path: string, pkg: any): string {
  if (pkg?.description) return pkg.description;
  return `${getProjectName(path, pkg)} project.`;
}

function getScriptCommands(pkg: any): Record<string, string> {
  return pkg?.scripts || {};
}

function getFeaturesFromScripts(pkg: any, projectName: string): string[] {
  const scripts = getScriptCommands(pkg);
  const map: Record<string, string> = {
    dev: "Run in development",
    build: "Build for production",
    test: "Run tests",
    lint: "Lint source",
    format: "Format source",
    typecheck: "Type-check source",
    preview: "Preview production build",
    deploy: "Deploy the project",
    start: "Start the server",
    prepare: "Prepare the workspace",
    verify: "Verify the project",
    check: "Run project checks",
    "build:web": "Build the web app",
    "dev:web": "Develop the web app",
    "dev:mobile": "Develop the mobile app",
    "build:mobile": "Build the mobile app",
  };
  const features: string[] = [];
  for (const [k, v] of Object.entries(scripts)) {
    const desc = map[k] || v || k;
    features.push(`${k}|${desc}`);
  }
  if (features.length === 0) features.push(`main|Main ${projectName} entry`);
  return features.slice(0, 10);
}

function iconForScript(name: string): { set: string; icon: string; color: string } {
  if (name.includes("dev")) return { set: "lucide", icon: "play", color: "388e3c" };
  if (name.includes("build")) return { set: "lucide", icon: "hammer", color: "f57c00" };
  if (name.includes("test")) return { set: "lucide", icon: "check-circle", color: "1976d2" };
  if (name.includes("lint")) return { set: "lucide", icon: "shield", color: "d32f2f" };
  if (name.includes("format")) return { set: "lucide", icon: "align-left", color: "7b1fa2" };
  if (name.includes("deploy")) return { set: "lucide", icon: "rocket", color: "0097a7" };
  if (name.includes("preview")) return { set: "lucide", icon: "eye", color: "303f9f" };
  if (name.includes("mobile")) return { set: "mdi", icon: "cellphone", color: "c2185b" };
  if (name.includes("web")) return { set: "mdi", icon: "web", color: "00796b" };
  return { set: "lucide", icon: "zap", color: "ffa000" };
}

function iconUrl(set: string, icon: string, color: string): string {
  return `https://api.iconify.design/${set}:${icon}.svg?color=%23${color}&width=16`;
}

function buildFeaturesTable(pkg: any, projectName: string): string {
  const featureRows = getFeaturesFromScripts(pkg, projectName);
  const rows = featureRows.map((row) => {
    const [name, desc] = row.split("|");
    const ico = iconForScript(name);
    const benefit = desc.replace(/^(Run|Build|Test|Lint|Format|Deploy|Preview)/, "Automates").replace(/^(Develop)/, "Streamlines");
    const usage = `bun run ${name}`;
    return `| ![icon](${iconUrl(ico.set, ico.icon, ico.color)}) | ${capitalize(name)} | ${desc} | ${benefit} | \`${usage}\` |`;
  });
  return [
    "## Features",
    "",
    "| Icon | Feature | Description | Benefit | Usage |",
    "|:---:|:--------|:------------|:--------|:------|",
    ...rows,
    "",
  ].join("\n");
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildUsage(path: string, pkg: any, projectName: string): string {
  const scripts = getScriptCommands(pkg);
  const usage: string[] = ["## Usage", ""];

  // CLI usage if there is a bin or script named cli/help
  const bin = pkg?.bin || (scripts["cli"] ? true : null);
  if (bin) {
    const cliName = typeof bin === "string" ? bin : `bun run cli`;
    const help = execDraw(`${projectName} — Help`, `  $ ${cliName} --help\n\n  USAGE\n    ${cliName} <command> [options]\n\n  COMMANDS\n    run     Run the project\n    build   Build the project\n    help    Show this help\n\n  OPTIONS\n    --help  Show this help message`, 60);
    usage.push("### Usage via CLI", "", "```bash", `${cliName} --help`, "```", "", "```text", help, "```", "", "");
  }

  // Web usage if dev/build web exists or web-ish deps
  const hasWeb = scripts["dev:web"] || scripts["build:web"] || scripts["dev"] || scripts["build"] || pkg?.dependencies?.["@solidjs/start"] || pkg?.dependencies?.next || pkg?.dependencies?.nuxt;
  if (hasWeb) {
    const webBox = execDraw("Web app click flow & layout", `  ${projectName} — Web App\n\n  [Home] [Features] [Pricing]\n\n  ┌────────────────────────────┐\n  │  Start exploring content   │\n  └────────────────────────────┘`, 60);
    usage.push(
      "### Usage via Web",
      "",
      "<details>",
      "<summary>Web app click flow & layout</summary>",
      "",
      "1. Install dependencies and run `bun run dev`",
      "2. Open the local URL shown in the terminal",
      "3. Use the top navigation to switch pages",
      "",
      "```text",
      webBox,
      "```",
      "",
      "</details>",
      "",
    );
  }

  // TUI if tui script
  if (scripts["tui"] || scripts["dev:tui"]) {
    const tuiBox = execDraw("TUI keyboard shortcuts & layout", `  ${projectName} — TUI\n\n  > Run task            [Enter]\n    View history        [↑/↓]\n    Settings            [q]  quit`, 60);
    usage.push(
      "### Usage via TUI",
      "",
      "<details>",
      "<summary>TUI keyboard shortcuts & layout</summary>",
      "",
      "1. Open a terminal and run `bunx ${projectName} tui`",
      "2. Use `↑`/`↓` to select an action, `Enter` to confirm, `q` to quit",
      "",
      "```text",
      tuiBox,
      "```",
      "",
      "</details>",
      "",
    );
  }

  if (usage.length === 2) {
    usage.push("See the `package.json` scripts for available commands.", "");
  }

  return usage.join("\n");
}

function buildGetStarted(pkg: any): string {
  const scripts = getScriptCommands(pkg);
  const steps: string[] = [];
  steps.push("1. Install dependencies");
  steps.push("   ```bash");
  steps.push("   bun install");
  steps.push("   ```");

  if (scripts["prepare"]) {
    steps.push("2. Prepare the workspace");
    steps.push("   ```bash");
    steps.push("   bun run prepare");
    steps.push("   ```");
  }

  if (scripts.dev || scripts["dev:web"]) {
    steps.push(`${steps.length / 4 + 1}. Start the development server`);
    steps.push("   ```bash");
    steps.push(`   bun run ${scripts["dev:web"] ? "dev:web" : "dev"}`);
    steps.push("   ```");
  }

  if (scripts.build || scripts["build:web"]) {
    steps.push(`${steps.length / 4 + 1}. Build for production`);
    steps.push("   ```bash");
    steps.push(`   bun run ${scripts["build:web"] ? "build:web" : "build"}`);
    steps.push("   ```");
  }

  if (scripts.test || scripts.verify) {
    steps.push(`${steps.length / 4 + 1}. Validate changes`);
    steps.push("   ```bash");
    steps.push(`   bun run ${scripts.verify ? "verify" : "test"}`);
    steps.push("   ```");
  }

  return ["## Get Started", "", ...steps, ""].join("\n");
}

async function buildHero(path: string, pkg: any): Promise<string> {
  const status = await getStatus(path);
  const statusColor = status === "active" ? "brightgreen" : "red";
  const projectName = getProjectName(path, pkg);
  const description = getDescription(path, pkg);
  const badges = detectTechStack(pkg)
    .map((b) => `![${b.name}](${badgeUrl(b.name, b.color)})`)
    .join(" ");
  return [
    `> ![Status](https://img.shields.io/badge/status-${status.replace(/ /g, "_")}-${statusColor})`,
    "",
    `# ${projectName}`,
    "",
    description,
    "",
    badges,
    "",
  ].join("\n");
}

function buildUISketch(projectName: string): string {
  const box = execDraw(`${projectName} — UI`, `  ${projectName} main window\n\n  ┌────────────────────┐  ┌────────────┐\n  │ Sidebar            │  │  Content   │\n  │                    │  │            │\n  └────────────────────┘  └────────────┘`, 60);
  return [
    "```text",
    box,
    "```",
    "",
  ].join("\n");
}

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
