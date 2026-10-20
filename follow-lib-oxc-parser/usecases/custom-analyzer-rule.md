# Use Case — Write a Custom Analyzer Rule

> Enforce a project-specific rule over real AST nodes, with `file:line` evidence instead of grep false positives. Source: https://github.com/oxc-project/oxc (accessed 2026-10-20)

## 1. Pick the node type to match

Every ESTree node has a `type` — `CallExpression`, `VariableDeclaration`, `ImportDeclaration`, `MemberExpression`, `TSInterfaceDeclaration`. Write the check against the specific node, not the whole file text.

```ts
import { parseSync, Visitor } from "oxc-parser";

type Finding = { file: string; line: number; message: string };
```

## 2. Match with a Visitor

```ts
export function findBannedCalls(file: string, source: string): Finding[] {
  const findings: Finding[] = [];
  const result = parseSync(file, source);

  const visitor = new Visitor({
    CallExpression(node) {
      const callee = node.callee;
      if (callee.type !== "Identifier") return;

      if (callee.name === "eval" || callee.name === "Function") {
        findings.push({
          file,
          line: node.loc?.start.line ?? 0,
          message: `dynamic code execution: ${callee.name}()`,
        });
      }
    },

    NewExpression(node) {
      if (node.callee.type === "Identifier" && node.callee.name === "Function") {
        findings.push({ file, line: node.loc?.start.line ?? 0, message: "Function constructor" });
      }
    },
  });

  visitor.visit(result.program);
  return findings;
}
```

`node.loc` may be absent depending on parse options — fall back to a line lookup instead of printing `0`.

## 3. Reach nested shapes safely

```ts
MemberExpression(node) {
  if (
    node.object.type === "Identifier" &&
    node.object.name === "process" &&
    node.property.type === "Identifier" &&
    node.property.name === "env"
  ) {
    // process.env.<X> used directly in a repo that requires a config module
  }
}
```

Narrow one level at a time; a cast here hides exactly the shape mismatch that makes the rule miss.

## 4. Report grouped by file and exit non-zero

```ts
const findings = files.flatMap((file) => findBannedCalls(file, readFileSync(file, "utf8")));

for (const f of findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
  console.error(`${f.file}:${f.line} ${f.message}`);
}
console.error(`\n${findings.length} finding(s)`);
process.exitCode = findings.length ? 1 : 0;
```

Stable sort order keeps CI diffs readable when the rule fires on many files.

## 5. Prove the rule on fixtures before trusting it

```ts
import { expect, test } from "bun:test";

test("flags eval but not a method named eval", () => {
  expect(findBannedCalls("a.ts", "eval('1')")).toHaveLength(1);
  expect(findBannedCalls("a.ts", "obj.eval('1')")).toHaveLength(0);
});
```

Two fixtures per rule — one that must match, one that looks similar but must not — is what separates an analyzer from a grep.

## Pitfalls

- Matching on source text inside the visitor: use node types and `node.name`, or comments and strings will trigger false positives.
- Comparing `callee.name` without checking `callee.type === "Identifier"` crashes on member calls.
- Forgetting the tsx/jsx dialect: JSX makes `<Foo>` valid syntax that a plain `.ts` parse rejects.
- Reading `node.loc` when the parser was configured without locations silently reports line 0.
- Ignoring `result.errors` means a file that failed to parse reports zero findings, which looks like a pass.
- Shipping the rule without a negative fixture, so it silently over-matches later.

## Related

- `references/apis.md`
- `best-practices/ast-analysis.md`
- `usecases/extract-imports-and-exports.md`
