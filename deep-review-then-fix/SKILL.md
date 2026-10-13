---
name: deep-review-then-fix
description: Review first, then fix in context, asking the user to confirm
argument-hint: "[scope]"
related:
  - deep-thinking
  - deep-analyze
  - review
  - fix
  - watch-browser
  - follow-best-practice
  - deep-review
  - create-plan-in-dot-devin
  - suggest-next-action
  - resolve-errors
  - run-review
  - run-test

---

## Goal

Canonical fix skill — review then fix findings in every domain per the Domain Map, through the `## Fix` section and `workflows/` of each `review-*` skill

## Scope

Use when you want both review and fix without a specific target; supports code, docs, and skills

- Small/narrow scope → use the matching `/review` domain; whole-codebase scope → use `/deep-review` as the review pass
- Fix findings after review per the Domain Map below
- Fix mode: user confirms per finding (default), follows the original suggestion (`/follow-your-suggestion`), or `fix all` as the user specifies

See also: /deep-review

## Domain Map

Fixes go through the `## Fix` section or `workflows/` of the `review-*` skill matching the domain — always read before editing

| Domain | Review skill | Fix route |
|--------|-------------|-----------|
| seo | `/deep-review` | `/improve-seo` |
| security | `/deep-review` | `/improve-security` (`## Fix` — secrets rotation, headers, vuln deps) |
| auth | `/deep-review` | `/improve-auth` (RBAC surface → `/improve-rbac`; `## Fix` — sessions, tokens) |
| rbac | `/deep-review` | `/improve-rbac` |
| api | `/deep-review` | `/improve-api` (`## Fix` — contract drift, versioning) |
| backend | `/deep-review` | `/improve-backend` |
| frontend | `/deep-review` | `## Fix` (hydration) + scoped: `/improve-form`, `/improve-i18n`, `/improve-a11y` |
| forms | `/deep-review` | `/improve-form` |
| data-validation | `/deep-review` | `/improve-data-validation` |
| database | `/deep-review` | `/improve-database` (migrations) + query perf → `/optimize-queries` |
| dependencies | `/deep-review` | `/improve-deps` |
| bundle+assets+build speed | `/deep-review` | `/optimize-bundle` |
| performance | `/deep-review` | `/optimize-perf` (network → `/optimize-network`; startup → `/optimize-startup`) |
| memory | `/deep-review` | `/optimize-memory` |
| cost | `/deep-review` | `/optimize-cost` |
| ci/pipeline | `/deep-review` | `/optimize-ci` |
| docker | `/deep-review` | `/optimize-docker` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| tests | `/deep-review` | `/improve-tests` + `## Fix` (flaky) + `/update-tests` for writing new tests |
| uxui | `/deep-review` | `/improve-uxui` + `/watch-browser-and-fix` (browser pass) |
| observability | `/deep-review` | `/improve-observability` |
| accessibility | `/deep-review` | `/improve-a11y` |
| i18n | `/deep-review` | `/improve-i18n` |
| iac | `/deep-review` | `/improve-iac` |
| events | `/deep-review` | `/improve-events` |
| compliance | `/deep-review` | `/improve-compliance` |
| business | `/deep-review` | `/improve-business` |
| release | `/deep-review` | `/improve-release` |
| delivery | `/deep-review` | `/improve-delivery` |
| stability | `/deep-review` | `/improve-stability` (error paths/UI → `/improve-error-handling`; messaging → `/improve-events`) |
| error-handling | `/deep-review` | `/improve-error-handling` (sole owner: error paths, retries, recovery, error states, error UI, error boundaries) |
| architecture | `/deep-review` | `/improve-architecture` (choose pattern → `/follow-architecture`; move files/split layers → `/refactor`) |
| migration | `/deep-review` | `/improve-migration` (backward compat, data integrity, rollback, cutover) |
| quality/types | `/deep-review` | `## Fix` — complexity, imports |
| others (cli, config, docs, mobile, desktop, browser-ext, dx, sdk, usage, ai, mcp) | `/review-<domain>` | the `## Fix` section of that review skill — fix per the findings directly |

## Execute

### 1. Identify Scope

> Goal: Know what to review and fix

1. Run `/deep-thinking` to analyze the context and the scope's goal before starting
2. See [references/identify-scope.md](references/identify-scope.md)
3. Record findings with severity and evidence

### 2. Plan Fixes

> Goal: Plan the fixes

1. See [references/plan-fixes.md](references/plan-fixes.md)
2. Record findings with severity and evidence

### 3. Confirm

> Goal: Get approval before fixing

1. See [references/confirm.md](references/confirm.md)
2. Record findings with severity and evidence

### 4. Apply Fixes

> Goal: Fix the issues per the plan

1. See [references/apply-fixes.md](references/apply-fixes.md)
2. Dispatch approved fixes by domain — group findings, then map them to the `## Fix` section or workflows of `review-*` per the Domain Map above; a domain not in the table → `/ask-me` before fixing
3. Record findings with severity and evidence

### 5. Verify

> Goal: Check the results after fixing

1. See [references/verify.md](references/verify.md)
2. Record findings with severity and evidence

## Rules

### 1. Review Before Fix
- Must `/review` and report before editing
- Never edit without confirmation

### 2. Incremental Fix
- Fix one file or a small batch at a time
- Verify after each fix

### 3. Evidence
- Every fix must have a reason from the review
- Cite file path and line number

- Use /fix if you want to fix per the suggestion or fix all
- Use /watch-browser-and-fix if needed
- Use /follow-best-practice if needed
- Use /deep-review if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed

## Metrics

- See the metrics for review in [references/scoring.md](references/scoring.md) (then fix)

## Fix

> Follow `deep-review/SKILL.md` when the user confirms fixing the findings

1. Rank findings by severity — canonical steps in `deep-review/SKILL.md`
2. Pick the fix route matching each finding from the Domain Map above (then fix)
3. preserve behavior + verify + report — canonical in `deep-review/SKILL.md`

## References

- [Full-dimension checklist](references/checklist.md)
- Use /run-review if needed

- Use /create-plan-in-dot-devin if needed
- Re-run via /run-test <domain> after fixing to verify tests are green

## Subagents

> Goal: Independent work that can be spawned in parallel — profiles live in this section, no separate files needed

### fix-worker — apply the fixes the user approved within a single module/domain, then verify and return changed files + results (use when findings span several modules that can be fixed in parallel without collision)

- **Inputs**: `findings` (the approved findings list for this module/domain — finding id, severity, `file:line`, recommendation), `scope` (the single module/domain it owns, e.g. `src/auth/`, `domain=security`, `package=ui`), `fix-guides` (optional — paths of the matching domain's `## Fix` section or workflow `SKILL.md`), `verify-commands` (optional — commands for verifying, e.g. `bun run typecheck`, `bun run test`)
- **Tools**: `read`, `grep`, `find_file_by_name` (read fix guides and the source to be fixed), `edit`/`write` (apply only the approved fixes), `exec` (run lint, typecheck, tests after each fix)
- **Execute**:
  1. Read the fix route for the matching domain (the `fix-*`/`improve-*` workflow or the review skill's `## Fix`, per the Domain Map above) — if none exists, fix directly per the finding's recommendation
  2. Rank findings by severity — `critical` first, then fix one at a time
  3. Each fix must preserve the original behavior — minimal diff, no refactoring beyond the finding
  4. Verify immediately after each fix with `verify-commands` or checks the scope supports
  5. If a fix breaks a check → revert that fix and mark it `failed` with the reason, then continue
- **Output**: table `| No. | Finding | Status | Changed Files | Verify Result |` — `status`: `fixed`/`failed`/`skipped` (out of scope or missing approval); close with a summary of total fixed/failed/skipped, all changed files, and aggregate verify (`pass`/`fail`); if aggregate verify fails → list the reverted fixes and residual risk
- **Constraints**: fix only the findings in the `findings` list within the assigned `scope` — never touch another module's findings; never apply unapproved fixes — if unclear, mark `skipped` with a reason; every fix must pass its own verify — on failure revert immediately, never leave a broken state; never touch files outside `scope` unless a finding requires it (e.g. a shared import) — must be noted in the output; no commits — the parent commits after merging all worker results

## Expected Outcome

- Issue report before fixing
- Issues fixed as the user agreed
- Verification passed
- Next-action summary with `/review` and `/fix`
