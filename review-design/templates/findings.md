# Findings — UX/UI and design-system findings on the real render

Scope: [route/page/component/app reviewed] · Baseline: [Lighthouse + a11y before]
Order: broken interaction → a11y blocker → missing state → responsive → token/consistency → copy

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[class: token/interaction/responsive/a11y/state/consistency/copy — one-line finding]` | `[fix at the owning layer]` | `[route/screen + breakpoint + the token or rule it violates]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: the route/screen, the breakpoint, and the token or rule violated — "looks off" is not a finding; taste-only opinions and unrequested redesigns are dropped
- `Finding`: prefix the class (`token`/`interaction`/`responsive`/`a11y`/`state`/`consistency`/`copy`); one missing token explaining many off-system values → one root-cause item listing every site
- `Owner skill`: the skill that runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Run `/improve uxui` with the confirmed scope; token fixes → `/follow-lib-unocss`/`/follow-unocss-theme`, component → `/follow-design-system`, markup/a11y → `/follow-web-standard`
- Fix at the owning layer — token before component, component before one-off; never patch each site or use an arbitrary value to match a screenshot
- Functional breakage or a dead component → `/review-implement-to-production`, not fixed as design
