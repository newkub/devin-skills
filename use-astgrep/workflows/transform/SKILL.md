---
name: use-astgrep-transform
description: ast-grep rule-YAML transformations: fix, constraints, transform, rewriters for complex rewrites
argument-hint: "[rule-or-intent]"
related:
  - use-astgrep
  - update-astgrep-rules
  - use-astgrep-programmatic
  - run-check
  - report
---

## Goal

Build ast-grep rule YAML that transforms code beyond metavar replacement — case conversion, conditional text, regex capture, per-subnode fixes — then apply safely with a dry-run → confirm → fix flow

## Scope

- Covers `rule` fields (`pattern`, `kind`, `inside`, `has`, `follows`, `precedes`, `all`/`any`/`not`), `constraints`, `fix`, `transform`, `rewriters`, `utils` — deep-dive in `references/rewrite.md`
- A plain pattern string suffices → `/use-astgrep rewrite`; permanent lint rules → `/update-astgrep-rules`; transforms YAML cannot express (cross-file, stateful) → `/use-astgrep-programmatic`

## Execute

### 1. Detect Need

> Goal: determine that rule YAML is needed, not a pattern string

1. Need constraints on metavars (`regex`, `kind`, `not`) or context (`inside`/`has`/`follows`) → rule YAML
2. Need to transform captured text — case conversion, substring, regex replace, conditional text → `transform:` (see `references/rewrite.md`)
3. Sub-nodes in one match need different fixes → `rewriters:` + `transform.rewrite` (see `references/rewrite.md`)
4. If none of these apply → `/use-astgrep rewrite` is enough

### 2. Write Rule YAML

> Goal: a correct rule file with a clearly bounded scope

1. Scaffold: `ast-grep new rule <name> --lang <lang>` or hand-write in temp/`sg-rules/` (not `rules/` until promoted)
2. Minimal skeleton: `id`, `language`, `rule`, `fix` — add `severity`, `message`, `constraints`, `transform`, `rewriters`, `utils` as needed
3. Write `fix` using actually captured metavars — vars from `transform:` are usable in `fix` (chained in order)
4. Reference `utils` rules via `matches: <util-id>` when shared helpers are needed

### 3. Dry-Run And Preview

> Goal: see findings + diff before applying — mandatory

1. `sg scan --rule <file>` = list findings (dry run)
2. `sg scan --rule <file> --fix` = interactive diff per change — review the first 3-5 matches
3. False positives → add constraints/inside; missed targets → loosen constraints or split the rule

### 4. Apply And Verify

> Goal: apply after confirm, then verify the result

1. After user confirm: `sg scan --rule <file> --fix-all` or interactive accept (`a`)
2. Re-scan the original rule → 0 findings (unless intentional)
3. Run `/run-check` — lint/typecheck must pass; on failure → `git restore` the broken files + adjust the rule (max 3 rounds)
4. Rules worth keeping permanently → promote into `rules/` via `/update-astgrep-rules`
5. Run `/report`: `No.`, `Rule`, `Files`, `Changes`, `Status`

## Rules

- Always dry-run + diff preview + user confirm before `--fix`/`--fix-all` — same as `/use-astgrep rewrite`
- The git working tree should be clean before applying — sg rewrite has no undo
- Regex capture groups work only in `transform.replace` — plain `regex` rules do not support them
- `rewriters` entries take only `id`/`rule`/`fix` — no `severity`/`message`; list order matters (first match wins)
- Use `/use-astgrep-programmatic` if needed

## Expected Outcome

- Correct rule YAML transform — preview passes, 0 findings after apply, checks green
- Rules ready to promote into `rules/` if reusable
