import { isKebabCase } from "../../../../shared/utils.ts";
import type { Issue, PackageNode } from "../../../../shared/types.ts";

export function checkFileStructure(skillNames: string[], trees: PackageNode[]): Issue[] {
  const issues: Issue[] = [];

  function add(path: string, line: number, message: string) {
    issues.push({ file: path, line, message });
  }

  function walk(node: PackageNode) {
    if (node.type === "file") {
      if (!isKebabCase(node.name, true)) {
        add(node.relPath, 1, `file name '${node.name}' is not kebab-case`);
      }
    } else {
      if (!isKebabCase(node.name, false)) {
        add(node.relPath + "/", 1, `directory name '${node.name}' is not kebab-case`);
      }
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  for (let i = 0; i < trees.length; i++) {
    walk(trees[i]);
  }

  return issues;
}
