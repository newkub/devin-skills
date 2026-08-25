#!/usr/bin/env bun
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  PLATFORM_OPTIONS,
  INTEGRATION_OPTIONS,
  PROJECT_LEVEL_OPTIONS,
  generateSummary,
} from "@ask-requirement/shared";
import type { RequirementForm, PlatformValue, IntegrationValue, ProjectLevelValue, CustomDataField } from "@ask-requirement/shared";

const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function header(title: string, icon: string) {
  console.log(`\n${BOLD}${CYAN}${icon}  ${title}${RESET}`);
}

function printOptions<T extends { value: string; label: string; icon: string; description: string; }>(
  options: T[],
  selected: string[],
): void {
  options.forEach((opt, i) => {
    const isSel = selected.includes(opt.value);
    const mark = isSel ? `${GREEN}✓${RESET}` : " ";
    console.log(`  ${mark} [${i + 1}] ${opt.label} ${DIM}- ${opt.description}${RESET}`);
  });
}

async function prompt(question: string): Promise<string> {
  process.stdout.write(`${BOLD}${question}${RESET} `);
  const line = await new Promise<string>((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      resolve(data.toString().trim());
    });
  });
  return line;
}

async function promptMultiSelect(
  title: string,
  icon: string,
  options: { value: string; label: string; icon: string; description: string; }[],
): Promise<string[]> {
  header(title, icon);
  const selected: string[] = [];

  while (true) {
    printOptions(options, selected);
    console.log(`\n  ${DIM}Enter number to toggle, 'a' for all, 'n' for none, Enter to confirm${RESET}`);
    const input = await prompt(">");

    if (input === "") break;
    if (input === "a") {
      selected.length = 0;
      selected.push(...options.map((o) => o.value));
      continue;
    }
    if (input === "n") {
      selected.length = 0;
      continue;
    }

    const idx = Number.parseInt(input, 10) - 1;
    if (idx >= 0 && idx < options.length) {
      const val = options[idx].value;
      const i = selected.indexOf(val);
      if (i > -1) selected.splice(i, 1);
      else selected.push(val);
    }
  }

  return selected;
}

async function promptList(title: string, icon: string, placeholder: string): Promise<string[]> {
  header(title, icon);
  const items: string[] = [];

  while (true) {
    const input = await prompt(`Enter ${placeholder} (Enter to finish):`);
    if (!input) break;
    items.push(input);
  }

  return items;
}

async function promptProjectLevel(): Promise<ProjectLevelValue | ""> {
  header("6. Project Level", "mdi-stairs-up");
  PROJECT_LEVEL_OPTIONS.forEach((opt: typeof PROJECT_LEVEL_OPTIONS[number], i: number) => {
    console.log(`  [${i + 1}] ${opt.label} ${DIM}- ${opt.description}${RESET}`);
    console.log(`      ${DIM}Features: ${opt.features.join(", ")}${RESET}`);
  });

  const input = await prompt("\nSelect level (1-3):");
  const idx = Number.parseInt(input, 10) - 1;
  if (idx >= 0 && idx < PROJECT_LEVEL_OPTIONS.length) {
    return PROJECT_LEVEL_OPTIONS[idx].value;
  }
  return "";
}

async function promptCustomData(): Promise<CustomDataField[]> {
  header("7. Custom Data", "mdi-database-plus");
  console.log(`  ${DIM}Add custom key-value pairs for AI consumption${RESET}`);

  const fields: CustomDataField[] = [];

  while (true) {
    const key = await prompt("Key (Enter to finish):");
    if (!key) break;
    const value = await prompt("Value:");
    const icon = await prompt("Icon (mdi-*, default: mdi-tag):");
    fields.push({ key, value, icon: icon || "mdi-tag" });
  }

  return fields;
}

async function callMcpServer(form: RequirementForm): Promise<string> {
  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "src/index.ts"],
    cwd: import.meta.dir.replace("/src", "").replace("\\src", ""),
  });

  const client = new Client(
    { name: "ask-requirement-cli", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  await client.connect(transport);

  try {
    const result = await client.callTool({
      name: "generate-requirement",
      arguments: {
        platforms: form.platforms,
        integrations: form.integrations,
        features: form.features,
        targetUser: form.targetUser,
        expectedUsers: form.expectedUsers,
        competitors: form.competitors,
        projectLevel: form.projectLevel,
        customData: form.customData,
      },
    });

    const text = (result.content as Array<{ type: string; text: string; }>)
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");

    return text;
  } finally {
    await client.close();
  }
}

async function main() {
  console.log(`${BOLD}${GREEN}
  ╔═══════════════════════════════════════╗
  ║       Ask Requirement CLI             ║
  ║       Project Requirement Tool        ║
  ╚═══════════════════════════════════════╝
  ${RESET}`);

  const platforms = await promptMultiSelect("1. Platform", "mdi-devices", PLATFORM_OPTIONS);
  const integrations = await promptMultiSelect("2. Integrations", "mdi-link-variant", INTEGRATION_OPTIONS);
  const features = await promptList("3. Features", "mdi-format-list-bulleted", "feature name");
  const targetUser = await prompt("4. Target User:");
  const expectedUsers = await prompt("Expected Users:");
  const competitors = await promptList("5. Competitors", "mdi-sword-cross", "competitor name");
  const projectLevel = await promptProjectLevel();
  const customData = await promptCustomData();

  const form: RequirementForm = {
    platforms: platforms as PlatformValue[],
    integrations: integrations as IntegrationValue[],
    features,
    targetUser,
    expectedUsers,
    competitors,
    projectLevel,
    customData,
  };

  console.log(`\n${BOLD}${CYAN}Generating summary via MCP server...${RESET}`);

  const mcpResult = await callMcpServer(form);

  console.log(`\n${BOLD}${GREEN}═══ MCP Server Result ═══${RESET}`);
  console.log(mcpResult);

  const summary = generateSummary(form);
  console.log(`\n${BOLD}${YELLOW}═══ Local Summary (JSON) ═══${RESET}`);
  console.log(summary.json);

  const outputFile = await prompt("\nSave to file (path, Enter to skip):");
  if (outputFile) {
    await Bun.write(outputFile, summary.markdown);
    console.log(`${GREEN}Saved to ${outputFile}${RESET}`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
