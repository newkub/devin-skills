---
name: review-design
description: Review UX/UI and the design system on the real render, then fix every finding
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - improve
  - follow-design-system
  - follow-lib-unocss
  - follow-web-standard
  - deep-test
  - follow-tool-lighthouse
  - run-dev
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
---

## Goal

Review a UI against its design system, accessibility baseline, and the way it actually renders — then fix the confirmed findings through `/improve uxui` and the design skills that own each rule

## Scope

Use when the question is "does this UI hold up" — a route, page, component set, design-system package, or the whole app after a visual change

- Entered through `/deep-review` with the `design` or `uxui` signal, or called by name; the dispatcher never narrows the request
- Evidence comes from the real render first and the source second: a component that looks right in code but breaks on screen or with a keyboard is a finding
- The design contract is not invented here: `/follow-design-system` owns tokens, components, and platform adaptation; `/follow-lib-unocss` and `/follow-unocss-theme` own the styling/token layer; the project `AGENTS.md` and `rules/ux` own project-specific rules; `/follow-web-standard` owns native-element and a11y correctness
- Fixing is owned by `/improve uxui` and the design skills; this preset confirms findings, orders them by user impact, and verifies on a fresh render
- Purely functional bugs (a button that does nothing) belong to `/review-implement-to-production`; performance belongs to `/optimize`
- Without `then-fix` the run is report-only: a findings table with screenshots/route evidence plus the fix order

## Execute

### 1. Think

> Goal: know the platform, the design contract, and what the user will actually see

1. Run `/deep-thinking` on the scope — platform (web, mobile, desktop, TUI), audience, primary flows, and the states each surface must cover (empty, loading, error, dense, mobile)
2. Read the project design section in `AGENTS.md` and the token source (theme file, `uno.config`, design tokens) — this is the contract the UI is judged against
3. Run `/follow-design-system` to load the universal principles and `/follow-web-standard` for the native-element and a11y baseline; a project-specific rule overrides both
4. Pick the mode: `[scope]` limits routes/components; `--diff` reviews what changed plus the surfaces that render it

### 2. Establish The Render

> Goal: every judgement happens on a real render, not on JSX

1. Start the app with `/run-dev` (reuse a running dev server when one is up); a UI that cannot run → report it as a blocker, never review from source alone
2. List the routes/screens in scope and the breakpoints that matter (desktop, tablet, mobile) from the project convention
3. Capture the current state per route: default, empty, loading, error, and any dense/list state the screen supports
4. For each interactive element, note the real behavior (opens, submits, navigates) — a non-working element is a functional finding, routed out in step 5

### 3. Scan

> Goal: one deterministic evidence pass plus the design-specific tools

1. Run `/deep-review-codebase-everything` on the scope with the `uxui` and `a11y` labels, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run `/deep-test visual` for rendered consistency against the design system, and `/deep-test a11y` for keyboard, focus, contrast, semantics, and reduced motion
3. Run `/follow-tool-lighthouse` for the measurable baseline (accessibility, best practices, SEO) on the routes in scope
4. Walk the project `rules/ux` set when it exists — its findings are already project-specific and outrank generic taste

### 4. Confirm The Design Findings

> Goal: only real, user-affecting findings enter the table

1. Classify each finding: `token` (off-system color/spacing/type/radius/shadow), `interaction` (state, feedback, hover-only affordance, dead focus), `responsive` (breakpoint breakage, overflow, touch targets), `a11y` (contrast, keyboard, labels, motion), `state` (missing empty/loading/error), `consistency` (same pattern rendered two ways), `copy` (tone, truncation, untranslated string)
2. Every finding cites the route/screen, the breakpoint, and the token or rule it violates — "looks off" is not a finding
3. Cross-reference: one missing token often explains many off-system values → one root-cause item with every site
4. Drop taste-only opinions, redesign proposals the user did not ask for, and anything that requires a product decision → group product decisions for one `/ask-me`
5. A finding in code that never renders (dead component) is routed to `/review-implement-to-production`, not fixed as design

### 5. Order The Fix

> Goal: fix what blocks users first

1. Order by impact: broken interaction → a11y blocker → missing state → responsive breakage → token/consistency → copy polish
2. A token-level root cause is fixed at the token layer first; patching each site would recreate the drift
3. A change that alters the design system itself → `/ask-me` before editing, since it affects every screen
4. Without `then-fix` → stop here, report the ordered table with screenshots or route evidence, and close with `/suggest-next-action`

### 6. Fix Through The Design Owners

> Goal: fix at the right layer, not with one-off overrides

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follow the report as-is
2. Run `/improve uxui` with the confirmed scope (every route + the element checklist + a browser pass) — it owns the fix pass and its own confirmation gate
3. Token and styling fixes follow `/follow-lib-unocss` / `/follow-unocss-theme`; a new component or variant follows `/follow-design-system`; a markup or a11y fix follows `/follow-web-standard`
4. Repeated violations that a rule can catch → persist via `/update-devin-project-rules` (convention) or `/update-astgrep-rules` (pattern), including the `rules/ux` set when the repo has one
5. Never introduce a one-off arbitrary value to match a screenshot — fix the token or the component variant

### 7. Verify

> Goal: the fixed UI is proven on a fresh render

1. Re-run `/deep-test visual` and `/deep-test a11y` on the same routes and breakpoints; re-check the exact findings, not only the score
2. Re-run `/follow-tool-lighthouse` and compare against the step 3 baseline
3. Walk the primary flows with the keyboard only and at the mobile breakpoint — the two failure modes a screenshot cannot show
4. Run the project's `/run-check` and `/deep-validate` on the changed files; red → fix before reporting done
5. Re-scan the touched scope only (`--diff`) — the confirmed findings must be gone; anything still open is reported with the reason

### 8. Report

> Goal: the design state is visible and the next action is clear

1. Run `/report-review`: counts per class, before → after (Lighthouse and a11y), and the verification status
2. Name the root causes fixed and the rules persisted, so the same drift does not return
3. List product decisions and deferred items with the reason
4. Close with `/suggest-next-action`

## Rules

- Render first — no design finding without a real screen, route, and breakpoint; source-only review is not enough
- Every finding cites the rule or token it violates; taste alone never enters the table
- Fix at the owning layer — token before component, component before one-off; never patch each site around a systemic issue
- Functional breakage is not design debt — route it to the implement preset
- a11y is a blocker, not a polish item; keyboard and mobile paths are verified, not assumed
- The design-system source is authoritative — a project override needs its own reason, never a silent fork
- Report-only unless `then-fix`; with `then-fix`, only the confirmed set is fixed, through the owning skills
- Never commit or push unless asked; never redesign a flow the user did not ask to change
- Use `/use-subagents` if needed — independent routes or surfaces rendered and fixed in parallel, with disjoint file sets

## Expected Outcome

- A design report where every finding has rendered evidence, a class, and the rule it violates
- The fixed UI re-verified with the same instruments (visual, a11y, Lighthouse) and a before → after baseline
- Token-level root causes fixed once and repeated violations persisted as rules, so they cannot silently return
- Without `then-fix`: an impact-ordered design table, screenshots/route evidence, and no edits
