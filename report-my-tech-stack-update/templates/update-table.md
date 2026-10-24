# Tech Stack Update Report

Source: [`bun outdated` / `cargo outdated` / `mcp7_list_releases` / release notes]
Scope: [repo or tech-stack categories covered]
Date: [YYYY-MM-DD] — window: [this week / last week]

Top highlights: [1–5 headline items, security and breaking first]

## Updates — [category]

| No. | Library | Category | Current Version | Latest Version | Impact | Summary |
|---|---|---|---|---|---|---|
| 1 | `[library-name]` | `[Runtime]` | `[x.y.z]` | `[a.b.c]` | `[Security]` | `[one-line what changed / why it matters]` |

## Fill Rules

- `No.` starts at 1 and is continuous across the whole report, not per table; repeat the `## Updates` table once per category, rows grouped/ordered by impact.
- `Category` ∈ Runtime, Framework, Data, Frontend, Dev Tools, Infrastructure, Services.
- `Impact` ∈ Security, Breaking Changes, New Features, Bug Fixes; ordering priority Security > Breaking Changes > New Features > Bug Fixes.
- `Current Version` / `Latest Version` are real read values from a check tool or release feed — never guessed; `unknown` when not verifiable.
- `Summary` reflects the verified release notes / changelog; major bumps that need a migration guide say so here.
- Only updates that landed within the stated date window appear; verify each release date before adding a row.
