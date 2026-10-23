export type Severity = "critical" | "warning" | "info";

export type Namespace = "struct" | "meta" | "graph" | "content" | "sec" | "code";

export type EngineName = "own" | "biome" | "ast-grep" | "shellcheck" | "gitleaks" | "lychee";

export interface Finding {
  rule: string;
  severity: Severity;
  file: string;
  line: number;
  message: string;
  fix: string;
}

export interface RuleMeta {
  id: string;
  engine: EngineName;
  severity: Severity;
  proves: string;
  fix: string;
}

export interface FmEntry {
  line: number;
  value: string;
  items: string[];
  itemLines: number[];
}

export type Frontmatter = Map<string, FmEntry>;

export interface SkillDoc {
  dir: string;
  parent?: string;
  dirPath: string;
  file: string;
  text: string;
  hasSkillMd: boolean;
  fm: Frontmatter;
  fmLines: number;
  fmError?: string;
  body: string;
}

export interface EngineStatus {
  name: EngineName;
  status: "ok" | "skipped" | "missing";
  note: string;
  findings: number;
}

export interface Ctx {
  root: string;
  skills: SkillDoc[];
  workflows: SkillDoc[];
  skillNames: Set<string>;
  slashNames: Set<string>;
  skillDirs: Map<string, SkillDoc>;
}

export const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
