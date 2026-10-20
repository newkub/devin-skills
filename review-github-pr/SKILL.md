---
name: review-github-pr
description: Review the whole pull request before merge — diff, commits, PR metadata, CI, code changes
argument-hint: "[pr-number]"
related:
  - merge
  - resolve-errors
  - report
  - suggest-next-action
  - run-review
  - deep-thinking
  - deep-analyze
  - deep-validate
  - use-subagents

---

## Goal

Review the whole pull request before merge by examining the diff, commits, PR metadata, CI and code changes

## Scope

Use for reviewing a pull request before merge — works on a PR from GitHub or a local branch diff — do not modify code without permission — a single-file package: all review criteria are inline in this file (no `references/`)

## Execute

Every round starts with the deep pre-pass — run `/deep-thinking` → `/deep-analyze` → `/deep-validate` before any fetch/review (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)

### 1. Fetch PR Context

> Goal: pull the complete PR context

1. Have a PR number → run `gh pr view <pr>` and `gh pr diff <pr>`; none → run `git diff <base>..<head>` and `git log --oneline <base>..<head>`
2. Record the data: title, description, author, base branch, commits, files changed, additions/deletions, labels, checks
3. Determine the PR's domain: frontend, backend, infrastructure, docs, config, test, library
4. Using GitHub → run `gh pr checks <pr>` to see CI status

### 2. Review PR Metadata

> Goal: check PR metadata before reviewing code

1. Title follows conventional commits (`<type>: <subject>`)
2. Description has context, linked issue and a summary of changes
3. Correct base branch
4. PR size: small (<10 files), medium (<30 files), large (>30 files) → recommend split if too big
5. Check merge conflicts, draft status, required reviews
6. Commit messages follow convention, no WIP or fixup
- Severity: Critical = wrong base branch, PR is draft but must merge, has conflict; High = title not per convention, no description, big PR unsplit; Medium = no linked issue, WIP commits; Low = minor commit message error, no labels

### 3. Review Code Changes

> Goal: check the PR's code changes

1. Run `/run-verify` — lint, typecheck, scan — fail → report first, then continue
2. Run `/deep-review-codebase` on changed files — with security-sensitive changes, test coverage and quality, docs/changelog/versioning/git hygiene
3. Per the PR's domain → run `/deep-review-codebase` in the domains the diff touches (frontend, backend, api, auth)
- Severity: Critical = build fail, security risk, breaking change without migration; High = missing tests, lint fail, auth change unreviewed; Medium = missing docs/changelog, slight coverage drop; Low = formatting, cosmetic

### 4. Validate Findings

> Goal: confirm findings before reporting

1. Run `/deep-validate` across multiple dimensions and validate each issue one by one
2. Order Critical → High → Medium → Low
3. Identify false positives → discard, do not present

### 5. Governance

> Goal: PR governance is enforced — detect with `gh pr view --json` (reviewers, labels, mergeable, checks), `gh api repos/{owner}/{repo}/branches/{branch}/protection`, `gh pr checks`, `gh pr view --comments` and the `CODEOWNERS` file

1. CODEOWNERS/reviewers — file exists and covers important paths (`src/`, `infra/`, `migrations/`, auth code); owner review complete before merge; no self-merge (except solo-maintainer policy); new commits dismiss stale approvals per policy
2. Branch protection — required checks pass, required reviews meet the policy count, unresolved threads block merge, branch up-to-date with target, signed commits and linear history per convention, admin bypass must be audited
3. PR hygiene — draft PR not merged by mistake, `WIP:`/`DO NOT MERGE` flagged, linked issues (`Closes #123`), labels (type/area/priority), assignee, milestone, PR template fully filled
4. Size/scope — >500 lines changed or >20 files → oversized, recommend split; single concern (no mixed refactor+feature+fix); 1-20 commits, atomic (bisect-friendly); no scope creep
5. Merge strategy — squash for feature PRs, merge commit for releases, rebase for linear history; commit message per convention; delete source branch after merge; never push directly to `main`/`master`
6. Bots/automation — auto-merge only after checks pass; security/license/coverage bots all run; bot tokens least-privilege; bots cannot skip human review on sensitive paths
7. Compliance/audit — merge log (who merged, when, which checks passed); clear revert path (`git revert -m 1`); rollback plan for large/risky PRs; no rubber-stamp approval; post-merge smoke test or monitoring
8. External PRs — CLA/DCO if enforced; fork PRs cannot access secrets in CI; always gets maintainer review; first-time contributor PRs held; `CONTRIBUTING.md` exists and is linked from the PR template
- Severity: merge without required review or bypassing checks = Critical; no CODEOWNERS on sensitive paths = High; oversized PR = Medium; no labels = Low

### 6. Check Gate (Blocking)

> Goal: every gate passes before approve/recommend merge — never skip

1. All CI checks pass: `gh pr checks <n>` — no `fail`/`pending` left; pending → `gh pr checks <n> --watch` or `/resolve-cicd` until green
2. Run `/deep-validate` on the merge result (frontmatter, types, contract) — fail → do not recommend merge
3. Run `/deep-review-codebase` per the PR's scope (domains the diff touches) — blocker findings → fix first, do not merge
4. Only when all 3 items pass → verdict `ready-to-merge`; otherwise `blocked` naming the gate still open

### 7. Score And Report

> Goal: compute score/grade per the criteria, then run `/report-review` and `/suggest-next-action` (github pr)

1. Severity weights — Critical 0, High 25, Medium 50, Low 75, Info 100; review score = weighted average of all findings
2. Grade: A ≥90 (excellent), B ≥80 (good), C ≥70 (pass), D ≥60 (needs improvement), F <60 (fail)
3. Threshold: score <70 → recommend fixing the PR before merge; ≥70 → ready to merge per recommendations
4. Supporting metrics: Review Coverage Ratio, False Positive Rate, Evidence Strength (findings with path/line/commit), Actionability Score, Severity Distribution, MTTR (Critical=1d High=3d Medium=7d Low=14d), Before/After Trend, Risk Exposure Index (Critical/High in security/auth/API/breaking/CI), Scope Boundary Adherence, Report Quality
5. PR-specific metrics: size (changed lines + files), Review Coverage (reviewed files / changed files × 100), CI Pass Rate (passed checks / total checks × 100), Conflict Rate

### 8. Report And Recommend

> Goal: produce the report and recommend actions for the PR

1. Run `/report-review` (table in chat, no files); push review results onto the PR via `gh pr review` when needed
2. PR Checklist table: Title, Description, Size, Conflicts, Conventional Commits, Tests, CI
3. Findings table: Category, Severity, Location, Recommendation
4. State merge readiness: ready / needs changes / needs discussion
5. Run `/suggest-next-action`
- Verdict severity: Critical = merge blocked (CI fail or security risk), High = must fix before merge, Medium = needs discussion, Low = cosmetic/nit

### 9. Deep PR Review (when replies to comments are needed and resolution before merge)

> Goal: detailed review — reply comments, resolve conversations, ask the user before merge

1. Read every unresolved comment and reply per context: agree → fix code + comment with commit SHA; needs explanation → reply with evidence; false positive → clarify — use `gh pr review <pr-number> --comment` and `gh api repos/{owner}/{repo}/pulls/comments/{id}/replies` when needed
2. If fixes are needed → implement per severity → run `/run-check` and `/run-test` after fixing → run `/git-push` (never force); commits on the PR branch are messy → run `/refactor-commit` before push/merge
3. Summarize findings + resolved comments → run `/open-web` to show the PR to the user → ask whether to merge → yes → run `/merge-github-pr` or `gh pr merge`; no → report next actions
- Rules of this step: never merge on your own if the user didn't ask; every conversation must be resolved before merge; CI must pass; always reply with evidence

### Workflows

> Goal: dispatch report formatting to the workflow when review comments with submit are wanted

| Topic | Workflow |
|-------|----------|
| `comments`, `report-comments` — inline comment drafts + summary verdict | `workflows/report-comments/SKILL.md` |

## Subagents

> Goal: review work that can spawn in parallel — short profiles live in this section; spawn via `/use-subagents` with the profiles below

### pr-reviewer — review one PR slice (per-domain/per-file-group) and return findings with severity

- `Inputs`: `pr-diff-scope` (file list or diff range owned, e.g. `src/api/**`, commits `a..b`, or a domain such as `security`); `conventions` (project conventions such as `AGENTS.md`, style guide, PR checklist); `pr-context` (optional: PR number, base/head branch, title, description)
- `Tools`: model `sonnet` — `read`, `grep`, `find_file_by_name`; `exec` only read-only (`gh pr diff`, `gh pr view`, `git diff`, `git log`); never `edit`/`write` on source (read-only reviewer)
- `Execute`:
  - Read the diff of the scope only (`gh pr diff <pr>` or `git diff`) — do not read files outside the scope
  - Read the surrounding code of each hunk to understand context before judging
  - Check per the received domain checklist, e.g. security → injection/auth/secrets, tests → coverage/assertions
  - Assign severity to every finding with real evidence from diff; never guess
  - Summarize the slice verdict: `approve` / `comment` / `request-changes`
- `Output`: findings table `| No. | File | Line | Severity | Finding | Recommendation |`; `severity` = `critical`/`high`/`medium`/`low`/`info`; end with the slice verdict and the finding count per severity; if no findings → return `approve` with a short reason
- `Constraints`: review only — never modify source or push commits; focus on the received scope only, never review the whole PR or files outside the slice; every finding needs a `file path` + `line` or `commit reference`; don't duplicate findings outside the scope (other slices have their own agents); if the scoped diff has no changes → return `approve` immediately noting the scope is empty

### pr-checklist-reviewer — check the PR per dimensions using the criteria in this file as criteria (report-only)

- `Inputs`: `scope` (target path/directory to review); `dimensions` (optional: a subset of checklist dimensions — default all); `findings-file` (optional: baseline output to cross-check)
- `Tools`: model `sonnet` — `read`, `exec`, `grep`, `glob`, `find_file_by_name`; never `edit`/`write` (read-only reviewer)
- `Execute`:
  - Read each `dimensions`' criteria from the section mapped in the next bullet, then actually check (read/grep/glob) — every finding needs a `file:line` + evidence
  - dimension → parent section: `fetch-pr-context`→`### 1`, `pr-metadata`→`### 2`, `code-changes`→`### 3`, `validate-findings`→`### 4`, `governance`→`### 5`, `scoring`→`### 7`, `report-and-recommend`→`### 8`, `deep-pr-review`→`### 9`, `checklist`→`## Rules → Full-Dimension Checklist`
  - Classify severity: `Critical` / `High` / `Medium` / `Low` / `Info`
  - False positive → discard; outside scope → `info` only
- `Output`: table `| No. | Dimension | Severity | File | Finding | Suggestion |`; sorted `Critical`→`Info`; end with a score per dimension + overall; report both strengths and weaknesses
- `Constraints`: read-only — never modify any file (fixing is the job of the parent's `## Fix`); never guess — no evidence no finding; responsible only for the received `dimensions`, don't cross into other dimensions

## Rules

- Review only — do not modify source without permission
- Never verdict `ready-to-merge` if Step 6 (Check Gate) doesn't fully pass — CI + `/deep-validate` + `/deep-review-codebase` are blocking gates
- Focus on changed files — no need to review the whole codebase
- If the PR is large → recommend split before detailed review
- Title and commits must follow conventional commits
- Every finding must have a file path, line number or commit reference
- Never use bold markers — use backticks for emphasis (github pr)
- Never merge on your own if the user didn't ask (deep PR review)

- Use /open-github if needed
- Use /list-github-pr if needed
- Use /merge-github-pr if needed
- Use /resolve-github-actions-fails if needed
- Use /run-review if needed
- Use /resolve-errors if needed
- Use /deep-review-codebase if needed

- If pass → run `/merge-github-pr`; if fail → tell the author to fix per the findings

### Full-Dimension Checklist (check every dimension before concluding)

- Metadata — title/description match the changes, linked issues; size/scope reviewable; labels, reviewers, draft status appropriate; CI checks + required reviews complete
- Code Changes — diff review: logic, edge cases, regressions; no unrelated changes or debug leftovers; tests added/updated with the changes; docs/changelog if user-facing
- Risk And Compatibility — breaking changes flagged with a migration path; security implications and secrets in the diff; performance impact; dependency changes reviewed
- Process — review comments fully addressed, no unresolved threads; commit history clean per convention; merge strategy appropriate (squash/rebase/merge); branch up-to-date, conflicts resolved
- Score each item: pass = 1, warning = 0.5, fail = 0 → grade A (90+), B (80+), C (70+), D (60+), F (<60)

## Fix

> Follow `deep-review-codebase/SKILL.md` when the user confirms fixing findings

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings from code, security, test, delivery, domain reviews
- Merge readiness verdict with reasons
- Clear recommended next actions
