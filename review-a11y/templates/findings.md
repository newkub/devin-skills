# Findings — WCAG 2.2 AA barriers on the rendered scope

Scope: [route/component/frontend reviewed] · Audited views: [views audited / views not audited]
Order: keyboard traps and unreachable actions first; `No.` is the first column

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[barrier that blocks or burdens a real user]` | `[native-semantics fix]` | `[view + element + axe rule / keyboard step / zoom observation]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: the rendered view, the element, and the axe rule, keyboard step, or 200% zoom observation that proved it — an untestable claim is a gap, not a pass
- `Severity`: from the matrix `Default severity` and its upgrade/downgrade trigger only; a decorative-only issue stays low
- `Owner skill`: the skill that runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Fix the shared component or token at the source, never a per-page patch or one-off override
- Dispatch through `/improve a11y` and `/improve uxui`; prefer native semantics and existing design-system components over ARIA patches
- Apply confirmed set via `/deep-review <scope> then-fix`
