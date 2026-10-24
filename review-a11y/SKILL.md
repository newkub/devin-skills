---
name: review-a11y
description: Review accessibility on the real render, then fix every confirmed barrier
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - follow-web-standard
  - follow-design-system
  - follow-tool-lighthouse
  - deep-test
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
  - review-design
---

## Goal

Review a scope against WCAG 2.2 AA on the rendered surface, prove each barrier with an audit, keyboard path, or zoom check, then drive the fixes through the accessibility owners until the audited views are clean

## Scope

Use before a redesign ships, after a component-system change, or when a compliance question arrives — a route, component set, workspace, or whole frontend

- On-demand preset: entered through `/deep-review` with the `a11y` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): a11y, theming-dark-mode, motion, responsive-layout, form. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: overall UX, visual consistency, and design-system tokens → `review-design`; a form whose validation logic is wrong → `/deep-review-codebase-everything`; semantic markup rules → `/follow-web-standard` and `/follow-design-system`
- Proof tools: an axe run over the rendered views (`/deep-test a11y`), `/follow-tool-lighthouse` for a second engine, and a real keyboard plus 200% zoom pass
- Without `then-fix` the run is report-only: confirmed barriers with evidence and a fix sequence

## Execute

### 1. Think

> Goal: know which views and flows a person must be able to complete

1. Run `/deep-thinking` on the scope — enumerate the core flows and views, the input methods (pointer, keyboard, screen reader, touch), and the themes and zoom levels in scope
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no interactive UI is skipped only under its `N/A condition`
3. Decide the audit set: every core flow plus one representative page per component family — not a random sample

### 2. Scan

> Goal: one evidence pass on the real render

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run the rendered audit for the chosen views — automated rules first, then the keyboard path and 200% zoom pass the automation cannot judge
3. Record each barrier with the view, the element, and the rule or manual step that proved it; an untestable claim is a gap, not a pass

### 3. Confirm

> Goal: only barriers that block or burden a real user

1. Every finding cites the view, the element, and the axe rule, keyboard step, or zoom observation
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only; a decorative-only issue stays at the lower value
3. Separate a barrier from a preference — visual taste is `review-design`, not an accessibility finding

### 4. Order The Fix

> Goal: unblock the core flows first

1. Order: keyboard traps and unreachable actions → missing names, labels, and error associations → contrast and focus visibility in both themes → motion and reduced-motion → responsive and touch-target issues → best-practice polish
2. Cross-reference: one component fixed at the source closes every view that renders it — prefer the shared fix over per-page patches
3. Large or cross-workspace set → `/create-plan-in-dot-agents`; without `then-fix` stop here with the ordered table

### 5. Fix Through The Owners

> Goal: fixes land in the component or token, not as one-off overrides

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/improve a11y` and `/improve uxui` — prefer native semantics and existing design-system components over ARIA patches
3. Never remove a control, hide content, or disable motion globally to silence a rule; the barrier moves, it does not close
4. Independent component families → parallel workers via `/use-subagents`; an error mid-fix → `/resolve-errors`
5. Persist what should not recur: an accessibility convention → `/update-dot-agents-project rules`; a mechanically detectable pattern (non-semantic clickable `div`, missing label) → `/update-astgrep-rules`

### 6. Verify

> Goal: the same audit and manual pass come back clean

1. Re-run the automation on every touched view and repeat the keyboard and zoom pass
2. Check both themes where the change touched color or focus styling
3. Re-review touched files with `--diff` through the engine and run `/deep-validate` plus the project's `/run-check`

### 7. Report

> Goal: the barrier list is visible before and after

1. Run `/report-review`: findings per matrix row with severity, fix status, and the audit proof
   - Use `templates/findings.md` as the output skeleton
2. State which views were audited, which were not, and anything accepted or blocked
3. Close with `/suggest-next-action`

## Rules

- Real render only — a static source read can suggest a barrier, but only the rendered audit plus a manual pass confirms it
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Report-only unless `then-fix`; only the confirmed set is changed, and each batch is verified before the next
- Native semantics first — ARIA repairs a gap only when no native element can express the behavior
- Use `/use-subagents` if needed — independent component families audited in parallel with disjoint file sets
- Never touch files outside the confirmed set; never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Audited views report zero confirmed WCAG 2.2 AA barriers, with both themes and a keyboard path verified
- Fixes live in the shared component or token, so the same barrier cannot reappear on another page
- Without `then-fix`: a prioritized fix sequence and no edits
