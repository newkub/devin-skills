# Deep Test — Visual Domain

Check visual regression by capturing screenshots of routes/components and comparing them against the baseline — to find layout shifts, style breaks, and unintended UI changes

- Use when CSS, the design system, layout, or UI dependencies changed and you need to confirm the screens aren't broken
- Covers page-level screenshots via `agent-browser` or Playwright and component-level via Storybook/Playwright component tests
- Report only: reports diffs, never auto-approves or reverts

> Pre-Run: always run `/deep-review` (domain `review-test`) first — never skip; if findings are blockers, fix or report before running

## Run Quick Path

> Goal: run the existing snapshot set and diff it (merged from `/test-visual`) — steps 1-5 below are the deep pass

1. Detect — `*-snapshots/`, `toHaveScreenshot`, Storybook visual addon/Chromatic, Percy/Argos (`/follow-tool-argos` — Git-history baselines, PR check review) → `percy exec -- <cmd>`; no baseline → the first round creates the baseline, it is not a verify
2. Run — same environment as the baseline (browser, viewport, OS, fonts); record per-snapshot status, diff %, diff image paths; platform-tagged snapshots → run only the baseline's platform
3. Classify — intentional UI change → test outdated → `/update-tests` regenerate (only after confirming the change is correct); layout break / missing style → source regression → `/resolve-errors`; font/render/timing noise → environment stabilize (fixed fonts, wait conditions); never loosen thresholds; same failure ≥3 → stop+report
4. Report — persist → `.devin/temp/report/<workspace>/visual-test-<time>.md` with diff images; all passed → `/run-verify`

## 1. Establish Baseline

> Goal: Have baseline screenshots to compare against

1. Take the scope: routes, components, or the whole app
2. If an existing baseline is in `tests/visual/baseline/` → keep using it; if not → capture it first from the current branch (use a git worktree when comparing across commits)
3. Store the baseline with deterministic naming: `<route-or-component>.png`, e.g. `home.png`, `settings-profile.png`

## 2. Run App And Capture

> Goal: Get the current set of screenshots

1. Run `/run-dev` to start the app, or use a preview build
2. Use `/use-agents-capture` or `agent-browser` to capture every route/component in scope
3. Fix the viewport (e.g. `1280x720`) and disable animations if needed to reduce noise
4. Store them in `tests/visual/current/`

## 3. Compare Screenshots

> Goal: Find significant pixel diffs

1. Compare pairs one by one with Playwright `toHaveScreenshot()`, `pixelmatch`, or `looks-same`
2. Default threshold: diff ratio >0.1% → flag `changed`
3. Separate `missing` (route gone), `new` (new route), `changed`, `same`
4. Generate diff images in `tests/visual/diff/` for visual inspection

## 4. Analyze Changes

> Goal: Separate intended vs unintended changes

1. Open the diff images of the largest findings
2. Check whether the change matches what was actually modified (from the git diff) or is a regression
3. If unsure → run `/deep-review` or use `/deep-review` for additional context
4. Group findings: `intended`, `suspect`, `regression`

## 5. Report

> Goal: Summarize so the user can approve the baseline or fix a bug

1. Build a `/report` with columns: `No.`, `Route/Component`, `Diff %`, `Status`, `Verdict`
2. Attach diff image paths for the important findings
3. If every change is intended → propose updating the baseline
4. If there's a regression → hand off to `/resolve-errors` or `/fix`

## Rules

### 1. Deterministic Capture

- Fix the viewport and device scale factor, and wait for fonts/images to load before capturing
- Disable animations and dynamic content (timestamps, random data) via mocks or CSS overrides
- Captures in the same run must produce identical images — if they flake, fix the flakiness before trusting the results

### 2. Read-Only Verdict

- Never auto-update the baseline when a diff is found — let the user approve
- Never change code just to make a test pass without understanding the cause

### 3. Coverage

- Cover every route in scope and at least the critical flows
- List the skipped routes with reasons (auth-required, external deps)

- Use /use-agents-capture if needed
- Use /use-agent-browser if needed

## Expected Outcome

- Baseline and current screenshots complete per scope
- A list of visual diffs with an intended/suspect/regression verdict
- A clear call on whether to approve the new baseline or fix the regression first
