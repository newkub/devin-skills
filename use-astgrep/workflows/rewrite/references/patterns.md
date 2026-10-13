---
title: ast-grep Pattern Catalog
description: Ready-to-use AST patterns for common batch refactors per language
---

# ast-grep Pattern Catalog

Ready-to-use patterns — adjust `$VAR`/`$$$ARGS` to your actual code; metavar: `$X` = single node, `$$$` = zero-or-more nodes

## TypeScript / JavaScript (`--lang ts` / `--lang js`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| Remove console.log | `console.log($$$ARGS)` | (empty — use `-r ''`) | beware `logger.console.log` — scope with an `inside` rule if needed |
| API/method rename | `$OBJ.$OLD($$$ARGS)` | `$OBJ.$NEW($$$ARGS)` | set `$OLD`/`$NEW` to the real names, e.g. `.substr(` → `.slice(` |
| `==` → `===` | `$A == $B` | `$A === $B` | may match intentional `==` (null-check idiom) — use interactive mode |
| require → import | `const $X = require($P)` | `import $X from $P` | named-destructuring requires need a separate pattern |
| `var` → `let` | `var $X = $V` | `let $X = $V` | const/let can't be split with one pattern — picking `let` is safer |
| function → arrow | `function $N($$$P) { $$$B }` | `const $N = ($$$P) => { $$$B }` | never use on functions relying on `this`/hoisting |
| `&&` → optional chain | `$A && $A.$B` | `$A?.$B` | the repeated `$A` must be the same node — ast-grep verifies that |
| parseInt → Number.parseInt | `parseInt($A)` | `Number.parseInt($A)` | keep the radix if the original had one: `parseInt($A, $R)` → `Number.parseInt($A, $R)` |

## Rust (`--lang rust`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `vec![]` → `Vec::new()` | `vec![]` | `Vec::new()` | `vec![0; n]` doesn't match — safe |
| inline format args | `format!("{}", $A)` | `format!("{$A}")` | single arg only — for multiple args use a rule YAML |
| `match` → `if let` | `match $X { Some($V) => $B, None => () }` | `if let Some($V) = $X { $B }` | `None => ()` must match exactly |
| `.clone()` after to_owned | `.to_string().clone()` | `.to_string()` | typically found via a clippy warning first |
| find unwraps (report-only) | `$X.unwrap()` | — | search only, no rewrite — `expect` messages must be chosen manually |
| `&format!()` as arg | `&format!($$$)` | `format!($$$).as_str()` | check the type context first |

## Python (`--lang python`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `len(x) == 0` → falsy | `len($X) == 0` | `not $X` | only in `if`/`while` contexts |
| bare except | `except:` | `except Exception:` | grammar-level pattern — test first |
| `for k in d.keys()` | `for $K in $D.keys():` | `for $K in $D:` | dicts only — sets/lists have no .keys() |
| `x == True` | `$X == True` | `$X` | intentional `is True` also matches — use interactive mode |
| `%` → f-string | `"%s" % $A` | `f"{$A}"` | multiple %s need a complex rule — suits single-arg cases |
| print py2→py3 | `print $X` | `print($X)` | py2 files only |

## Go (`--lang go`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `interface{}` → `any` | `interface{}` | `any` | go1.18+ only |
| `errors.New(fmt.Sprintf)` | `errors.New(fmt.Sprintf($$$A))` | `fmt.Errorf($$$A)` | needs a `%` verb — without one, `errors.New(fmt.Sprint)` |
| ioutil deprecated | `ioutil.$F($$$A)` | (mapping table: ReadFile→os.ReadFile, ReadAll→io.ReadAll, WriteFile→os.WriteFile) | one pattern at a time — deprecation table from Go 1.16 |
| `x = append(x)` style check | — | — | search only |

## Rule YAML (when a single pattern isn't enough)

Use when you need constraints: kind, regex, inside, has, precedes, follows:

```yaml
# sg-rules/remove-debug.yml — remove console.log only in src/, excluding logger wrappers
id: remove-console-log
language: TypeScript
rule:
  pattern: console.log($$$ARGS)
  inside:
    pattern: function $F($$$P) { $$$B }
fix: ''
```

Run: `sg scan --rule sg-rules/remove-debug.yml --fix` (interactive) or `--fix-all`

## Tips

- Test the pattern with `sg run -p '<pattern>' <file>` on a single file before widening scope
- `$$$` before/after an args list captures trailing commas/whitespace automatically
- The replacement must use metavars the pattern actually captures — a name that isn't captured becomes literal text
- Escape `$` in a pattern as `$$` when you need a literal dollar (e.g. template literal `${x}`)
