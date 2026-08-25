import { $ } from "bun";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

export interface SkillFrontmatter {
  name: string;
  description: string;
  related?: string[];
  "argument-hint"?: string;
  model?: string;
  subagent?: boolean;
  agent?: string;
  [key: string]: unknown;
}

export interface SkillInfo {
  name: string;
  path: string;
  prefix: string;
  description: string;
  frontmatter: SkillFrontmatter;
  hasReferences: boolean;
  hasSrc: boolean;
  isSubmodule: boolean;
  fileCount: number;
  skillMdLines: number;
  related: string[];
}

export function getDefaultSkillsDir(): string {
  const platform = process.platform;
  if (platform === "win32") {
    const appdata = process.env.APPDATA ?? join(process.env.HOME ?? "C:", "AppData", "Roaming");
    return join(appdata, "devin", "skills");
  }
  const home = process.env.HOME ?? process.env.USERPROFILE ?? ".";
  return join(home, ".config", "devin", "skills");
}

export function parseFrontmatter(content: string): SkillFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const fm: Record<string, unknown> = {};
  let currentKey = "";
  for (const line of yaml.split("\n")) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === "") {
        currentKey = key;
        fm[key] = [];
      } else {
        currentKey = "";
        fm[key] = value.replace(/^["']|["']$/g, "");
      }
    } else if (line.startsWith("  - ") && currentKey) {
      const arr = fm[currentKey] as string[];
      arr.push(line.replace(/^\s*-\s*/, "").replace(/^["']|["']$/g, ""));
    }
  }
  return fm as SkillFrontmatter;
}

export async function scanSkills(skillsDir: string): Promise<SkillInfo[]> {
  if (!existsSync(skillsDir)) return [];
  const skills: SkillInfo[] = [];
  for await (const dir of await $`ls ${skillsDir}`.text().then((s) => s.split("\n").filter(Boolean))) {
    const skillPath = join(skillsDir, dir);
    const skillMdPath = join(skillPath, "SKILL.md");
    if (!existsSync(skillMdPath)) continue;
    const content = await Bun.file(skillMdPath).text();
    const fm = parseFrontmatter(content);
    if (!fm || !fm.name) continue;
    const lines = content.split("\n").length;
    const hasReferences = existsSync(join(skillPath, "references"));
    const hasSrc = existsSync(join(skillPath, "src"));
    const isSubmodule = existsSync(join(skillPath, ".git"));
    let fileCount = 0;
    for await (const _ of new Bun.Glob("**/*").scan({ cwd: skillPath, dot: true })) {
      fileCount++;
    }
    const prefix = dir.includes("-") ? dir.split("-")[0] : "other";
    skills.push({
      name: fm.name,
      path: skillPath,
      prefix,
      description: fm.description ?? "",
      frontmatter: fm,
      hasReferences,
      hasSrc,
      isSubmodule,
      fileCount,
      skillMdLines: lines,
      related: fm.related ?? [],
    });
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export function groupByPrefix(skills: SkillInfo[]): Record<string, SkillInfo[]> {
  const groups: Record<string, SkillInfo[]> = {};
  for (const skill of skills) {
    if (!groups[skill.prefix]) groups[skill.prefix] = [];
    groups[skill.prefix].push(skill);
  }
  return groups;
}
