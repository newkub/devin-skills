export type Kind = "extends" | "new" | "platform";
export type Phase = "mvp" | "v2" | "v3";
export type Impact = "high" | "medium" | "low";
export type Effort = "s" | "m" | "l" | "xl";

export interface Idea {
  no: number;
  title: string;
  kind: Kind;
  group: string;
  phase: Phase;
  impact: Impact;
  effort: Effort;
  mvp: number;
  tags: string[];
  description: string;
  why: string;
  benefit: string;
  usage: string;
  risk: string;
  features: string[];
  routes: string;
  comps: string;
  store: string;
  schema: string;
  types: string;
  fns: string;
  deps: string;
  pkgs: string;
  cfg: string;
  tests: string;
  files: string;
}

export interface IdeasFile {
  project: string;
  topic: string;
  generatedAt: string;
  ideas: Idea[];
}
