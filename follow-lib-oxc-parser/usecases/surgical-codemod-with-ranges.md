# Use Case — Surgical Codemod with Node Offsets

> For a rename or an import rewrite, edit the source text at `node.start`/`node.end` instead of regenerating the whole file — formatting, comments, and blank lines survive. Source: https://raw.githubusercontent.com/oxc-project/oxc/main/napi/parser/README.md (accessed 2026-10-20)

## 1. Why text edits beat a full reprint

A printer that takes the AST and returns code normalizes every quote, line break, and comment position. For a one-line semantic change that produces a diff nobody can review. Node spans let you replace exactly the token you mean and leave the rest byte-identical.

Use the offset approach when the change is local: a callee name, a string literal, an import source. Use `esrap` or `oxc-transform` when the change is structural — inserting statements, moving nodes, generating a new module.

## 2. Collect edits with the spans the parser already gives you

```ts
import { parseSync, Visitor } from "oxc-parser";

type Edit = { start: number; end: number; text: string };

export function planImportRewrite(file: string, source: string): Edit[] {
  const { program, errors } = parseSync(file, source);
  if (errors.length > 0) return [];          // never codemod a file that does not parse

  const edits: Edit[] = [];

  new Visitor({
    ImportDeclaration(node) {
      if (node.source.value !== "lodash") return;

      const before = source.slice(node.source.start, node.source.end);
      if (before !== '"lodash"' && before !== "'lodash'") {
        throw new Error(`span mismatch in ${file}: ${before}`);   // encoding or API drift
      }

      edits.push({ start: node.source.start, end: node.source.end, text: '"es-toolkit"' });
    },
  }).visit(program);

  return edits;
}
```

`start` is inclusive and `end` exclusive, so `source.slice(start, end)` is exactly the token — quotes included for a string literal. The slice assertion is not paranoia: it proves the span indexes the same string you passed in before you write a thousand files.

## 3. Rewrite a callee, not the whole call

```ts
new Visitor({
  CallExpression(node) {
    const callee = node.callee;
    if (callee.type !== "MemberExpression") return;
    if (callee.object.type !== "Identifier" || callee.object.name !== "console") return;
    if (callee.property.type !== "Identifier" || callee.property.name !== "log") return;

    edits.push({ start: callee.start, end: callee.end, text: "logger.info" });
  },
}).visit(program);
```

Replacing only the callee keeps the argument list, the trailing comment, and the indentation untouched. Replacing `node.start..node.end` would also rewrite every argument and any formatting inside the call.

## 4. Apply from the end of the file backwards

```ts
export function applyEdits(source: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start);

  let out = source;
  let lastStart = Number.POSITIVE_INFINITY;

  for (const edit of sorted) {
    if (edit.end > lastStart) throw new Error("overlapping edits");
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
    lastStart = edit.start;
  }

  return out;
}
```

Ascending order invalidates every later offset by the length delta of the earlier edit. Descending order makes position shifts irrelevant, and the `overlapping edits` guard catches two rules that touch the same node.

## 5. Make the run idempotent and reversible

```ts
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const edits = planImportRewrite(file, source);
  if (edits.length === 0) continue;           // already migrated, or nothing to do

  const next = applyEdits(source, edits);
  if (next === source) continue;

  writeFileSync(`${file}.bak`, source);
  writeFileSync(file, next);
}
```

Running the codemod twice must produce no second change. The backup (or a clean git tree) is the rollback path; a codemod that cannot be undone is not worth the risk on a real repository.

## 6. Verify the output by re-parsing it

```ts
const after = parseSync(file, next);
if (after.errors.length > 0) throw new Error(`codemod broke ${file}`);

const remaining = planImportRewrite(file, next);
if (remaining.length > 0) throw new Error(`rewrite did not converge in ${file}`);
```

Re-parsing is the only proof that the text you wrote is still valid in the same dialect. Comparing error counts with the original catches a codemod that fixed one thing and broke another.

## 7. Prefer the printer when the change is structural

```ts
// text surgery is wrong for these:
// - adding a new import after the last one
// - wrapping a handler body in try/catch
// - converting CommonJS to ESM at the statement level
```

For those, transform the AST and print with `esrap`, or compile with `oxc-transform` when the target is a different module format. Text edits are for token-level changes; structure belongs to a printer.

## 8. Verify

1. Run the codemod twice — the second run changes nothing and reports zero edits
2. `git diff` shows only the import source lines, with no reformatting elsewhere
3. A file containing `"lodash"` in a string or comment — unchanged, because the rule matched `ImportDeclaration`
4. A file with a syntax error — skipped and reported, never half-rewritten
5. `parseSync` on every output file — zero errors
6. A rule with two overlapping edits on one node — the `overlapping edits` guard throws instead of corrupting the file
7. `/run-verify` — typecheck and tests pass on the rewritten tree

## Pitfalls

- Applying edits in ascending order, so later offsets point into already-shifted text.
- Replacing `node.start..node.end` for a whole call when only the callee needed to change.
- Running the codemod on files where `errors.length > 0` and treating the partial AST as complete.
- Matching `callee.property.name` without checking that `property` is an `Identifier` — computed access like `console["log"]` crashes the rule.
- Using a regex over the whole file and rewriting strings or comments that happen to contain the old name.
- Reading spans from one string (with a BOM stripped) and applying them to another (raw file contents).
- No backup, no clean git tree, and no idempotence check — the first run is also the last chance.
- Assuming `range` is present: it only exists when the `range: true` option is set, while `start`/`end` are always emitted.

## Related

- `references/apis.md`
- `best-practices/ast-analysis.md`
- `usecases/custom-analyzer-rule.md`
- `usecases/parse-errors-and-dialects.md`
