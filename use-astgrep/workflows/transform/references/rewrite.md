---
title: ast-grep Rewrite — transform & rewriters
description: YAML transform/rewriters fields for fixes plain metavar replacement cannot do
---

# ast-grep Rewrite Reference

Source: `https://ast-grep.github.io/guide/rewrite/transform` + `.../rewriter` (checked 2026-10-01)

Use when a plain `-r '<replacement>'` is not enough — case conversion, slicing/joining text, conditional text, or rewriting several kinds of sub-nodes in one match. All of it happens in rule YAML via `transform:` + `rewriters:`

## `transform` — convert a metavariable before inserting it into `fix`

`transform:` = dict — key = new var name (no leading `$`), value = transformation object (or string-style since `0.38.3`) — new vars are usable in `fix` or in the next transform (chain)

| op | args | use |
|----|------|-----|
| `replace` | `source: $X`, `replace: <regex>`, `by: <text>` | regex replace; capture group `(?<NAME>.*)` referenced in `by` as `$NAME` |
| `substring` | `source: $X`, `startChar`, `endChar` | trim head/tail (`endChar: -1` = drop the last char) |
| `convert` | `source: $X`, `toCase` | case conversion — `camelCase`, `kebabCase`, `snake_case`, etc. |
| `rewrite` | `source: $X`, `rewriters: [id...]`, `joinBy?` | apply rewriter rules to sub-nodes (see section below) |

String style (`0.38.3+` — use object style on older ast-grep):

```yaml
transform:
  NEW_VAR: replace($VAR_NAME, replace=regex, by=replacement)
  LIST: substring($GEN, startChar=1, endChar=-1)
  KEBABED: convert($OLD_FN, toCase=kebabCase)
```

### Limitations & Tricks

- Regex capture groups work only in the `replace` transform (`replace:` field) and are referenced only in that same transform's `by:` — plain `regex` rules do not support capture groups
- Concatenating a metavar with uppercase letters directly does not work — `$REGRelease` parses as a var named `REGRelease` → workaround: chain `convert`/`replace`
- Conditional text (DasSurma trick) — the var gets a value only when the source matches:

```yaml
rule: { pattern: $FUNC($$$ARGS) }
transform:
  MAYBE_COMMA:
    replace: { source: $$$ARGS, replace: '^.+', by: ', ' }
fix: $FUNC(new_argument$MAYBE_COMMA$$$ARGS)
```

`$$$ARGS` empty → replace does not fire → `f(new_argument)`; with args → `f(new_argument, ...old)`

### Chain Example — `fooDebug` → `fooRelease`

```yaml
rule: { pattern: $OLD_FN($$$ARGS) }
constraints: { OLD_FN: { regex: Debug$ } }
transform:
  KEBABED:   { convert: { source: $OLD_FN, toCase: kebabCase } }        # foo-debug
  RELEASED:  { replace: { source: $KEBABED, replace: '(?<ROOT>)-debug', by: '$ROOT-release' } }  # foo-release
  UNKEBABED: { convert: { source: $RELEASED, toCase: camelCase } }      # fooRelease
fix: $UNKEBABED($$$ARGS)
```

## `rewriters` — a different fix per sub-node in one match

A plain `fix` replaces the whole matched node at once — `rewriters` gives each sub-node its own rule+fix, then joins the results back

### 3 Steps

1. Declare the `rewriters:` list at the top level of the rule file — each entry needs `id`, `rule`, `fix` (`transform`/`constraints` may be added; no `severity`/`message` — Finding + Patching fields only)
2. Apply via `transform` → `rewrite: { rewriters: [id...], source: $VAR, joinBy? }`
3. Use the new var in `fix:`

### Example — `dict(a=1, b=2)` → `{'a': 1, 'b': 2}` (Python)

```yaml
rewriters:
- id: dict-rewrite
  rule:
    kind: keyword_argument
    all:
    - has: { field: name, pattern: $KEY }
    - has: { field: value, pattern: $VAL }
  fix: "'$KEY': $VAL"
rule: { pattern: dict($$$ARGS) }
transform:
  LITERAL:
    rewrite:
      rewriters: [dict-rewrite]
      source: $$$ARGS
fix: '{ $LITERAL }'
```

### Multiple Rewriters & Joiner

- `rewriters: [rewrite-num, rewrite-str]` — each sub-node uses the first matching entry → list order matters
- `joinBy: ' + '` — join transformed nodes with the joiner instead of in-place replacement (`1, 2, 3` → `integer + integer + integer`)

## Safety (same as the main flow)

Always dry run first: `sg scan --rule <file>` lists findings → `sg scan --rule <file> --fix` previews the diff per change → user confirm → `--fix-all`
