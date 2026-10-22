# Skill Prefixes

> Prefix taxonomy for `%APPDATA%\devin\skills`. Cited as `update-devin-global-skills` `## Conventions → Skill Prefixes` — keep the section name stable.

## Follow Family

- `follow-lang-*` runtime
- `follow-framework-*` meta/app framework
- `follow-service-*` external service/cloud
- `follow-lib-*` importable lib
- `follow-tool-*` CLI/build tool
- `follow-create-*` create plugins/extensions/CLI/lib
- `follow-*` concept/practice (`follow-goal`, `follow-deploy`) — matches no prefix → keep `follow-`; spans several categories → choose by primary responsibility

## Check And Review Family

- `check-*` detector pass/fail + locations (read-only)
- `review-*` assessor (findings + severity + evidence) and, for eleven of them, a deep-inside preset door (see the `deep-review` family below) — the per-label dimensions live inside the reviewer at `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`; label resolution in `references/review.md` `### Label resolution`): each `improve`/`optimize` scope-map label resolves through the `Aliases` column to its rows and delegates the checks to `/deep-review-codebase-everything` (7 principles, the last (`### 7. Fix`) optional via the `then-fix` argument) — never a second catalog, never a per-label file, never a separate repo-root skill dir
  - `verify-matrix.ts` proves every label resolves to a row
  - only nine `review-*` assessors stay at the repo root: `review`, `review-issues`/`review-gaps` (their own dimension work), `review-test` (test-dimension entry), `review-use-lib-effective` (library-usage assessor for the `lib-usage` row, paired with `/use-lib-effective`), `review-devin-global-harness` (tooling-package exception), `review-github-pr`/`review-github-issue` (PR/issue-scoped), and `review-by-all-stakeholder` (persona dispatcher with role catalogs in `references/`)
  - the eleven `review-*` preset doors (`review-refactor`, `review-implement-to-production`, `review-update`, `review-design`, `review-tests`, `review-security`, `review-performance`, `review-data`, `review-ops`, `review-api`, `review-a11y`) also live at the root but are deep inside — each reuses the `deep-review-codebase-everything` pipeline and is owned by `deep-review-codebase-everything/references/presets.md`
  - a `review-*` change that needs the analyzer side (CLI, analyzers, rule packs) updated goes through `/update-review-cli`, and `/run-review` owns running that CLI

## Deep, Improve, And Optimize Family

- `deep-*` multi-step/multi-dimension orchestrator — one direction `check` → `review` → `### 7. Fix`
- `improve-*`/`optimize-*` top-level = thin entry — find findings via `/deep-review` domains then fix after user confirm + must have `### Tools And Libraries` at the end of `## Scope` (before `## Execute`) — a `| Skill | When To Use |` table mapping `follow-tool-*`/`follow-lib-*`/`follow-service-*` by domain (seo → unlighthouse+takumi; uxui → unlighthouse+unocss/shiki/comark; perf → unlighthouse; bundle → sonda+node-modules-inspector), every entry in `related` + with a real dir (missing → create first via `/new-skills`), as a hint during review/fix, not all mandatory
- creating a new `follow-*` → reverse-wire it into the related `improve`/`optimize` scope-map row (`improve/references/scope-map.md`, `optimize/references/scope-map.md`) or its callers
- a new top-level `review-*` must delegate → `/deep-review` domain, never duplicate content; the fixer boilerplate + Domain Map live inside `deep-review-codebase-everything` (`### 7. Fix` + `references/review.md` `## Domain Map`)
- the `deep-review-*` preset family (`deep-review-codebase-everything` + `review-refactor` + `review-implement-to-production` + `review-update` + `review-design` + `review-tests` + `review-security` + `review-performance` + `review-data` + `review-ops` + `review-api` + `review-a11y`, behind the general `/deep-review` dispatcher) must stay a single `SKILL.md` per package, reuse the `deep-review-codebase-everything` pipeline, and own only their confirm + fix route — a preset never restates a matrix row or a check
- the family's ownership map is `deep-review-codebase-everything/references/presets.md` (`## Preset Map` — tier, seeded labels, fix route), proven by `scripts/verify-matrix.ts`
- deviating from the template → state the reason in `## Scope`

## Review Preset And Subagent Requirement

Every preset door (the `deep-review-codebase-everything` engine plus each `review-*` door) and every `review-*` assessor must have `/use-subagents` in `related` + a "use /use-subagents if needed" rule in the body (before `## Expected Outcome`) — spawn subagents when review items/areas are independent of each other; `deep-review-codebase-everything/references/review.md` (matrix + `Check` statements + fix routing + fix metrics) is the one review reference — every `review-*` and every preset delegates back to it through `/deep-review`, never restates a check. The general `/deep-review` dispatcher itself routes only — it is exempt
