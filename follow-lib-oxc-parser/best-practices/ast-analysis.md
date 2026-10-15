# Best Practices: oxc-parser (AST Analysis)

Guidance for parsing JS/TS into an AST with the Oxc NAPI binding — fast and correct for analysis/tooling work

## Recommended Patterns

- Use `parseSync(filename, sourceText, options)` as the default — AST deserialization happens on the main thread anyway, so async `parse()` is often slower
- Set `filename` to match the real extension — the parser picks the dialect (`.ts`/`.tsx`/`.jsx`/`.mts`/`.cts`/`.d.ts`) from the file name
- Check `result.errors` every time — the parser is error-tolerant and does not throw; broken code still yields a partial AST
- Walk the AST with `new Visitor({ NodeType(node) {} })` — more declarative than manual recursion
- Read `result.module` for the import/export graph without walking the AST yourself
- Use `oxc-walker` when you need extra walk utilities (parent tracking, simple scopes)
- Filter files before parsing — skip `node_modules`, build output, and oversize files with globs first

## Do / Don't

| Do | Don't |
|---|---|
| Use `parseSync` in the hot path | Use async `parse()` hoping to parallelize — thread overhead exceeds the gain |
| Parallelize with worker threads + `parseSync` | spawn a thread per file without a pool |
| Check `result.errors` before using the AST | assume the parse always succeeds |
| Use `result.module` for imports/exports | walk the AST for `ImportDeclaration` yourself unless needed |
| Cache parse results by file hash/mtime | re-parse every file on every run of an incremental tool |
| Choose oxc-parser when you need a full AST + types | use oxc-parser for simple pattern matching — use ast-grep |

## Common Pitfalls

- Wrong `filename` extension → wrong dialect, e.g. parsing `.tsx` as `.ts` hits parse errors on JSX
- The AST is ESTree-compatible — but has some oxc-specific nodes; check node types before assuming pure ESTree
- Async `parse()` is not faster — deserialization runs on the main thread; async only suits I/O-bound cases
- Override with `options.lang` when the filename is misleading (e.g. parsing content from stdin) — don't forget to set it
- Bun compatibility: the NAPI `.node` binary may misbehave — test first, fall back to `tsx`/Node
- Large ASTs eat memory — process one file at a time, release the AST after use, don't keep the whole repo's ASTs around

## Performance Notes

- Oxc parses ~3x faster than Babel and ~2x faster than SWC — sequential parsing of thousands of files is usually enough, no workers needed
- Worker threads pay off with tens of thousands of files or heavy CPU-bound post-analysis
- The `sourceType: 'unambiguous'` default is good — set it explicitly when known (skips ambiguity detection)
- `showSemanticErrors` adds cost — enable only when you need checks deeper than syntax
- Streaming/early-exit: stop the walk once the needed data is found — Visitor has no built-in bail, track a flag yourself

## Ecosystem / Integration

- Declarative rule-based pattern matching → `/use-astgrep-programmatic` (kind/pattern/has/inside)
- Transform/compile → `oxc-transform`; minify → `oxc-minify`; resolve → `oxc-resolver`
- Print the AST back to code with `esrap` (`esrap/languages/ts`)
- Full linting → `oxlint` (separate package)
- Large-scale file traversal → `/use-scripts`
