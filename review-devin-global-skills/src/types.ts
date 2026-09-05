export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

export interface Finding {
  skill: string;
  file: string;
  line: number;
  category: string;
  severity: Severity;
  finding: string;
  evidence: string;
  fixable?: boolean;
}

export interface Frontmatter {
  name?: string;
  description?: string;
  argumentHint?: string;
  related: string[];
}

export interface MdFile {
  path: string;
  lines: number;
  isSkill: boolean;
}

export interface SkillMeta {
  skill: string;
  path: string;
  lineCount: number;
  frontmatter: Frontmatter | null;
  sections: string[];
  executeSteps: number;
  hasReferences: boolean;
  hasReferencesIndex: boolean;
  allMdFiles: MdFile[];
  body: string;
  bodyLines: string[];
  nonCodeLines: string[];
}

export interface Context {
  skillsRoot: string;
  skillDirs: Set<string>;
  addFinding: (f: Omit<Finding, "skill">, skill: string) => void;
  addObservation: (f: Omit<Finding, "skill">, skill: string) => void;
}
