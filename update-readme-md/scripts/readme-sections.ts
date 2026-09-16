/**
 * readme-sections.ts
 * README section builders — hero, UI sketch, get-started, features table, usage.
 */

import {
  badgeUrl, capitalize, detectTechStack, getDescription, getFeaturesFromScripts,
  getProjectName, getScriptCommands, getStatus, iconForScript, iconUrl,
} from "./readme-data";

const DRAW_ANSI = "C:\\Users\\Veerapong\\AppData\\Roaming\\devin\\skills\\draw-ansi\\scripts\\draw-ansi.ts";

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

export function buildFeaturesTable(pkg: any, projectName: string): string {
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

export function buildUsage(path: string, pkg: any, projectName: string): string {
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

export function buildGetStarted(pkg: any): string {
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

export async function buildHero(path: string, pkg: any): Promise<string> {
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

export function buildUISketch(projectName: string): string {
  const box = execDraw(`${projectName} — UI`, `  ${projectName} main window\n\n  ┌────────────────────┐  ┌────────────┐\n  │ Sidebar            │  │  Content   │\n  │                    │  │            │\n  └────────────────────┘  └────────────┘`, 60);
  return [
    "```text",
    box,
    "```",
    "",
  ].join("\n");
}
