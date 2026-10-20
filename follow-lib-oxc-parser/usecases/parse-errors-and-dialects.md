# Use Case — Handle Parse Errors and Pick the Right Dialect

> `oxc-parser` never throws: bad syntax yields a partial AST plus an `errors` array, so the dialect and the error handling decide whether your analysis is trustworthy. Source: https://github.com/oxc-project/oxc (accessed 2026-10-20)

## 1. Read the whole ParseResult, not just `program`

```ts
import { parseSync } from "oxc-parser";

const result = parseSync("src/app.tsx", sourceText);

result.program;    // ESTree Program — may be partial when errors exist
result.errors;     // Array<OxcError> — syntax and, optionally, semantic errors
result.comments;   // every leading/trailing comment in the file
result.module;     // static imports/exports/import.meta, already resolved
```

Because the call does not throw, `try/catch` around it is dead code. The only reliable signal is `result.errors.length`.

## 2. Fail closed when the AST is degraded

```ts
type Analysis = { file: string; degree: "ok" | "partial" | "failed"; findings: Finding[] };

export function analyze(file: string, source: string): Analysis {
  const { program, errors } = parseSync(file, source);

  if (errors.length > 0) {
    const severe = errors.some((e) => e.severity === "Error");
    return { file, degree: severe ? "failed" : "partial", findings: [] };
  }

  return { file, degree: "ok", findings: runRules(file, program) };
}
```

Reporting `0 findings` for a file that failed to parse is the most common bug in AST tooling — the run looks clean because the rules never ran. Mark the file and fail the run instead.

## 3. Let the extension choose the dialect

```ts
parseSync("a.ts", src);     // TypeScript, no JSX
parseSync("a.tsx", src);    // TypeScript + JSX
parseSync("a.jsx", src);    // JavaScript + JSX
parseSync("a.mts", src);    // ESM TypeScript
parseSync("a.cts", src);    // CommonJS TypeScript
parseSync("a.d.ts", src);   // declaration file
```

The filename is the dialect selector. Parsing a `.tsx` file as `.ts` produces syntax errors on the first JSX element, and parsing `.d.ts` as `.ts` loses declaration-specific handling.

## 4. Override when there is no filename

```ts
const result = parseSync("stdin.ts", source, {
  lang: "tsx",                 // content came from a pipe, an editor, or a web request
  sourceType: "module",        // known ESM: skip the ambiguity pass
  showSemanticErrors: true,    // deeper checks than syntax
});
```

- `sourceType` — default `unambiguous`; set `module` or `script` explicitly when the file's shape is known
- `lang` — required when the synthetic filename lies about the content
- `showSemanticErrors` — costs more; enable for tooling that must catch duplicate bindings or invalid `await`, not for a syntax-only pass

## 5. Treat `module` as the fast path for import/export questions

```ts
const mod = parseSync(file, source).module;
const specifiers = [
  ...mod.staticImports.map((i) => i.moduleRequest.value),
  ...mod.staticExports.flatMap((e) => e.entries.map((entry) => entry.moduleRequest?.value ?? "")),
];
```

`module` is built by the parser itself, so it stays correct even when the `program` walk would have to special-case re-exports and `import.meta`. If the AST outcome disagrees with `module`, the AST walk is the one that is wrong.

## 6. Surface comments when the rule depends on them

```ts
const directives = result.comments.filter((c) => c.value.includes("@ts-expect-error"));
```

Comments are not nodes — they never appear in `program.body`. A rule about suppressions, license headers, or `TODO` markers must read `result.comments`, and matching them in `source` with a regex will also hit strings.

## 7. Verify

1. Parse a file with an unclosed brace — no exception, `errors.length > 0`, and your analysis returns `failed`
2. Parse valid `.tsx` by passing `"a.ts"` — errors appear; switch to `"a.tsx"` and they disappear
3. Parse `import x from "./y"` with `sourceType: "script"` — an error confirms the explicit mode is honored
4. Add `showSemanticErrors: true` to a file with `await` outside an async function — the semantic error is reported
5. `result.module.staticImports` matches the `ImportDeclaration` walk on a file with re-exports
6. `result.comments` contains a `// @ts-expect-error` line while `program.body` does not
7. `/run-test` — one fixture per dialect and one per error degree

## Pitfalls

- `try/catch` around `parseSync` and a `catch` branch that never runs.
- Filtering `result.errors` by nothing and treating any error as fatal — some diagnostics are warnings.
- Passing a virtual filename like `"file"` with no `lang`, so the parser guesses JavaScript.
- Assuming the AST is complete when `errors` is non-empty, then reporting a drop in findings as an improvement.
- Using a text regex for comments or directives instead of `result.comments`.
- Enabling `showSemanticErrors` in a hot loop over thousands of files and paying the cost for syntax-only rules.
- Deciding `sourceType` from a heuristic when the project manifest already says ESM.

## Related

- `references/apis.md`
- `best-practices/ast-analysis.md`
- `usecases/extract-imports-and-exports.md`
- `usecases/custom-analyzer-rule.md`
