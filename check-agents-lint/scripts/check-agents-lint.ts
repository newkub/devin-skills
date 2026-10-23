#!/usr/bin/env bun
import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RULES, selectRules } from "./lib/catalog.ts";
import { DEFAULT_ENGINES, ENGINE_ORDER, HELP, fail, parseArgs, parseEngines } from "./lib/cli-args.ts";
import { runAstGrep, runBiome, runOwn, type EngineRun } from "./lib/engines.ts";
import { runGitleaks } from "./lib/engines-gitleaks.ts";
import { runLychee } from "./lib/engines-lychee.ts";
import { runShellcheck } from "./lib/engines-shellcheck.ts";
import { run } from "./lib/exec.ts";
import {
  TOOL_NAME,
  VERSION,
  exitFor,
  formatText,
  loadBaseline,
  prepare,
  summarize,
  toJson,
  toSarif,
} from "./lib/output.ts";
import { collect, loadWorkflows } from "./lib/parse.ts";
import type { EngineName, RuleMeta } from "./lib/types.ts";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function changedSkills(root: string): Set<string> | null {
  const diff = run("git", ["-C", root, "diff", "--name-only", "--diff-filter=ACMR", "HEAD"]);
  const untracked = run("git", ["-C", root, "ls-files", "--others", "--exclude-standard"]);
  if (diff.missing || untracked.missing || !diff.ok || !untracked.ok) return null;
  const names = new Set<string>();
  for (const output of [diff.stdout, untracked.stdout]) {
    for (const raw of output.split(/\r?\n/)) {
      const path = raw.trim().replace(/\\/g, "/");
      const first = path.split("/")[0];
      if (first) names.add(first);
    }
  }
  return names;
}

function runEngines(ctx: Parameters<typeof runOwn>[0], engines: Set<EngineName>, rules: RuleMeta[]): EngineRun[] {
  const out: EngineRun[] = [];
  for (const name of ENGINE_ORDER) {
    if (!engines.has(name)) continue;
    if (name === "own") out.push(runOwn(ctx, rules));
    else if (name === "biome") out.push(runBiome(ctx, rules));
    else if (name === "ast-grep") out.push(runAstGrep(ctx, rules));
    else if (name === "shellcheck") out.push(runShellcheck(ctx, rules));
    else if (name === "gitleaks") out.push(runGitleaks(ctx, rules));
    else if (name === "lychee") out.push(runLychee(ctx, rules));
  }
  return out;
}

function printRules(rules: RuleMeta[], json: boolean): void {
  if (json) {
    process.stdout.write(`${JSON.stringify({ version: VERSION, rules }, null, 2)}\n`);
    return;
  }
  const lines = ["severity  rule                              engine      proves", "-".repeat(88)];
  for (const rule of rules)
    lines.push(`${rule.severity.padEnd(8)}  ${rule.id.padEnd(32)}  ${rule.engine.padEnd(10)}  ${rule.proves}`);
  process.stdout.write(`${lines.join("\n")}\n`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (args.version) {
    process.stdout.write(`${TOOL_NAME} ${VERSION}\n`);
    return;
  }
  if (args.json && args.sarif) fail("--json and --sarif are mutually exclusive");
  if (args.positional.length > 1) fail(`unexpected argument "${args.positional[1]}"`);
  const root = resolve(args.positional[0] ?? DEFAULT_ROOT);
  if (!existsSync(root) || !statSync(root).isDirectory()) fail(`not a directory: ${root}`);

  let rules: RuleMeta[];
  try {
    rules = selectRules(args.ruleFilter);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  if (args.listRules) {
    printRules(rules, args.json);
    return;
  }

  const ctx = collect(root, null);
  const unknown = args.skillFilter.filter((name) => !ctx.skillNames.has(name));
  if (unknown.length)
    fail(`unknown skill(s): ${unknown.slice(0, 10).join(", ")}${unknown.length > 10 ? " …" : ""}`);

  let only: Set<string> | null = args.skillFilter.length ? new Set(args.skillFilter) : null;
  if (args.changed) {
    const touched = changedSkills(root);
    if (!touched) process.stderr.write(`${TOOL_NAME}: --changed needs a git repository; scanning all skills\n`);
    else {
      const allowed = only ?? new Set(ctx.skillNames);
      only = new Set([...allowed].filter((name) => touched.has(name)));
    }
  }
  if (only) {
    ctx.skills = ctx.skills.filter((skill) => only!.has(skill.dir));
    ctx.workflows = loadWorkflows(ctx.skills);
  }

  const engines = args.engineFilter.length ? parseEngines(args.engineFilter) : new Set(DEFAULT_ENGINES);
  const results = runEngines(ctx, engines, rules);
  const all = results.flatMap((result) => result.findings);

  let baseline: Set<string> | undefined;
  if (args.baselineFile) {
    try {
      baseline = loadBaseline(resolve(args.baselineFile));
    } catch (error) {
      fail(`cannot read baseline: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const prepared = prepare(all, baseline);
  const report = {
    version: VERSION,
    root,
    generatedAt: new Date().toISOString(),
    changed: args.changed,
    summary: summarize(prepared.findings, ctx.skills.length, prepared.baselined),
    engines: results.map((result) => result.status),
    findings: prepared.findings,
  };
  if (args.sarif) process.stdout.write(toSarif(report));
  else if (args.json) process.stdout.write(toJson(report));
  else process.stdout.write(formatText(report, { findingsOnly: args.findingsOnly }));

  const missing = args.engineFilter.length
    ? results.filter((result) => result.status.status === "missing")
    : [];
  if (missing.length) {
    for (const result of missing)
      process.stderr.write(`${TOOL_NAME}: engine "${result.status.name}" is required but ${result.status.note}\n`);
    process.exit(2);
  }
  const crashed = results.find((result) => result.error);
  if (crashed) {
    process.stderr.write(`${TOOL_NAME}: engine "${crashed.status.name}" failed: ${crashed.error}\n`);
    process.exit(2);
  }
  process.exit(exitFor(prepared.findings, args.failOn));
}

main();
