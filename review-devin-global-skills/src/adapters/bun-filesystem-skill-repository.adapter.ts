import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { Dirent } from "node:fs";
import { join, relative, resolve } from "node:path";
import { EXCLUDED_DIRS, PACKAGE_DIRS } from "../shared/constants.ts";
import type { PackageNode } from "../shared/types.ts";
import type { SkillRepository } from "../modules/review/ports.ts";

export class BunFilesystemSkillRepository implements SkillRepository {
  #root: string;

  constructor(rootDir: string) {
    this.#root = resolve(rootDir);
  }

  get rootDir(): string {
    return this.#root;
  }

  listSkillNames(): string[] {
    const entries = readdirSync(this.#root, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !EXCLUDED_DIRS.has(e.name))
      .map((e) => e.name)
      .sort();
  }

  readSkillFile(skillName: string): string | null {
    return this.readFile(join(skillName, "SKILL.md"));
  }

  listMarkdownFiles(): string[] {
    const out: string[] = [];
    const stack: string[] = [this.#root];
    while (stack.length) {
      const current = stack.pop()!;
      let entries: Dirent[] = [];
      try {
        entries = readdirSync(current, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const e of entries) {
        if (e.isDirectory()) {
          if (EXCLUDED_DIRS.has(e.name) || e.name.startsWith(".")) continue;
          stack.push(join(current, e.name));
        } else if (e.isFile() && e.name.endsWith(".md")) {
          out.push(relative(this.#root, join(current, e.name)));
        }
      }
    }
    return out.sort();
  }

  readFile(filePath: string): string | null {
    const full = resolve(this.#root, filePath);
    if (!existsSync(full)) return null;
    try {
      return readFileSync(full, "utf-8");
    } catch {
      return null;
    }
  }

  countLines(filePath: string): number {
    const content = this.readFile(filePath);
    if (!content) return 0;
    return content.split(/\r?\n/).length;
  }

  getPackageTree(skillName: string): PackageNode {
    const full = resolve(this.#root, skillName);
    return {
      type: "dir",
      name: skillName,
      relPath: skillName,
      fullPath: full,
      children: buildPackageNodes(full, skillName),
    };
  }
}

function buildPackageNodes(dir: string, rel: string): PackageNode[] {
  let entries: Dirent[] = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: PackageNode[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.isDirectory() && EXCLUDED_DIRS.has(e.name)) continue;

    const childRel = join(rel, e.name);
    const childFull = join(dir, e.name);

    if (e.isFile()) {
      nodes.push({
        type: "file",
        name: e.name,
        relPath: childRel,
        fullPath: childFull,
      });
    } else if (e.isDirectory()) {
      let children: PackageNode[] | undefined;
      if (e.name === "subskills") {
        children = buildSubskillsNodes(childFull, childRel);
      } else if (PACKAGE_DIRS.has(e.name)) {
        children = buildPackageNodes(childFull, childRel);
      } else {
        children = [];
      }
      nodes.push({
        type: "dir",
        name: e.name,
        relPath: childRel,
        fullPath: childFull,
        children,
      });
    }
  }
  return nodes;
}

function buildSubskillsNodes(dir: string, rel: string): PackageNode[] {
  let domains: Dirent[] = [];
  try {
    domains = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: PackageNode[] = [];
  for (const d of domains) {
    if (!d.isDirectory()) continue;
    const domainRel = join(rel, d.name);
    const domainFull = join(dir, d.name);
    const children: PackageNode[] = [];

    let subs: Dirent[] = [];
    try {
      subs = readdirSync(domainFull, { withFileTypes: true });
    } catch {
      subs = [];
    }

    for (const s of subs) {
      if (!s.isDirectory()) continue;
      const subRel = join(domainRel, s.name);
      const subFull = join(domainFull, s.name);
      children.push({
        type: "dir",
        name: s.name,
        relPath: subRel,
        fullPath: subFull,
        children: buildPackageNodes(subFull, subRel),
      });
    }

    nodes.push({
      type: "dir",
      name: d.name,
      relPath: domainRel,
      fullPath: domainFull,
      children,
    });
  }
  return nodes;
}
