---
name: no-use-ignore
description: Remove ignore comments (ts-ignore, eslint-disable, biome-ignore, noqa), fix root cause
argument-hint: "[@files... | scope]"
related:
  - deep-review
  - run-lint
  - run-typecheck
  - run-verify
  - use-astgrep
  - report-before-after
  - simplify
---

## Goal

Remove suppression comments (lint ignore, type ignore, coverage ignore) from the code — actually fix the problem that was suppressed instead of disabling the rule — leaving only suppressions that are justified with a reason

## Scope

- If the user specifies `@files...` → clear only those files; if not specified → scan the given scope or the whole project
- Suppressions that live in config files (`.eslintignore`, `coveragePathIgnorePatterns`, `.gitignore` for build outputs) → not in this scope — this skill handles only code-level suppression comments/annotations
- security-scan ignores (`# nosec`, `#checkov:skip`, `#tfsec:ignore`) → escalate severity — suppressing a security finding must always have a written justification + issue link
- mechanical batch across many files → `/use-astgrep rewrite` (always dry-run + confirm before overwriting)

## Execute

### 1. Inventory Suppressions

> Goal: know which suppressions exist, where, and for which tool

1. scan suppression comments/annotations in the scope per the table below — use `rg`/`ast-grep` patterns per ecosystem
2. Group by tool + rule: `(file, line, tool, rule)` per suppression
3. Classify: `stale` (suppresses something that no longer exists — unused directives), `blanket` (file-level or no rule specified), `lazy` (rule specified but no reason), `justified` (rule + reason comment + narrowest scope)

| Ecosystem | Suppression Syntax |
|-----------|-------------------|
| TypeScript | `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `@ts-check` (on a file where it is not intended) |
| ESLint | `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line`, `eslint-enable`, `/* eslint ... */` overrides |
| Biome | `biome-ignore lint/...`, `biome-ignore format`, `biome-ignore assist` |
| Formatters | `# fmt: off`/`on` (black/ruff), `// swiftformat:disable`, `// clang-format off` |
| Python | `# noqa`, `# type: ignore`, `# pylint: disable`, `# pragma: no cover`, `# nosec` |
| Go | `//nolint`, `//lint:ignore`, `// #nosec`, `//go:noinline` misuse |
| Rust | `#[allow(...)]`, `#![allow(...)]` crate-level, `#[allow(clippy::...)]` |
| Java / Kotlin | `@SuppressWarnings`, `@Suppress`, `@kotlin.Suppress` |
| C# / C++ | `#pragma warning disable`, `[SuppressMessage]`, `// NOLINT`, `// NOLINTNEXTLINE`, `#pragma GCC diagnostic ignored` |
| Swift | `// swiftlint:disable`, `// swiftlint:disable:next` |
| Dart | `// ignore: rule`, `// ignore_for_file:` |
| Ruby | `# rubocop:disable`, `# rubocop:todo` |
| Shell | `# shellcheck disable=SC...` |
| PHP | `@phpcs:ignore`, `phpcs:disable`, `@phpstan-ignore`, `@psalm-suppress` |
| CSS / HTML | `/* stylelint-disable */`, `<!-- markdownlint-disable -->` |
| Coverage | `/* istanbul ignore */`, `# pragma: no cover`, `// coverage:ignore`, `.coveragerc` exclusions |
| Infra scanners | `# hadolint ignore=DL`, `#checkov:skip=`, `#tfsec:ignore:`, `# kics-scan ignore` |

### 2. Classify Each Suppression

> Goal: separate the ones that must be fixed vs the ones that can be kept

1. `stale` — just delete it (a directive that suppresses nothing — e.g. `eslint-disable` on code that already passes the rule; tools: `eslint --report-unused-disable-directives`, biome `--diagnostic-level=error` reports unused suppressions)
2. `blanket` — file-level disables (`@ts-nocheck`, `eslint-disable` with no rule, `ignore_for_file`, `#![allow]`) → split into temporary per-line suppressions to see the real surface then fix each point
3. `lazy` — has a rule but no reason → fix the root cause (Step 3)
4. `justified` — keep it but enforce the format: narrowest scope + named rule + reason comment (`// eslint-disable-next-line no-console — intentional CLI output`) + link the issue if it is a temporary workaround

### 3. Fix Root Cause

> Goal: fix the problem that is actually suppressed, not delete the comment and let lint/typecheck break

| What is suppressed | The real fix |
|-----------------|----------|
| type error (`@ts-ignore`, `# type: ignore`) | fix the types — proper types, narrowing, guards; cast when truly necessary (`as` + comment); generated/external code → `.d.ts` or `skipLibCheck` scope |
| lint rule violation | fix the code per the rule — restructure logic, rename, split the function; if the rule is wrong across the whole codebase → adjust the config at the root (`update-config`) rather than suppressing file by file |
| format suppression (`fmt: off`, formatter ignore comments) | remove the suppression then format — if the code intentionally lays itself out (ASCII art, aligned tables) → justified with a reason |
| security suppression (`# nosec`, `checkov:skip`) | always fix the root cause — there is no justified case without a written exception + expiry; escalate `/check-secrets` if suppressing to hide a secret |
| coverage suppression (`no cover`, `istanbul ignore`) | write a test instead (`/update-tests`); keep only defensive branches that are truly unreachable (`assert_never`, platform guards) with a comment |
| allow/expect in Rust/C | fix the lint that triggers — most clippy suggestions can be fixed directly; `#[allow]` at block-level is better than item-level, item-level is better than crate-level |

### 4. Enforce Going Forward

> Goal: suppressions do not come back without a reason

1. enable unused-directive reporting in the tool config — `reportUnusedDisableDirectives` (eslint ≥9 default), biome `linter` diagnostics, `#![warn(unused_attributes)]`
2. lint rule/CI check — fail on suppressions without a reason comment (eslint `eslint-plugin-eslint-comments`/`@eslint-community/eslint-comments` `require-description`; biome nursery `noSuppressionWithoutReason` if available; a custom `rg` gate such as `rg -l '(ts-ignore|eslint-disable|noqa|nolint)(?!\s*-\s*\w)'`)
3. config-level exceptions move to the root config (`.eslintrc` overrides, `biome.json` overrides) — clearer than scattered comments
4. for generated/vendor files → exclude in the tool config, not with a suppression in the file

### 5. Verify

> Goal: suppressions are actually gone and the code still passes

1. re-scan the scope — count suppressions before/after (`stale`/`lazy`/`blanket` → 0, `justified` remaining with a reason)
2. Do `/run-lint` + `/run-typecheck` — no new errors after removing the suppression
3. Do `/run-verify` — tests pass, behavior unchanged (a suppression is a runtime no-op but the fix inside changes the code)
4. `/report-before-after` — count per category: stale removed, lazy fixed, justified kept (with reasons), config-exceptions moved

## Rules

### 1. Fix, Don't Silence

- Removing a suppression then letting lint/typecheck break = fail — every suppression removed must fix the underlying issue or move to a more suitable config override
- Never replace `@ts-ignore` with an `any` cast to dodge it — that is suppression in another form (fix the types for real)

### 2. Justified Suppression Format

- A remaining suppression must have: a named rule (no blanket disable), the narrowest scope (`next-line` > block > file > crate), an English reason comment on the same line or above, an issue/ticket link if it is a workaround
- security suppressions must have a documented exception + expiry — no exception → always fix the root cause

### 3. Generated And Vendor Code

- generated code, vendored code, minified bundles → exclude in the tool config, not suppress in the file (the files get regenerated and the suppression disappears anyway)

### 4. Preserve Behavior

- suppression removal must not change runtime behavior — the fix inside must pass the existing tests
- Do not mix with feature work — commit separately per category (stale → fixes → config moves)

### 5. Don't Over-Police

- A suppression that is already well justified (named rule + reason + narrow scope) → keep it, no need to "fix" (`/simplify guard`)
- test files have more leniency — `@ts-expect-error` in negative tests is a feature, not a suppression

- Use /deep-review if necessary
- Use /deep-review if necessary
- Use /run-lint if necessary
- Use /run-typecheck if necessary

## Expected Outcome

- stale/blanket/lazy suppressions are down to 0 — leaving only justified ones with a named rule + reason + narrowest scope
- every security suppression has a documented exception or was fixed at the root cause
- the config enforces: unused-directive reporting + a reason-required gate
- passes lint/typecheck/test/build — behavior unchanged
