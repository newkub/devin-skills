---
name: deep-report
description: Turn review and analysis findings into one interactive HTML deep report
argument-hint: "[scope]"
related:
  - deep-thinking
  - deep-review
  - deep-analyze
  - deep-research
  - report-html
  - report
  - create-report-in-dot-devin
  - suggest-next-action
  - update-agents-md
  - open-web

---

## Goal

Produce one interactive HTML deep report from `/deep-review` and `/deep-analyze` findings — a 7-column evidence-backed findings table plus the 4-part summary — rendered through `/report-html`, never a chat table

## Scope

Use when the user asks for a deep report of a reviewed or analyzed scope; the deliverable is a single-file HTML artifact saved under `.devin/reports/`

| Need | Owner |
|------|-------|
| Chat table only | `/report` |
| JSON or markdown artifact | `/create-report-in-dot-devin` |
| Deep report in the browser | `/deep-report` |

## Execute

### 1. Think First

> Goal: decide what the report must answer before collecting a single finding

1. Run `/deep-thinking` — what kind of artifact is the scope, which dimensions can yield findings, which questions the report must answer, which review or analysis data already exists
2. Set the report scope: the reviewed path, the target audience, and the decisions the reader must make from it
3. Read `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`) so each finding names a real dimension

### 2. Gather Findings

> Goal: collect every finding from the review and analysis of the scope

1. Use `/deep-review <scope>` to review every dimension that applies — its report is the primary source
2. Reuse findings already produced in this session instead of rerunning a review for the same scope
3. Use `/deep-analyze` for architecture, dependency, or structure evidence the review does not carry
4. Use `/deep-research` when a finding needs an external standard to judge it
5. Record per finding: source dimension, severity, `file:line`, and the evidence that proves it
6. No findings at all → report the clean scope in one sentence and stop; never render an empty report

### 3. Classify Findings

> Goal: fill all seven columns before rendering

1. Set Scope: `Domain > Category` (e.g. `Code & Architecture > Completeness`)
2. Set File: the file and line with the issue (e.g. `apps/website/src/routes/__root.tsx:26`)
3. Set Cause: the root cause, not a symptom
4. Set Solutions: an actionable fix that names the file and the function
5. Set Severity: Critical > High > Medium > Low
6. Set Review Workflow: the `/deep-review` dimension from the matrix
7. Set Evidence: the code snippet, grep output, or pattern that triggered the finding
8. False positive → Cause reads `False positive: <reason>` and Solutions reads `Fixed: <what changed>`
9. Sort Critical first, then High

### 4. Build The Findings Table

> Goal: a severity-ordered table grouped by review workflow

1. Keep the 7 columns in order: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
2. Group by Review Workflow so each group links back to its `/deep-review` dimension
3. Inside each group sort Critical → High → Medium → Low
4. Show only categories that have findings — a passing category gets no row
5. Every row keeps verifiable evidence; a row without evidence states `Manual review required`

### 5. Build The Deep Summary

> Goal: the 4-part summary that closes the report

1. Domain Breakdown — per domain: score %, pass/warn/fail counts, top finding; domains are User-Facing, Security & Compliance, Backend & Data, Infrastructure, Code & Architecture
2. Severity Distribution — count per severity, compared with the previous run when data exists
3. False Positive Analysis — each false positive, its root cause, and the fix applied; none → `None found`
4. Recommended Actions — quick wins (low effort, high impact) first, then major improvements (high effort, high impact); each action names its review workflow, effort, and expected impact

### 6. Prepare Report Data

> Goal: one data array `/report-html` can render without reshaping

1. Turn every row of Step 4 into an object with a unique `id`, the 7 columns, `group` = Review Workflow, and `searchText` covering every visible field
2. Attach the per-row dropdown detail in full: `Cause`, `Solutions`, `Evidence`, plus a sketch or plan block when the finding has one
3. Build the Key Findings cards from the highest-severity rows — title, severity, `file:line`, action
4. Build the Next Action list from Step 5 part 4, numbered, highest impact first
5. Keep cell text in the project's language; headers and summary stay English

### 7. Render With Report HTML

> Goal: a single interactive HTML file, built by `/report-html`

1. Dispatch `/report-html` with the Step 6 data and require these sections: Key Findings, findings table with sort/filter/group/search, the 4-part summary, Next Action
2. Follow `/report-html` for the shell — Tailwind + Vue CDN, theme toggle, sticky tabs, sticky table header, per-row dropdown, print CSS, empty state, `prefers-reduced-motion`
3. Save as `.devin/reports/deep-report-<scope>-<yyyy-mm-dd>.html`; use `reports/<name>.html` only when the project has no `.devin/` convention
4. Never ship a chat table or a JSON artifact as the deliverable — those belong to `/report` and `/create-report-in-dot-devin`

### 8. Verify And Open

> Goal: prove the report renders and every interaction works

1. Open the file with `/open-web`
2. Check tabs switch, search/filter/sort/group work, a row expands into its dropdown, the theme toggle persists, and print preview hides the controls
3. Confirm every finding in the review appears exactly once — no dropped row, no duplicate
4. Confirm the 4-part summary and Next Action are present; missing data states `None found` instead of an empty block
5. A broken section → fix it in the same file and re-check before reporting completion

### 9. Suggest Next Actions

> Goal: route the reader to the next move

1. Run `/suggest-next-action` on the prioritized findings
2. Recommend `/deep-review <scope> then-fix` for the confirmed findings, naming the dimension per row
3. Recommend `/update-agents-md` when conventions no longer match the current dependencies
4. Close with the saved report path and the first action in one or two sentences

## Rules

### 1. Output Contract

- The only deliverable is one self-contained HTML file built through `/report-html`
- Chat table → `/report`; JSON or markdown artifact → `/create-report-in-dot-devin`; never produce two deliverable formats for one request
- Key Findings sit on top of the HTML, the table follows, the 4-part summary and Next Action close it

### 2. Table Columns

The deep-report table has 7 columns in order:

| Column | Description | Required |
|---|---|---|
| Scope | `Domain > Category` where the issue was found | Yes |
| File | File and line with the issue | Yes |
| Cause | Root cause of the problem | Yes |
| Solutions | Actionable and specific fixes | Yes |
| Severity | Critical > High > Medium > Low | Yes |
| Review Workflow | `/deep-review` dimension from the matrix | Yes |
| Evidence | Code snippet or pattern that triggered the finding | Yes |

### 3. Grouping

- Group by Review Workflow to link every group to its `/deep-review` dimension
- Sort by severity inside each group: Critical first, then High
- Group headers are visually distinct from rows in the HTML report

### 4. Evidence Requirement

- Every row must have verifiable evidence
- Evidence is a code snippet, grep output, or the pattern that triggered the finding
- No verifiable evidence → state `Manual review required`

### 5. False Positive Handling

- False positive → Cause reads `False positive: <reason>`
- The fix goes in Solutions: `Fixed: <what was changed>`
- Each one appears in the False Positive Analysis part of the summary

### 6. Root Cause Analysis

- Cause must be a root cause, never a symptom
- False positive → explain why the analyzer was wrong
- Real issue → explain what the code does wrong and why

### 7. Solutions Quality

- Solutions must be actionable and specific
- Never use generic advice like "improve code quality"
- Name the file and function to fix whenever possible

### 8. Summary Completeness

- The summary always has all 4 parts: Domain Breakdown, Severity Distribution, False Positive Analysis, Recommended Actions
- Missing data for a part (e.g. no false positives) → state `None found`
- Never leave a summary section blank

### 9. Data Shape For Report HTML

- Each row carries `id`, `group`, `searchText`, and every visible column
- The per-row dropdown shows `Cause`, `Solutions`, `Evidence` as its labeled columns
- Severity and review workflow render as badges, not plain text only — never rely on color alone

## Expected Outcome

- One `.devin/reports/deep-report-*.html` (or `reports/`) rendered through `/report-html`
- A 7-column findings table with verifiable evidence, grouped by review workflow and sorted by severity
- 4-part summary: Domain Breakdown, Severity Distribution, False Positive Analysis, Recommended Actions
- Every finding has root cause analysis and actionable solutions
- The report opens in the browser with tabs, filters, sort, and per-row dropdowns verified
- Next actions prioritized: quick wins first, major improvements next
