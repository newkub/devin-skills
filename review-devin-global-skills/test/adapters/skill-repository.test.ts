import { describe, expect, it } from "bun:test";
import { resolve } from "node:path";
import { BunFilesystemSkillRepository } from "../../src/adapters/bun-filesystem-skill-repository.adapter.ts";

const FIXTURES_ROOT = resolve(import.meta.dir, "..", "fixtures", "skills");

describe("BunFilesystemSkillRepository", () => {
  it("lists skill directories", () => {
    const repo = new BunFilesystemSkillRepository(FIXTURES_ROOT);
    expect(repo.listSkillNames()).toEqual(["another-skill", "sample-skill"]);
  });

  it("reads SKILL.md files", () => {
    const repo = new BunFilesystemSkillRepository(FIXTURES_ROOT);
    const content = repo.readSkillFile("sample-skill");
    expect(content).toContain("name: sample-skill");
    expect(repo.readSkillFile("missing-skill")).toBeNull();
  });

  it("counts lines", () => {
    const repo = new BunFilesystemSkillRepository(FIXTURES_ROOT);
    const lines = repo.countLines("sample-skill/SKILL.md");
    expect(lines).toBeGreaterThan(0);
  });

  it("builds a package tree for a skill", () => {
    const repo = new BunFilesystemSkillRepository(FIXTURES_ROOT);
    const tree = repo.getPackageTree("sample-skill");
    expect(tree.type).toBe("dir");
    expect(tree.name).toBe("sample-skill");
    if (tree.type !== "dir") throw new Error("expected dir");
    const skillMd = tree.children.find((c: { name: string }) => c.name === "SKILL.md");
    expect(skillMd?.type).toBe("file");
  });
});
