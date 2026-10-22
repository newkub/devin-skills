# Common Search Patterns

## File Name Patterns

| Goal | Glob | Command |
|---|---|---|
| Tests | `*.test.ts`, `*.spec.ts` | `rg --files -g '*.{test,spec}.ts'` |
| Fixtures | `*fixture*`, `fixtures/**` | `rg --files -g 'fixtures/**'` |
| Configs | `*.config.*` | `rg --files -g '*.config.*'` |
| Docs | `*.md` | `rg --files -g '*.md'` |
| Rust tests | `tests/**/*.rs` | `rg --files tests -g '*.rs'` |
| Python tests | `test_*.py`, `*_test.py` | `rg --files -g '*test*.py'` |
| Migrations | `migrations/**` | `rg --files -g 'migrations/**'` |
| Lockfiles | `*lock*` | `rg --files -g '*lock*'` |

## Content Patterns

| Goal | Pattern | Command |
|---|---|---|
| TODO markers | TODO, FIXME, HACK, XXX | `rg -n -e TODO -e FIXME -e HACK -e XXX src` |
| Console calls | `console.(log, warn, error)` | `rg -n 'console\.(log\|warn\|error)' src` |
| Rust debug prints | `dbg!`, `println!` | `rg -n -e 'dbg!' -e 'println!' src -t rust` |
| Secrets-ish keys | api_key, token, secret followed by `:` or `=` | `rg -ni '(api[_-]?key\|token\|secret)\s*[:=]' .` |
| Hardcoded URLs | `https?://` | `rg -n 'https?://' src` |
| Relative imports | `from '../...'` | `rg -n "from '\.\.?/" src` |
| Barrel exports | `export * from` | `rg -n 'export \* from' src` |
| Ignore comments | ts-ignore, eslint-disable, biome-ignore | `rg -n -e '@ts-ignore' -e 'eslint-disable' -e 'biome-ignore' src` |
| Nested loops | two `for` headers on one line | `rg -n 'for\s*\(.*for' src` |
| Double map | chained `.map().map()` | `rg -n '\.map\(.*\.map\(' src` |
| JSON in loop | `JSON.stringify` near loop code | `rg -n 'JSON\.stringify' src` then inspect the enclosing loop |
| Unused exports | export with no importer | `rg -n 'export (const\|let\|function\|class\|type\|interface)' src`, then search each name across the repo — prefer `/follow-tool-knip` for a definitive report |

## AST Patterns

| Goal | Pattern | Language |
|---|---|---|
| Await inside a loop | `await $EXPR` with rule `inside: { kind: for_statement }` | ts |
| Async function | `async function $NAME($$$) { $$$ }` | ts |
| Non-null assertion | `$X!` | ts |
| Explicit any | `$X: any` | ts |
| Empty catch | `try { $$$ } catch ($E) { }` | ts |
| React component usage | `<$COMP $$$ />` | tsx |
| Rust unwrap | `$E.unwrap()` | rust |
| Rust panic | `panic!($$$)` | rust |

## Excludes

| Ecosystem | Exclude |
|---|---|
| Node | `node_modules`, `dist`, `build`, `.next`, `coverage` |
| Rust | `target` |
| Python | `.venv`, `__pycache__`, `.mypy_cache` |
| All | `.git`, lockfiles, generated code |

## Notes

| Constraint | Detail |
|---|---|
| Scope | always state the base directory |
| Reproducibility | record the exact pattern string in the report |
| Large result set | top 20 plus total count |
| Sensitive data | redact before reporting |
| Unknown structure | `sg outline` before writing an AST pattern |
