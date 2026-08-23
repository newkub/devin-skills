export type CheckName =
  | "frontmatter"
  | "content-structure"
  | "file-structure"
  | "long-files"
  | "missing-skills"
  | "all";

export interface Issue {
  file: string;
  line: number;
  message: string;
}

export interface Skill {
  name: string;
  content: string | null;
}

export interface SkillFile {
  path: string;
  lineCount: number;
}

export interface PackageNodeDir {
  type: "dir";
  name: string;
  relPath: string;
  fullPath: string;
  children: PackageNode[];
}

export interface PackageNodeFile {
  type: "file";
  name: string;
  relPath: string;
  fullPath: string;
}

export type PackageNode = PackageNodeDir | PackageNodeFile;

export interface Frontmatter {
  raw: string;
  data: Record<string, unknown>;
  body: string;
}
