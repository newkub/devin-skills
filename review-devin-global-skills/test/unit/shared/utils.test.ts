import { describe, expect, it } from "bun:test";
import { isKebabCase, parseFrontmatter } from "../../../src/shared/utils.ts";

describe("isKebabCase", () => {
  it("accepts plain lowercase names", () => {
    expect(isKebabCase("sample-skill", false)).toBe(true);
    expect(isKebabCase("skill", false)).toBe(true);
  });

  it("accepts known non-kebab file names when allowed", () => {
    expect(isKebabCase("SKILL.md", true)).toBe(true);
    expect(isKebabCase("SKILL.md", false)).toBe(false);
  });

  it("rejects camelCase and underscores", () => {
    expect(isKebabCase("sampleSkill", false)).toBe(false);
    expect(isKebabCase("sample_skill", false)).toBe(false);
  });
});

describe("parseFrontmatter", () => {
  it("parses a simple frontmatter block", () => {
    const content = "---\nname: sample\nrelated:\n  - one\n---\n\nbody";
    const fm = parseFrontmatter(content);
    expect(fm).not.toBeNull();
    expect(fm!.data.name).toBe("sample");
    expect(fm!.data.related).toEqual(["one"]);
    expect(fm!.body).toBe("body");
  });

  it("returns null when frontmatter is missing", () => {
    const fm = parseFrontmatter("# Hello\n\nbody");
    expect(fm).toBeNull();
  });
});
