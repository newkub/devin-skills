export const THRESHOLD = 250;

export const KNOWN_TOP_KEYS = new Set([
  "name",
  "description",
  "argument-hint",
  "model",
  "subagent",
  "agent",
  "title",
  "auto_execution_mode",
  "allowed-tools",
  "permissions",
  "triggers",
  "related",
]);

export const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".turbo",
  ".solid",
  "dist",
  "build",
  ".output",
  "coverage",
  ".wrangler",
]);

export const ALLOWED_NON_KEBAB_NAMES = new Set([
  "SKILL.md",
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "CONTRIBUTING.md",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "bun.lockb",
  "tsconfig.json",
  "Cargo.toml",
  "go.mod",
]);

export const PACKAGE_DIRS = new Set(["references", "scripts", "guide", "examples"]);

export const IGNORE_REFS = new Set([
  "workflow-name",
  "skill-name",
  "xxx",
  "old-name",
  "new-name",
  "edit",
  "dist",
  "target",
  "assets",
  "fetch",
  "node",
  "bun",
  "localhost",
  "cli",
  "docs",
  "help",
  "api",
  "src",
  "config",
  "health",
  "ready",
  "live",
]);

export const VALID_TRIGGERS = new Set(["user", "model"]);
