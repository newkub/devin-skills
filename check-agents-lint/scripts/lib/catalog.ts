import type { EngineName, Finding, Namespace, RuleMeta, Severity } from "./types.ts";

export const NAMESPACES: Namespace[] = ["struct", "meta", "graph", "content", "sec", "code"];

const FIX = {
  update: "/update-agents-skills-global",
  refs: "/update-references",
  secrets: "/check-secrets",
  review: "/deep-review",
  lint: "/run-lint",
  format: "/run-format",
  scripts: "/use-scripts",
  date: "/follow-up-to-date",
  mcp: "/update-devin-global-mcp",
} as const;

function rule(id: string, engine: EngineName, severity: Severity, proves: string, fix: string): RuleMeta {
  return { id, engine, severity, proves, fix };
}

export const RULES: RuleMeta[] = [
  rule("struct/skill-md-exists", "own", "critical", "every skill package has SKILL.md", FIX.update),
  rule("struct/frontmatter-parse", "own", "critical", "frontmatter block parses", FIX.update),
  rule("struct/frontmatter-required", "own", "critical", "name and description are present", FIX.update),
  rule("struct/name-matches-dir", "own", "critical", "frontmatter name equals directory", FIX.update),
  rule("struct/name-format", "own", "critical", "name is lowercase kebab-case", FIX.update),
  rule("struct/description-length", "own", "warning", "description is at most 100 characters", FIX.update),
  rule("struct/frontmatter-unknown-key", "own", "warning", "frontmatter keys are known", FIX.update),
  rule("struct/frontmatter-argument-hint", "own", "info", "argument-hint is declared", FIX.update),
  rule("struct/frontmatter-related", "own", "warning", "related list is declared", FIX.refs),
  rule("struct/table-cells", "own", "critical", "markdown table rows match the header", FIX.update),
  rule("struct/section-required", "own", "critical", "required H2 sections exist", FIX.update),
  rule("struct/section-order", "own", "warning", "required H2 sections keep canonical order", FIX.update),
  rule("struct/heading-unique", "own", "warning", "heading text is unique per level", FIX.update),
  rule("struct/line-limit", "own", "warning", "SKILL.md is at most 250 lines", FIX.update),
  rule("struct/file-line-limit", "own", "warning", "package files are at most 250 lines", FIX.update),
  rule("struct/execute-steps", "own", "warning", "Execute has at most 10 steps", FIX.update),
  rule("struct/execute-step-goal", "own", "warning", "each Execute step states > Goal:", FIX.update),
  rule("struct/bold-outside-code", "own", "warning", "prose uses no ** bold", FIX.update),
  rule("struct/fence-language", "own", "info", "code fences declare a language", FIX.update),
  rule("struct/heading-title-case", "own", "info", "H2/H3 headings are Title Case", FIX.update),
  rule("meta/related-exists", "own", "critical", "related targets are skill packages", FIX.refs),
  rule("meta/related-self", "own", "warning", "related does not list the skill itself", FIX.refs),
  rule("meta/related-duplicate", "own", "warning", "related has no duplicate targets", FIX.refs),
  rule("meta/related-max", "own", "warning", "related has at most 15 targets", FIX.refs),
  rule("meta/related-mentioned", "own", "warning", "each related target is mentioned in the body", FIX.refs),
  rule("meta/check-allowed-tools", "own", "warning", "check-* declares read-only tools", FIX.update),
  rule("meta/workflow-skill-valid", "own", "critical", "every workflow directory has SKILL.md", FIX.update),
  rule("meta/workflow-name-format", "own", "warning", "workflow name is <parent>-<dir>", FIX.update),
  rule("graph/reference-file-exists", "own", "critical", "referenced package files exist", FIX.refs),
  rule("graph/relative-link-valid", "own", "critical", "relative markdown links resolve", FIX.refs),
  rule("graph/slash-ref-resolves", "own", "warning", "slash references resolve to a skill", FIX.refs),
  rule("graph/orphan-reference", "own", "warning", "reference files are linked from SKILL.md", FIX.refs),
  rule("graph/external-link-dead", "lychee", "info", "external links are reachable", FIX.refs),
  rule("content/no-placeholder", "own", "warning", "no TODO/FIXME/TBD markers remain", FIX.review),
  rule("content/empty-section", "own", "warning", "no heading is followed by empty content", FIX.update),
  rule("content/hardcoded-user-path", "own", "warning", "no machine-specific home paths", FIX.secrets),
  rule("content/stale-version-pin", "own", "info", "tool versions are not pinned to full x.y.z", FIX.date),
  rule("content/workflow-dispatch", "own", "warning", "packages with workflows expose a dispatch", FIX.update),
  rule("content/script-shebang", "own", "info", "top-level scripts start with a shebang", FIX.scripts),
  rule("sec/obvious-credential", "own", "critical", "no credential-shaped literals", FIX.secrets),
  rule("sec/curl-pipe-bash", "own", "warning", "no curl pipe to a shell", FIX.review),
  rule("sec/dangerous-rm", "own", "warning", "no destructive rm on root or home", FIX.review),
  rule("sec/mcp-config-valid", "own", "critical", "packaged mcp config is valid JSON", FIX.mcp),
  rule("sec/no-secret", "gitleaks", "critical", "gitleaks finds no secrets", FIX.secrets),
  rule("sec/dynamic-exec", "ast-grep", "warning", "no eval or new Function", FIX.review),
  rule("code/biome-lint", "biome", "critical", "biome reports no lint diagnostics", FIX.lint),
  rule("code/biome-format", "biome", "warning", "biome reports no format diagnostics", FIX.format),
  rule("code/sh-syntax", "shellcheck", "critical", "shellcheck reports no errors", FIX.lint),
  rule("code/sh-lint", "shellcheck", "warning", "shellcheck reports no warnings", FIX.lint),
];

export const byId = new Map(RULES.map((r) => [r.id, r]));

export function finding(id: string, file: string, line: number, message: string, severity?: Severity): Finding {
  const meta = byId.get(id);
  if (!meta) throw new Error(`unknown rule id: ${id}`);
  return {
    rule: id,
    severity: severity ?? meta.severity,
    file,
    line: Math.max(1, Math.floor(Number.isFinite(line) ? line : 1)),
    message,
    fix: meta.fix,
  };
}

export function rulesFor(engine: EngineName): RuleMeta[] {
  return RULES.filter((r) => r.engine === engine);
}

export function selectRules(patterns: string[]): RuleMeta[] {
  if (patterns.length === 0) return RULES;
  const picked = new Set<string>();
  for (const raw of patterns) {
    const p = raw.trim();
    if (!p) continue;
    if (p === "*" || p.toLowerCase() === "all") {
      for (const r of RULES) picked.add(r.id);
      continue;
    }
    if ((NAMESPACES as string[]).includes(p)) {
      for (const r of RULES) if (r.id.startsWith(`${p}/`)) picked.add(r.id);
      continue;
    }
    if (p.endsWith("/*")) {
      const ns = p.slice(0, -2);
      const hit = RULES.filter((r) => r.id.startsWith(`${ns}/`));
      if (!hit.length) throw new Error(`unknown namespace "${ns}"`);
      for (const r of hit) picked.add(r.id);
      continue;
    }
    const exact = byId.get(p);
    if (exact) {
      picked.add(exact.id);
      continue;
    }
    const needle = p.replace(/^\*/, "").toLowerCase();
    const near = RULES.filter((r) => r.id.includes(needle)).slice(0, 3).map((r) => r.id);
    throw new Error(`unknown rule "${p}"${near.length ? ` — did you mean: ${near.join(", ")}` : ""}`);
  }
  if (!picked.size) throw new Error("no rules selected");
  return RULES.filter((r) => picked.has(r.id));
}
