# Web UX/UI Design Prompt

Source: [`/scan-codebase` + `/report-uxui-all-routes`, or the routes file given as argument]
Scope: [app name / repo] — routes collected: [N]
Date: [YYYY-MM-DD]

## Prompt (ready to copy)

```text
[app-name]
Design the web UX/UI fully for desktop, tablet, and mobile.
Present as a 4-column card grid (grid-template-columns: repeat(4, 1fr)); cards per row shrink with viewport: desktop 4, tablet 2, mobile 1.
Create one card per route — [N] cards total, each card showing that route's UX/UI as a mobile-view preview.
Each card labels: route path, page name, and a one-line description.
Routes:
- `[route-path]` — [page-name] — [description]
```

## Route Summary

| No. | Route | Page | Description |
|---|---|---|---|
| 1 | `[route-path]` | `[page/component name]` | `[one line from the real page content]` |

## Fill Rules

- The very first line of the prompt is the app name only — nothing above it.
- All three viewports (desktop, tablet, mobile) must appear in the prompt body; the 4-col spec and card-per-route spec are mandatory.
- Card count equals route count exactly; never merge routes or omit any — [N] matches the Route Summary row count.
- Embed the full real route list; no placeholders like `route1, route2`. Dynamic patterns (`[id]`, `:id`, `$slug`) keep their original form.
- `No.` starts at 1; `Description` is summarized from real page content, never guessed.
- If routes > 24, still list every one but warn the grid will be long.
