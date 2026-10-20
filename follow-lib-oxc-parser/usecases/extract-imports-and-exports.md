# Use Case — Extract Imports and Exports Across a Repo

> Build a module graph from real ASTs instead of regexes, with parse errors surfaced instead of swallowed. Source: https://github.com/oxc-project/oxc (accessed 2026-10-20)

## 1. Parse one file with the right dialect

```ts
import { parseSync } from "oxc-parser";

const filename = "src/app.tsx"; // the extension selects js/ts/jsx/tsx/dts
const result = parseSync(filename, sourceText);

if (result.errors.length > 0) {
  console.error(filename, result.errors);
}

const program = result.program; // ESTree Program
```

The parser is error-tolerant: it returns a partial AST and fills `errors`. It never throws on bad syntax, so an unchecked `errors` array is a silent gap in your analysis.

## 2. Walk with a Visitor

```ts
import { Visitor } from "oxc-parser";

type Mod = { file: string; imports: string[]; exports: string[] };

const visitor = new Visitor({
  ImportDeclaration(node) {
    mod.imports.push(node.source.value);
  },
  ExportNamedDeclaration(node) {
    if (node.source) mod.imports.push(node.source.value);
    for (const spec of node.specifiers) {
      if (spec.exported.type === "Identifier") mod.exports.push(spec.exported.name);
    }
  },
  ExportDefaultDeclaration() {
    mod.exports.push("default");
  },
});
```

`node.source.value` is the raw specifier — `./util`, `@scope/pkg`, not a resolved path.

## 3. Resolve and aggregate

```ts
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const files = readdirSync("src", { recursive: true, encoding: "utf8" })
  .filter((f) => /\.(m?[jt]sx?|d\.ts)$/.test(f));

const mods: Mod[] = files.map((file) => {
  const mod: Mod = { file: join("src", file), imports: [], exports: [] };
  const result = parseSync(file, readFileSync(join("src", file), "utf8"));
  if (result.errors.length) console.error(file, result.errors);
  new Visitor({ /* as above, closing over mod */ }).visit(result.program);
  return mod;
});
```

Sequential parsing is fine: Oxc handles thousands of files faster than the worker setup costs.

## 4. Answer the real questions

```ts
const byFile = new Map(mods.map((m) => [m.file, m]));
const external = new Set(
  mods.flatMap((m) => m.imports).filter((s) => !s.startsWith(".") && !s.startsWith("/")),
);
const exported = new Set(mods.flatMap((m) => m.exports));
```

`external` is your dependency surface; compare it with `package.json` to find undeclared or unused packages.

## 5. Fail the script loudly in CI

```ts
process.exitCode = mods.some((m) => m.errors) ? 1 : 0;
```

## Pitfalls

- Using `parse()` to "go faster" — Oxc recommends `parseSync`; thread spawn overhead usually wins out negative.
- Assuming parse throws: it does not, so unhandled `result.errors` produces an AST that silently misses declarations.
- Passing a filename without the real extension loses the dialect (a `.tsx` file parsed as `.ts` breaks on JSX).
- Resolving imports with `path.resolve` on raw specifiers — `node:` and bare package names need a resolver such as `oxc-resolver`.
- Reading `node.specifiers` without a type check: default, namespace, and named exports have different node shapes.
- Forgetting `ExportNamedDeclaration.node.source` (`export { x } from "./y"`) makes re-exports invisible in the graph.

## Related

- `references/apis.md`
- `best-practices/ast-analysis.md`
- `usecases/custom-analyzer-rule.md`
