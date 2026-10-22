# ast-grep (`sg`)

## Commands

| Command | Purpose | Example |
|---|---|---|
| `sg run -p` | ad-hoc pattern search | `sg run -p 'console.$M($$$)' --lang ts src` |
| `sg scan --inline-rules` | temporary YAML rule | `sg scan --inline-rules '<yaml>' src` |
| `sg outline` | symbols and members | `sg outline src/checkout.ts` |
| `sg run --debug` | inspect pattern parsing | `sg run -p 'await $X' --debug src` |
| `sg run --json pretty` | structured matches | `sg run -p 'function $F($$$) { $$$ }' --json pretty .` |
| `sg scan -r` | apply a rewrite rule | route to `/migration-with-astgrep` |

## Pattern Syntax

| Token | Matches |
|---|---|
| `$VAR` | exactly one node |
| `$$$` | zero or more nodes |
| `$$VAR` | captures a node; reuse requires equality |
| literal code | itself; whitespace and comments are ignored |
| `_` | wildcard node |
| `$_` | anonymous wildcard |

## Common Patterns

| Target | Pattern | Language |
|---|---|---|
| Function definition | `function $NAME($$$) { $$$ }` | ts |
| Arrow function | `const $NAME = ($$$) => $$$` | ts |
| Call site | `$FN($$$)` | any |
| Method call | `$OBJ.$METHOD($$$)` | any |
| Import | `import $$$ from '$MOD'` | ts |
| JSX element | `<$TAG $$$ />` | tsx |
| Await | `await $EXPR` | ts |
| Rust function | `fn $NAME($$$) { $$$ }` | rust |
| Python def | `def $NAME($$$): $$$` | python |

## Inline Rule Fields

| Field | Purpose |
|---|---|
| `id` | stable rule name |
| `language` | parser to use |
| `rule.pattern` | structural pattern |
| `rule.kind` | AST node kind |
| `rule.inside` | required ancestor |
| `rule.has` | required descendant |
| `rule.not` | exclusion |
| `constraints` | regex or kind constraints on metavariables |
| `severity` | reported level |

## Notes

| Constraint | Detail |
|---|---|
| Language | auto-detects by extension; pass `--lang` for stdin or unusual extensions |
| Test first | run on one or two files before the whole repo |
| Too many hits | add `inside`/`has`/`kind`; never post-filter with regex |
| No hits | verify with `--debug`, then check `--lang` and pattern syntax |
| Rewrites | route to `/migration-with-astgrep` or `/replace` |
| Interaction | `sg` and `rg` complement each other — use `rg -l` to limit files, then `sg` on them |
