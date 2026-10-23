import { TOOL_NAME, VERSION } from "./output.ts";
import type { EngineName, Severity } from "./types.ts";

export const ENGINE_ORDER: EngineName[] = ["own", "biome", "ast-grep", "shellcheck", "gitleaks", "lychee"];
export const DEFAULT_ENGINES: EngineName[] = ["own", "biome", "ast-grep", "shellcheck"];

export const HELP = `agents-lint ${VERSION} — read-only linter for skill packages

Usage:
  bun check-agents-lint.ts [root] [options]

Options:
  --skill <name[,name]>  limit to skill directories (repeatable)
  --rules <list>         rule IDs, namespaces, or namespace/* (default: all)
  --engine <list>        ${ENGINE_ORDER.join(",")}
                         default: ${DEFAULT_ENGINES.join(",")}
  --changed              only skills touched in git (HEAD diff + untracked)
  --json                 JSON report on stdout
  --sarif                SARIF 2.1.0 report on stdout
  --findings             print finding lines only
  --fail-on <level>      critical|warning|info|none (default: warning)
  --baseline <file>      suppress findings from a previous JSON report
  --list-rules           print the rule catalog
  --version              print the version
  --help                 print this help

Exit codes:
  0  no findings at or above --fail-on
  1  findings at or above --fail-on
  2  invalid usage, unreadable input, or a missing explicitly requested engine

The tool only reads the scanned tree; it never rewrites files.`;

export function fail(message: string): never {
  process.stderr.write(`${TOOL_NAME}: ${message}\n`);
  process.exit(2);
}

export interface CliArgs {
  positional: string[];
  skillFilter: string[];
  ruleFilter: string[];
  engineFilter: string[];
  failOn: Severity | "none";
  baselineFile: string | null;
  changed: boolean;
  json: boolean;
  sarif: boolean;
  findingsOnly: boolean;
  listRules: boolean;
  help: boolean;
  version: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    positional: [],
    skillFilter: [],
    ruleFilter: [],
    engineFilter: [],
    failOn: "warning",
    baselineFile: null,
    changed: false,
    json: false,
    sarif: false,
    findingsOnly: false,
    listRules: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    let inline: string | null = null;
    const eq = arg.startsWith("--") ? arg.indexOf("=") : -1;
    if (eq > 0) {
      inline = arg.slice(eq + 1);
      arg = arg.slice(0, eq);
    }
    const value = (): string => {
      if (inline !== null) return inline;
      const next = argv[++i];
      if (next === undefined) fail(`${arg} needs a value`);
      return next;
    };
    const boolean = (): void => {
      if (inline !== null) fail(`${arg} does not take a value`);
    };
    switch (arg) {
      case "--help":
      case "-h":
        boolean();
        args.help = true;
        break;
      case "--version":
      case "-v":
        boolean();
        args.version = true;
        break;
      case "--skill":
        args.skillFilter.push(...value().split(",").map((v) => v.trim()).filter(Boolean));
        break;
      case "--rules":
        args.ruleFilter.push(...value().split(",").map((v) => v.trim()).filter(Boolean));
        break;
      case "--engine":
        args.engineFilter.push(...value().split(",").map((v) => v.trim()).filter(Boolean));
        break;
      case "--fail-on": {
        const level = value().trim().toLowerCase();
        if (!["critical", "warning", "info", "none"].includes(level)) fail(`unknown severity "${level}"`);
        args.failOn = level as Severity | "none";
        break;
      }
      case "--baseline":
        args.baselineFile = value();
        break;
      case "--changed":
        boolean();
        args.changed = true;
        break;
      case "--json":
        boolean();
        args.json = true;
        break;
      case "--sarif":
        boolean();
        args.sarif = true;
        break;
      case "--findings":
        boolean();
        args.findingsOnly = true;
        break;
      case "--list-rules":
        boolean();
        args.listRules = true;
        break;
      case "--":
        for (i++; i < argv.length; i++) args.positional.push(argv[i]);
        break;
      default:
        if (arg.startsWith("-")) fail(`unknown option "${arg}"`);
        args.positional.push(arg);
    }
  }
  return args;
}

export function parseEngines(values: string[]): Set<EngineName> {
  const parts = values
    .flatMap((value) => value.split(","))
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (!parts.length) fail("--engine needs at least one engine name");
  if (parts.includes("none")) {
    if (parts.length > 1) fail("--engine none cannot be combined with other engines");
    return new Set();
  }
  const picked = new Set<EngineName>();
  for (const part of parts) {
    if (!ENGINE_ORDER.includes(part as EngineName)) fail(`unknown engine "${part}"`);
    picked.add(part as EngineName);
  }
  return picked;
}
