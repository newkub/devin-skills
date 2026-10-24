# UX/UI Report

Source: [prompt / `AGENTS.md` / scanned routes, pages, components]
Scope: [platform iOS / Android / Web / Desktop — framework, screen size]
Date: [YYYY-MM-DD]

Key findings: [3–5 lines on flows, gaps, risky screens]

## Screen — [screen-name] (purpose: [one line])

```text
┌──────────────────────────────────────────────┐
│ [status bar]                                 │
├──────────────────────────────────────────────┤
│ [navigation bar]        [Tap]                │
│ [content / list item]   [Press]              │
│ → [next screen]                              │
├──────────────────────────────────────────────┤
│ Tab 1 | Tab 2 | Tab 3                        │
└──────────────────────────────────────────────┘
```

UX annotations: [interaction] · [loading / empty / error state] · [gesture] · [accessibility label]

## Screen Summary

| No. | Screen | Tab Group | Transitions | States | Notes |
|---|---|---|---|---|---|
| 1 | `[screen-name]` | `[bottom tab / drawer / stack]` | `→ [next screen]` | `[loading / empty / error]` | `[gap or risk]` |

## Fill Rules

- One `## Screen` section per screen, ordered by navigation sequence; every screen carries its name and purpose.
- The wireframe is a ` ```text ` block only — no images or binary files; every box uniform width with the right border `│` aligned, no line wider than 80 characters, fix distortion with `/draw-ansi`.
- Mobile draws status bar, middle content, bottom tab bar and states safe areas; web/desktop draws sidebar/top nav plus main content, separating global from local nav and stating breakpoints.
- Mark targets `[Tap]` `[Press]` `[Toggle]`, disabled states `[Disabled]`, transitions `→ Screen B`.
- `Screen Summary` narrows `/report` to this skill's own fields; annotations cover loading, empty, error, gestures, and accessibility labels.
- Never `**` bold; use backticks for `tools`, `commands`, `paths`, `screen-name`; `✅` `⚠️` for status.
